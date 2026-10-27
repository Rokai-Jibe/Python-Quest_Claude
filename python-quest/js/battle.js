// Python Quest — combat au tour par tour : chaque bonne réponse au quiz blesse la créature
window.PQ = window.PQ || {};

PQ.battle = (function () {
  'use strict';
  var t = function (k, v) { return PQ.i18n.t(k, v); };

  function stats(id) {
    return (PQ.CREATURES && PQ.CREATURES[id]) || (PQ.ENEMIES && PQ.ENEMIES[id]) || null;
  }

  function start(enemyId) {
    var E = stats(enemyId);
    if (!E) return null;
    var s = PQ.state.s;
    var ehp = E.hp;
    var session = { enemy: enemyId, hp: ehp, done: false };

    function turn() {
      PQ.ui.menu(t('combat.turn', { e: t(E.key || ('enemy.' + enemyId), { s: E.name || enemyId }), h: ehp, p: s.hp }), [
        { label: t('ui.attack'), fn: attack },
        { label: t('ui.potion'), fn: potion },
        { label: t('ui.flee'), fn: flee }
      ]);
    }

    function attack() {
      var q = PQ.quiz.random(E.tier || 1);
      var labels = q.a.slice(0, 4);
      PQ.ui.menu(t('combat.question', { q: q.q, a: labels[0], b: labels[1], c: labels[2], d: labels[3] }),
        [0, 1, 2, 3].map(function (i) {
          return { label: (i + 1) + ') ' + labels[i], fn: function () {
            if (i === q.answer) {
              ehp -= s.dmg; session.hp = ehp;
              PQ.ui.dialog(t('combat.correct', { d: s.dmg }) + '\n\n' + q.expl, function () {
                if (ehp <= 0) return win();
                enemyStrike();
              });
            } else {
              s.hp -= 3; PQ.state.save();
              PQ.ui.dialog(t('combat.wrong', { d: 3 }) + '\n\n' + q.expl, function () {
                if (s.hp <= 0) return dead();
                enemyStrike();
              });
            }
          } };
        }));
    }

    function enemyStrike() {
      s.hp -= E.dmg; PQ.state.save(); PQ.ui.hud();
      if (s.hp <= 0) return dead();
      PQ.ui.dialog((E.name || enemyId) + ' ! -' + E.dmg + ' PV', turn);
    }

    function potion() {
      if ((s.items.potion || 0) <= 0) return PQ.ui.dialog(t('msg.no.potion'), turn);
      s.items.potion--;
      s.hp = Math.min(s.maxHp, s.hp + 20);
      PQ.state.save(); PQ.ui.hud();
      enemyStrike();
    }

    function flee() {
      if (Math.random() < 0.5) {
        session.done = true;
        return PQ.ui.dialog(t('msg.flee'), function () { PQ.ui.close(); PQ.engine.render(); });
      }
      PQ.ui.dialog('!', enemyStrike);
    }

    function win() {
      session.done = true;
      s.gold += E.gold || 0; s.xp += E.xp || 0;
      PQ.state.save(); PQ.ui.hud();
      PQ.ui.dialog(t('msg.win', { g: E.gold || 0, x: E.xp || 0 }), function () { PQ.ui.close(); PQ.engine.render(); });
    }

    function dead() {
      session.done = true;
      s.hp = s.maxHp; s.map = 'village'; s.x = 12; s.y = 7;
      PQ.state.save(); PQ.ui.hud();
      PQ.ui.dialog(t('msg.dead'), function () { PQ.ui.close(); PQ.engine.render(); });
    }

    turn();
    return session;
  }

  return { start: start, stats: stats };
})();
