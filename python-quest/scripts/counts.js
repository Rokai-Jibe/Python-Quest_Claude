// Python Quest — compte les éléments de contenu (node scripts/counts.js)
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var root = path.resolve(__dirname, '..');

var sandbox = { console: console };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
['js/data-maps.js', 'js/data-content.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
});
var PQ = sandbox.PQ;
var counts = {
  maps: Object.keys(PQ.MAPS || {}).length,
  links: (PQ.LINKS || []).length,
  npcs: Object.keys(PQ.NPCS || {}).length,
  creatures: Object.keys(PQ.CREATURES || {}).length,
  questions: (PQ.QUESTIONS || []).length,
  codeQuestions: (PQ.CODE_QUESTIONS || []).length,
  quests: (PQ.QUESTS || []).length,
  quizBank: (PQ.QUIZ || []).length
};
console.log(JSON.stringify(counts, null, 2));
