// Python Quest — démarrage, contrôles clavier et tactiles
window.PQ = window.PQ || {};
window.addEventListener('error', function (e) {
  document.getElementById('error').textContent = 'Erreur : ' + e.message;
});
(function () {
  'use strict';
  function start() {
    PQ.ui.init();
    PQ.engine.render();
  }
  document.addEventListener('DOMContentLoaded', function () {
    PQ.i18n.load(PQ.state.s.lang).then(function () { PQ.state.s.lang = PQ.lang; start(); });
  });
  document.addEventListener('keydown', function (e) {
    var k = e.key.toLowerCase();
    if (PQ.ui.isOpen()) {
      if (k === 'a' || k === 'enter' || k === ' ' || k === 'e') { document.getElementById('dialog-ok').click(); }
      return;
    }
    if (k === 'arrowup' || k === 'w' || k === 'z') PQ.engine.tryMove(0, -1);
    else if (k === 'arrowdown' || k === 's') PQ.engine.tryMove(0, 1);
    else if (k === 'arrowleft' || k === 'a' || k === 'q') PQ.engine.tryMove(-1, 0);
    else if (k === 'arrowright' || k === 'd') PQ.engine.tryMove(1, 0);
    else if (k === 'a' || k === 'enter' || k === ' ' || k === 'e') PQ.engine.action();
  });
  document.querySelectorAll('#touch button[data-dir]').forEach(function (b) {
    b.addEventListener('click', function () {
      var d = b.getAttribute('data-dir');
      if (d === 'up') PQ.engine.tryMove(0, -1);
      if (d === 'down') PQ.engine.tryMove(0, 1);
      if (d === 'left') PQ.engine.tryMove(-1, 0);
      if (d === 'right') PQ.engine.tryMove(1, 0);
    });
  });
  document.getElementById('touch-act').addEventListener('click', function () {
    if (PQ.ui.isOpen()) document.getElementById('dialog-ok').click(); else PQ.engine.action();
  });
})();
