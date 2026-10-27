// Python Quest — validateur statique (node scripts/validate.js)
// Vérifie : fichiers requis, JSON valides, scripts d'index.html existants,
// clés i18n, cohérence des cartes (portes, PNJ) et des contenus (liens, quêtes).
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var root = path.resolve(__dirname, '..');
var fail = 0;
function ok(msg) { console.log('  OK  ' + msg); }
function ko(msg) { console.log(' FAIL ' + msg); fail++; }

var required = ['index.html', 'manifest.json', 'README.md', 'css/style.css',
  'i18n/fr.json', 'i18n/en.json', 'i18n/de.json',
  'js/i18n.js', 'js/state.js', 'js/data-maps.js', 'js/data-content.js',
  'js/pyrunner.js', 'js/battle.js', 'js/dungeon.js', 'js/engine.js', 'js/ui.js',
  'js/main.js', 'js/api.js', 'scripts/validate.js', 'scripts/counts.js'];
required.forEach(function (f) {
  if (fs.existsSync(path.join(root, f))) ok(f); else ko('manquant : ' + f);
});
['js/quiz.js', 'js/combat.js'].forEach(function (f) {
  if (fs.existsSync(path.join(root, f))) ko('fichier obsolète encore présent : ' + f);
  else ok('obsolète absent : ' + f);
});

var dicts = {};
['fr', 'en', 'de'].forEach(function (l) {
  try {
    dicts[l] = JSON.parse(fs.readFileSync(path.join(root, 'i18n/' + l + '.json'), 'utf8'));
    ok(l + '.json valide (' + Object.keys(dicts[l]).length + ' clés)');
  } catch (e) { ko(l + '.json invalide : ' + e.message); dicts[l] = {}; }
});
var fr = dicts.fr;

var html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
var scripts = (html.match(/src="([^"]+)"/g) || []).map(function (s) { return s.slice(5, -1); });
scripts.forEach(function (s) {
  if (fs.existsSync(path.join(root, s))) ok('script présent : ' + s); else ko('script manquant : ' + s);
});

// Chargement des données dans un contexte sandbox (window === global)
var sandbox = { console: console };
sandbox.window = sandbox;
vm.createContext(sandbox);
['js/data-maps.js', 'js/data-content.js'].forEach(function (f) {
  try { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f }); ok('chargé : ' + f); }
  catch (e) { ko('chargement impossible : ' + f + ' -> ' + e.message); }
});
var PQ = sandbox.PQ || {};
var MAPS = PQ.MAPS || {}, ENEMIES = PQ.ENEMIES || {};

// Clés i18n utilisées dans les données
var dataSrc = ['js/data-maps.js', 'js/data-content.js']
  .map(function (f) { return fs.readFileSync(path.join(root, f), 'utf8'); }).join('\n');
var keys = dataSrc.match(/'(map|npc|sign|enemy|item|ui|msg|combat|shop|grimoire)\.[a-z0-9_.]+'/g) || [];
var uniq = keys.map(function (k) { return k.slice(1, -1); }).filter(function (k, i, a) { return a.indexOf(k) === i; });
uniq.forEach(function (k) {
  if (fr[k]) ok('i18n fr : ' + k); else ko('clé absente de fr.json : ' + k);
});
Object.keys(dicts).forEach(function (l) {
  if (l === 'fr') return;
  var missing = uniq.filter(function (k) { return !dicts[l][k]; });
  console.log('  INFO ' + l + '.json : ' + (uniq.length - missing.length) + '/' + uniq.length + ' clés couvertes');
});

// Cartes
function tile(m, x, y) { var r = m.rows[y]; return r ? r[x] : undefined; }
function passable(m, ch) {
  if (ch === undefined) return false;
  if (m.walkable.indexOf(ch) !== -1) return true;
  var leg = m.legend && m.legend[ch];
  return leg === 'door' || leg === 'exit';
}
Object.keys(MAPS).forEach(function (id) {
  var m = MAPS[id];
  if (!Array.isArray(m.rows) || !m.rows.length) return ko(id + ' : pas de lignes');
  if (fr[m.title]) ok('carte i18n : ' + id + ' (' + m.title + ')'); else ko('titre carte absent : ' + m.title);
  var width = m.rows[0].length;
  m.rows.forEach(function (r, y) {
    if (typeof r !== 'string') ko(id + ' ligne ' + y + ' : pas une chaîne');
    else if (r.length !== width) ko(id + ' ligne ' + y + ' : largeur ' + r.length + ' != ' + width);
  });
  if (!m.legend) ko(id + ' : légende absente');
  if (!m.walkable) ko(id + ' : liste walkable absente');
  (m.npcs || []).forEach(function (n) {
    var row = m.rows[n.y];
    if (!row || row[n.x] === undefined) ko(id + ' : PNJ ' + n.id + ' hors carte');
    else ok('PNJ dans la carte : ' + id + '/' + n.id + ' (' + n.x + ',' + n.y + ')');
    if (!PQ.NPCS || !PQ.NPCS[n.id]) ko(id + ' : PNJ ' + n.id + ' absent de PQ.NPCS');
  });
  (m.doors || []).forEach(function (d) {
    var src = tile(m, d.x, d.y);
    if (src === undefined) ko(id + ' : porte hors carte (' + d.x + ',' + d.y + ')');
    else if (!passable(m, src)) ko(id + ' : porte (' + d.x + ',' + d.y + ') sur tuile non traversable "' + src + '"');
    var dest = MAPS[d.to];
    if (!dest) return ko(id + ' : porte vers carte inconnue ' + d.to);
    var dt = tile(dest, d.tx, d.ty);
    if (dt === undefined) ko(id + ' -> ' + d.to + ' : cible hors carte (' + d.tx + ',' + d.ty + ')');
    else if (!passable(dest, dt)) ko(id + ' -> ' + d.to + ' : cible non traversable "' + dt + '"');
    else ok('porte : ' + id + ' (' + d.x + ',' + d.y + ') -> ' + d.to + ' (' + d.tx + ',' + d.ty + ')');
  });
  (m.enemies || []).forEach(function (e) {
    if (!ENEMIES[e.id]) ko(id + ' : ennemi inconnu ' + e.id);
    else if (!fr[ENEMIES[e.id].key]) ko(id + ' : clé i18n ennemi absente ' + ENEMIES[e.id].key);
  });
});

// Contenus
var counts = {
  maps: Object.keys(MAPS).length,
  links: (PQ.LINKS || []).length,
  npcs: Object.keys(PQ.NPCS || {}).length,
  creatures: Object.keys(PQ.CREATURES || {}).length,
  questions: (PQ.QUESTIONS || []).length,
  codeQuestions: (PQ.CODE_QUESTIONS || []).length,
  quests: (PQ.QUESTS || []).length,
  quiz: (PQ.QUIZ || []).length
};
Object.keys(counts).forEach(function (k) {
  if (counts[k] > 0) ok('contenu ' + k + ' : ' + counts[k]); else ko('contenu ' + k + ' vide');
});
(PQ.LINKS || []).forEach(function (l) {
  if (!MAPS[l.from] || !MAPS[l.to]) ko('lien ' + l.id + ' : carte inconnue');
});
(PQ.QUESTS || []).forEach(function (q) {
  if (q.npc && (!PQ.NPCS || !PQ.NPCS[q.npc])) ko('quête ' + q.id + ' : PNJ inconnu ' + q.npc);
  if (!q.steps || !q.steps.length) ko('quête ' + q.id + ' : étapes absentes');
});
function checkMcq(list, label) {
  list.forEach(function (q) {
    if (!Array.isArray(q.a) || q.a.length !== 4) ko(label + ' ' + q.id + ' : 4 choix attendus');
    else if (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3) ko(label + ' ' + q.id + ' : index de réponse invalide');
  });
}
checkMcq(PQ.QUESTIONS || [], 'question');
checkMcq(PQ.QUIZ || [], 'quiz');
(PQ.CODE_QUESTIONS || []).forEach(function (c) {
  if (!c.code || !c.expected) ko('défi de code ' + c.id + ' : code/expected manquant');
});
Object.keys(PQ.CREATURES || {}).forEach(function (id) {
  var c = PQ.CREATURES[id];
  if (!c.hp || !c.dmg) ko('créature ' + id + ' : statistiques incomplètes');
});

console.log('\nCOMPTES : ' + JSON.stringify(counts));
console.log(fail ? ('\n' + fail + ' problème(s).') : '\nVALIDATEUR AU VERT : tout est bon.');
process.exit(fail ? 1 : 0);
