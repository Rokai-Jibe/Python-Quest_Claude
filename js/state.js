// Python Quest — état du joueur + sauvegarde localStorage
window.PQ = window.PQ || {};
PQ.state = (function () {
  'use strict';
  const KEY = 'pythonquest.save';
  const def = function () {
    return { map: 'village', x: 5, y: 5, hp: 50, maxHp: 50, gold: 10, xp: 0, level: 1,
      dmg: 8, items: { potion: 1 }, spells: [], seen: {}, lang: null };
  };
  let s = def();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) s = Object.assign(def(), JSON.parse(raw));
  } catch (e) { /* fresh game */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function reset() { s = def(); save(); return s; }
  return { get s() { return s; }, save: save, reset: reset };
})();
