// Python Quest — donjon de l'Indentation : salles-puzzles de code
window.PQ = window.PQ || {};

PQ.dungeon = (function () {
  'use strict';

  var ROOMS = [
    { id: 'd1', title: 'Salle des Deux-Points', code: 'x = 10\nif x > 5:\n    print("grand")', expected: 'grand', reward: { gold: 5, xp: 10 } },
    { id: 'd2', title: 'Couloir de la Boucle', code: 'for i in range(4):\n    print(i, end=" ")', expected: '0 1 2 3', reward: { gold: 8, xp: 15 } },
    { id: 'd3', title: 'Salle des Variables', code: 'x = 3\nprint(x)', expected: '3', reward: { gold: 12, xp: 20 } },
    { id: 'd4', title: 'Salle du Gardien', code: 'print("Bonjour")', expected: 'Bonjour', reward: { gold: 25, xp: 50 } }
  ];

  var state = { room: 0, cleared: false, log: [] };

  function current() { return ROOMS[state.room] || null; }

  function enter() {
    state.room = 0; state.cleared = false; state.log = [];
    return { room: current(), rooms: ROOMS.length };
  }

  function submit(code) {
    if (state.cleared) return { ok: false, error: 'Donjon déjà terminé.' };
    var room = current();
    if (!room) return { ok: false, error: 'Aucune salle active.' };
    var res = PQ.pyrunner.check(code, room.expected);
    if (!res.passed) {
      state.log.push({ room: room.id, code: code, error: res.error || 'Sortie inattendue : ' + res.output });
      return { ok: false, error: res.error || 'Sortie inattendue : « ' + res.output + ' »', room: room };
    }
    var s = PQ.state.s;
    s.gold += room.reward.gold || 0;
    s.xp += room.reward.xp || 0;
    PQ.state.save();
    state.room += 1;
    if (state.room >= ROOMS.length) { state.cleared = true; return { ok: true, cleared: true, room: room, reward: room.reward }; }
    return { ok: true, cleared: false, room: room, next: current(), reward: room.reward };
  }

  function reset() { state.room = 0; state.cleared = false; state.log = []; }

  return { rooms: ROOMS, enter: enter, submit: submit, current: current, reset: reset, get state() { return state; } };
})();
