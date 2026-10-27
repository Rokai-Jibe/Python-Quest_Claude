// Python Quest — moteur : rendu, déplacement, collisions, portes, PNJ, rencontres
window.PQ = window.PQ || {};
PQ.engine = (function () {
  'use strict';
  var S = function () { return PQ.state.s; };
  var inCombat = false;
  function current() { return PQ.MAPS[S().map]; }
  function tile(x, y) {
    var m = current();
    if (y < 0 || y >= m.rows.length) return '#';
    var row = m.rows[y];
    if (x < 0 || x >= row.length) return '#';
    return row[x];
  }
  function walkable(x, y) {
    var m = current();
    var ch = tile(x, y);
    if (m.legend[ch]) { var v = m.legend[ch]; if (v === 'wall' || v === 'tree' || v === 'water') return false; }
    // portes de sortie légendées comme door -> traversables et déclenchent transition
    if (m.walkable.indexOf(ch) !== -1) return true;
    var n = (m.npcs || []).filter(function (o) { return o.x === x && o.y === y; })[0];
    return false;
  }
  function render() {
    var m = current();
    var s = S();
    var out = [];
    for (var y = 0; y < m.rows.length; y++) {
      var line = m.rows[y].split('');
      (m.npcs || []).forEach(function (n) { if (n.y === y && line[n.x]) line[n.x] = n.ch; });
      if (s.y === y) line[s.x] = '@';
      out.push(line.join(''));
    }
    var el = document.getElementById('screen');
    el.textContent = out.join('\n');
    document.getElementById('hud-map').textContent = PQ.i18n.t(m.title);
    PQ.ui.hud();
  }
  function tryMove(dx, dy) {
    if (inCombat || PQ.ui.isOpen()) return;
    var s = S();
    var nx = s.x + dx, ny = s.y + dy;
    var m = current();
    var ch = tile(nx, ny);
    // PNJ : on bloque sur lui, pas de déplacement
    var npc = (m.npcs || []).filter(function (o) { return o.x === nx && o.y === ny; })[0];
    if (npc) { talkTo(npc); return; }
    var leg = m.legend[ch];
    if (leg === 'wall' || leg === 'tree' || leg === 'water') return;
    // Portes : sur la carte, les tuiles 'd'/chiffres = passage vers autre carte
    var door = (m.doors || []).filter(function (d) { return d.x === nx && d.y === ny; })[0];
    if (door) { s.map = door.to; s.x = door.tx; s.y = door.ty; PQ.state.save(); render(); return; }
    if (m.walkable.indexOf(ch) === -1) return;
    s.x = nx; s.y = ny; PQ.state.save();
    // Rencontres aléatoires
    var enc = (m.enemies || [])
      .map(function (e) { return Math.random() < e.rate ? e.id : null; })
      .filter(Boolean)[0];
    if (enc) { inCombat = true; render(); PQ.battle.start(enc); inCombat = false; return; }
    render();
  }
  function talkTo(npc) {
    var lines = npc.lines.map(function (k) { return PQ.i18n.t(k); });
    PQ.ui.dialog(lines.join('\n\n'), function () {
      if (npc.spell && PQ.state.s.spells.indexOf(npc.spell) === -1) {
        PQ.state.s.spells.push(npc.spell);
        PQ.state.save();
        PQ.ui.dialog(PQ.i18n.t('msg.newspell', { s: npc.spell }), function () {
          if (npc.shop) PQ.ui.shop(); else PQ.engine.render();
        });
        return;
      }
      if (npc.shop) PQ.ui.shop(); else PQ.engine.render();
    });
  }
  function action() {
    if (inCombat || PQ.ui.isOpen()) return;
    var s = S();
    var m = current();
    var near = [[s.x, s.y + 1], [s.x, s.y - 1], [s.x + 1, s.y], [s.x - 1, s.y], [s.x, s.y]];
    for (var i = 0; i < near.length; i++) {
      var npc = (m.npcs || []).filter(function (o) { return o.x === near[i][0] && o.y === near[i][1]; })[0];
      if (npc) { talkTo(npc); return; }
    }
    PQ.ui.dialog(PQ.i18n.t('msg.nothing'), function () { PQ.ui.close(); PQ.engine.render(); });
  }
  return { render: render, tryMove: tryMove, action: action };
})();
