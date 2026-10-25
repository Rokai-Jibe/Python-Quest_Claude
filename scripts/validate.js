// Python Quest — validateur statique (node scripts/validate.js)
// Vérifie : fichiers présents, JSON valides, scripts déclarés dans index.html existants,
// clés i18n utilisées dans data-maps.js présentes dans fr.json, cartes cohérentes.
'use strict';
var fs = require('fs');
var path = require('path');
var root = path.resolve(__dirname, '..');
var fail = 0;
function ok(msg) { console.log('  OK  ' + msg); }
function ko(msg) { console.log(' FAIL ' + msg); fail++; }
var required = ['index.html', 'manifest.json', 'README.md', 'css/style.css',
  'i18n/fr.json', 'i18n/en.json', 'i18n/de.json',
  'js/i18n.js', 'js/state.js', 'js/data-maps.js', 'js/quiz.js', 'js/combat.js',
  'js/engine.js', 'js/ui.js', 'js/main.js', 'scripts/validate.js'];
required.forEach(function (f) {
  if (fs.existsSync(path.join(root, f))) ok(f); else ko('manquant : ' + f);
});
var fr, en, de;
try { fr = JSON.parse(fs.readFileSync(path.join(root, 'i18n/fr.json'), 'utf8')); ok('fr.json valide'); }
catch (e) { ko('fr.json invalide : ' + e.message); fr = {}; }
['en', 'de'].forEach(function (l) {
  try { JSON.parse(fs.readFileSync(path.join(root, 'i18n/' + l + '.json'), 'utf8')); ok(l + '.json valide'); }
  catch (e) { ko(l + '.json invalide : ' + e.message); }
});
var html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
var scripts = (html.match(/src="([^"]+)"/g) || []).map(function (s) { return s.slice(5, -1); });
scripts.forEach(function (s) {
  if (fs.existsSync(path.join(root, s))) ok('script présent : ' + s); else ko('script manquant : ' + s);
});
var data = fs.readFileSync(path.join(root, 'js/data-maps.js'), 'utf8');
var keys = data.match(/'(map|npc|sign|enemy|item)\.[a-z0-9_]+'/g) || [];
keys.forEach(function (raw) {
  var k = raw.slice(1, -1);
  if (fr[k]) ok('i18n : ' + k); else ko('clé absente de fr.json : ' + k);
});
var MAPS = {}, ene = {};
global.window = { PQ: {} };
eval(data.replace('window.PQ = window.PQ || {};', 'window.PQ = window.PQ || {};'));
MAPS = window.PQ.MAPS || {}; ene = window.PQ.ENEMIES || {};
Object.keys(ene).forEach(function (id) {
  if (fr[ene[id].key]) ok('ennemi i18n : ' + id); else ko('clé ennemi absente : ' + ene[id].key);
});
Object.keys(MAPS).forEach(function (id) {
  var m = MAPS[id];
  if (!Array.isArray(m.rows) || !m.rows.length) return ko(id + ' : pas de lignes');
  if (fr[m.title]) ok('carte i18n : ' + id); else ko('titre carte absent : ' + m.title);
  m.rows.forEach(function (r, y) {
    if (typeof r !== 'string') ko(id + ' ligne ' + y + ' : pas une chaîne');
  });
  (m.npcs || []).forEach(function (n) {
    var row = m.rows[n.y];
    if (!row || !row[n.x]) ko(id + ' : PNJ ' + n.id + ' hors carte');
  });
  (m.doors || []).forEach(function (d) {
    if (!MAPS[d.to]) ko(id + ' : porte vers carte inconnue ' + d.to);
    var dest = MAPS[d.to];
    if (dest && dest.rows[d.ty] && !dest.rows[d.ty][d.tx]) ko(id + ' -> ' + d.to + ' : cible porte hors carte');
  });
});
console.log(fail ? ('\n' + fail + ' problème(s).') : '\nVALIDATEUR AU VERT : tout est bon.');
process.exit(fail ? 1 : 0);
