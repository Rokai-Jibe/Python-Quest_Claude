// Python Quest — combats au tour par tour, attaque = bonne réponse au quiz
window.PQ = window.PQ || {};
PQ.combat = (function () {
  'use strict';
  var t = function (k) { return PQ.i18n.t(k); };
  function start(enemyId) {
    var E = PQ.ENEMIES[enemyId];
    var s = PQ.state.s;
    var ehp = E.hp;
    var busy = { done: false };
    function turn() {
      PQ.ui.menu(t('combat.turn', { e: t(E.key), h: ehp, p: s.hp }), [
        { label: t('ui.attack'), fn: attack },
        { label: t('ui.potion'), fn: potion },
        { label: t('ui.flee'), fn: flee }
      ]);
    }
    function attack() {
      var q = PQ.quiz.random(E.tier);
      var labels = [q.a[0], q.a[1], q.a[2], q.a[3]];
      PQ.ui.menu(t('combat.question', { q: q.q, a: labels[0], b: labels[1], c: labels[2], d: labels[3] }),
        [0, 1, 2, 3].map(function (i) {
          return { label: (i + 1) + ') ' + labels[i], fn: function () {
            if (i === q.answer) {
              ehp -= s.dmg;
              PQ.ui.dialog(t('combat.correct', { d: s.dmg }) + '\n\n' + q.expl, function () {
                if (ehp <= 0) return win();
                enemyStrike();
              });n            } else {
              s.hp -= 3;
              PQ.ui.dialog(t('combat.wrong', { d: 3 }) + '\n\n' + q.expl, function () {
                if (s.hp <= 0) return dead();
                enemyStrike();
              });
            }
          } };
        }));
    }
    function enemyStrike() {
      s.hp -= E.dmg;
      PQ.state.save();
      if (s.hp <= 0) return dead();
      PQ.ui.dialog(t(E.key) + ' ! -' + E.dmg + ' PV', turn);
    }
    function potion() {
      if ((s.items.potion || 0) <= 0) return PQ.ui.dialog(t('msg.no.potion'), turn);
      s.items.potion--;
      s.hp = Math.min(s.maxHp, s.hp + 20);
      PQ.state.save();
      PQ.ui.hud();
      enemyStrike();
    }
    function flee() {
      if (Math.random() < 0.5) { PQ.ui.dialog(t('msg.flee'), function () { PQ.ui.close(); PQ.engine.render(); }); return; }
      PQ.ui.dialog('!', enemyStrike);
    }
    function win() {
      s.gold += E.gold; s.xp += E.xp;
      PQ.state.save(); PQ.ui.hud();
      PQ.ui.dialog(t('msg.win', { g: E.gold, x: E.xp }), function () { PQ.ui.close(); PQ.engine.render(); });
    }
    function dead() {
      s.hp = s.maxHp;
      s.map = 'village'; s.x = 12; s.y = 7;
      PQ.state.save(); PQ.ui.hud();
      PQ.ui.dialog(t('msg.dead'), function () { PQ.ui.close(); PQ.engine.render(); });
    }
    turn();
    return busy;
  }
  return { start: start };
})();
