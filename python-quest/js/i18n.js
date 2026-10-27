// Python Quest — internationalisation (fr = repli)
window.PQ = window.PQ || {};
PQ.i18n = (function () {
  'use strict';
  let dict = {};
  const FALLBACK = 'fr';
  async function load(lang) {
    try { dict = await (await fetch('i18n/' + lang + '.json')).json(); } catch (e) { /* fallback */ }
    if (lang !== FALLBACK) {
      try {
        const fb = await (await fetch('i18n/' + FALLBACK + '.json')).json();
        dict = Object.assign({}, fb, dict);
      } catch (e) { dict = {}; }
    }
    const nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
    PQ.lang = (['fr', 'en', 'de'].indexOf(lang) !== -1) ? lang : nav;
  }
  function t(key, vars) {
    let s = dict[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(String(vars[k])); });
    return s;
  }
  return { load: load, t: t };
})();
