// Python Quest — API publique de debug/test (window.__game)
window.PQ = window.PQ || {};
(function () {
  'use strict';
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  function game() {
    return {
      version: '1.0.0',
      getPos: function () {
        var s = PQ.state.s;
        return { x: s.x, y: s.y, map: s.map };
      },
      getState: function () {
        return JSON.parse(JSON.stringify(PQ.state.s));
      },
      move: function (dir) {
        var d = DIRS[String(dir || '').toLowerCase()];
        if (!d) return false;
        PQ.engine.tryMove(d[0], d[1]);
        return true;
      },
      act: function () { PQ.engine.action(); return true; },
      render: function () { PQ.engine.render(); return true; },
      maps: function () { return Object.keys(PQ.MAPS || {}); },
      counts: function () { return PQ.content ? PQ.content.count() : null; },
      setPos: function (x, y, map) {
        var s = PQ.state.s;
        if (typeof x === 'number') s.x = x;
        if (typeof y === 'number') s.y = y;
        if (map) s.map = map;
        PQ.state.save();
        PQ.engine.render();
        return this.getPos();
      }
    };
  }

  window.__game = game();
})();
