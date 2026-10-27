// Python Quest — contenus narratifs : liens, PNJ, créatures, questions, défis de code, quêtes
window.PQ = window.PQ || {};

PQ.LINKS = [
  { id: 'village-forest', from: 'village', to: 'forest', label: 'Chemin de la Forêt des Boucles' },
  { id: 'forest-dungeon', from: 'forest', to: 'dungeon', label: 'Grotte du Donjon de l’Indentation' },
  { id: 'village-maison-mage', from: 'village', to: 'house1', label: 'Maison du Mage' },
  { id: 'village-maison-forge', from: 'village', to: 'house2', label: 'Maison du Forgeron' },
  { id: 'village-boutique', from: 'village', to: 'shop', label: 'Boutique' }
];

PQ.NPCS = {
  mage: { id: 'mage', name: 'Mage Mentor', role: 'mentor', quest: 'q-mage', lines: ['npc.mage1', 'npc.mage2'] },
  cat: { id: 'cat', name: 'Chat', role: 'animal', quest: 'q-cat', lines: ['npc.cat1'] },
  merchant: { id: 'merchant', name: 'Marchand ambulant', role: 'marchand', quest: 'q-merchant', lines: ['npc.merchant1'] },
  smith: { id: 'smith', name: 'Forgeron', role: 'forgeron', quest: 'q-smith', lines: ['npc.smith1'] },
  shopkeeper: { id: 'shopkeeper', name: 'Marchande', role: 'marchande', quest: 'q-shop', lines: ['npc.shopkeeper1'] },
  vsign: { id: 'vsign', name: 'Panneau du village', role: 'panneau', quest: 'q-village', lines: ['sign.village'] },
  vsign2: { id: 'vsign2', name: 'Panneau du village (sud)', role: 'panneau', quest: 'q-village', lines: ['sign.village'] },
  fsign: { id: 'fsign', name: 'Panneau de la forêt', role: 'panneau', quest: 'q-forest', lines: ['sign.forest'] }
};

PQ.CREATURES = {
  snake: { id: 'snake', name: 'Serpent indenteur', hp: 18, dmg: 5, gold: 6, xp: 10, tier: 1, weakness: 'indentation' },
  slime: { id: 'slime', name: 'Slime de mémoire', hp: 12, dmg: 4, gold: 4, xp: 8, tier: 1, weakness: 'variables' },
  guardian: { id: 'guardian', name: 'Gardien des Deux-Points', hp: 30, dmg: 8, gold: 20, xp: 30, tier: 2, weakness: 'syntaxe' }
};

PQ.QUESTIONS = [
  { id: 'q-lang', q: 'Quel langage apprends-tu dans ce jeu ?', a: ['Python', 'JavaScript', 'HTML', 'CSS'], answer: 0, expl: 'Python : syntaxe simple, indentation obligatoire.' },
  { id: 'q-print', q: 'Quelle fonction affiche du texte à l’écran ?', a: ['show()', 'print()', 'echo()', 'display()'], answer: 1, expl: 'print("texte") affiche le texte.' },
  { id: 'q-indent', q: 'Comment s’écrit un bloc indenté en Python ?', a: ['avec des { }', 'avec des tabulations ou 4 espaces', 'avec des ;', 'sans rien'], answer: 1, expl: 'L’indentation délimite les blocs.' },
  { id: 'q-comment', q: 'Quel symbole commence un commentaire ?', a: ['#', '//', '<!--', '--'], answer: 0, expl: '# jusqu’à la fin de la ligne.' },
  { id: 'q-type', q: 'Quel type contient un nombre entier ?', a: ['int', 'str', 'list', 'bool'], answer: 0, expl: 'int = entier.' },
  { id: 'q-save', q: 'Comment s’écrit la division entière en Python ?', a: ['/', '//', '%', '**'], answer: 1, expl: '7 // 2 vaut 3.' }
];

PQ.CODE_QUESTIONS = [
  { id: 'c-hello', title: 'Dire bonjour', prompt: 'Affiche exactement : Bonjour', code: 'print("Bonjour")', expected: 'Bonjour', hint: 'print("texte")' },
  { id: 'c-var', title: 'Stocker un nombre', prompt: 'Crée la variable x valant 3 puis affiche x', code: 'x = 3\nprint(x)', expected: '3', hint: 'x = 3 puis print(x)' },
  { id: 'c-loop', title: 'Compter', prompt: 'Affiche 0 1 2 3 sur une ligne', code: 'for i in range(4):\n    print(i, end=" ")', expected: '0 1 2 3', hint: 'range(4) et print(i, end=" ")' },
  { id: 'c-if', title: 'Condition', prompt: 'Affiche grand si x vaut 10', code: 'x = 10\nif x > 5:\n    print("grand")', expected: 'grand', hint: 'if x > 5: puis bloc indenté' }
];

PQ.QUESTS = [
  { id: 'q-mage', title: 'Le testament du Mage', npc: 'mage', steps: ['Parler au Mage Mentor', 'Apprendre le sort print("Bonjour !")'], reward: { gold: 5, xp: 10 } },
  { id: 'q-smith', title: 'Le fer de la Forêt des Boucles', npc: 'smith', steps: ['Parler au Forgeron', 'Rendre visite à la boutique'], reward: { gold: 10, xp: 15 } },
  { id: 'q-shop', title: 'Le commerce de Codeville', npc: 'shopkeeper', steps: ['Parler à la Marchande', 'Acheter une épée'], reward: { gold: 0, xp: 12 } },
  { id: 'q-forest', title: 'La boucle sauvage', npc: null, steps: ['Traverser la Forêt des Boucles', 'Vaincre un serpent indenteur'], reward: { gold: 8, xp: 20 } },
  { id: 'q-dungeon', title: 'Le Gardien des Deux-Points', npc: null, steps: ['Atteindre le Donjon de l’Indentation', 'Vaincre le gardien'], reward: { gold: 25, xp: 50 } }
];

PQ.QUIZ = [
  { tier: 1, q: 'Comment affiche-t-on « Bonjour » en Python ?', a: ['echo "Bonjour"', 'print("Bonjour")', 'System.out.print', 'printf'], answer: 1, expl: 'print() est la fonction d\u2019affichage de Python.' },
  { tier: 1, q: 'Quel type pour un nombre entier ?', a: ['int', 'str', 'float', 'bool'], answer: 0, expl: 'int = entier.' },
  { tier: 1, q: 'Quel symbole ouvre un commentaire ?', a: ['//', '<!--', '#', '/*'], answer: 2, expl: '# commentaire' },
  { tier: 1, q: 'Que donne len("Python") ?', a: ['5', '6', '7', 'Erreur'], answer: 1, expl: '6 lettres.' },
  { tier: 1, q: 'Comment déclare-t-on une variable x à 3 ?', a: ['var x = 3', 'x = 3', 'int x = 3', 'let x = 3'], answer: 1, expl: 'Affectation simple : x = 3.' },
  { tier: 1, q: 'Quel type pour du texte ?', a: ['int', 'str', 'txt', 'char'], answer: 1, expl: 'str = chaîne de caractères.' },
  { tier: 1, q: 'Quel est le résultat de 7 // 2 ?', a: ['3.5', '3', '4', '1'], answer: 1, expl: '// est la division entière.' },
  { tier: 1, q: 'Quel est le résultat de 7 % 2 ?', a: ['3.5', '1', '3', '0'], answer: 1, expl: '% est le reste de la division.' },
  { tier: 1, q: 'Comment convertir "12" en nombre ?', a: ['int("12")', 'number("12")', 'str(12)', '12++'], answer: 0, expl: 'int("12") convertit la chaîne.' },
  { tier: 1, q: 'Comment écrit-on une boucle qui compte jusqu\u2019à 4 ?', a: ['for i in range(5)', 'for (i=0;i<5;i++)', 'loop i to 5', 'while range(5)'], answer: 0, expl: 'range(5) donne 0,1,2,3,4.' },
  { tier: 1, q: 'Quelle indentation est correcte après if x > 0 :', a: ['if x > 0: print(x)', 'if x > 0: |print(x)', 'if x > 0 then print(x)', 'if x > 0; print(x)'], answer: 1, expl: 'Un bloc indenté (4 espaces) suit les deux-points.' },
  { tier: 1, q: 'Comment note-t-on « différent de » ?', a: ['!=', '=/=', '<>', 'neq'], answer: 0, expl: '!=' },
  { tier: 1, q: 'Que fait list.append(3) ?', a: ['Ajoute 3 à la fin', 'Insère 3 au début', 'Supprime 3', 'Trie la liste'], answer: 0, expl: 'append ajoute à la fin.' },
  { tier: 1, q: 'Comment accède-t-on au 1er élément de ma_liste ?', a: ['ma_liste[0]', 'ma_liste(0)', 'ma_liste[1]', 'first(ma_liste)'], answer: 0, expl: 'Les indices commencent à 0.' },
  { tier: 1, q: 'Que veut dire bool ?', a: ['Un vrai/faux', 'Un nombre', 'Un texte', 'Une liste'], answer: 0, expl: 'bool = booléen True/False.' },
  { tier: 2, q: 'Comment définir une fonction f qui renvoie 2 ?', a: ['def f(): return 2', 'function f() { return 2 }', 'def f() -> int: yield 2', 'f = lambda2'], answer: 0, expl: 'def nom(): ... return ...' },
  { tier: 2, q: 'Que fait range(2, 6) ?', a: ['2,3,4,5', '2,3,4,5,6', '6,5,4,3,2', '1..6'], answer: 0, expl: 'Debut inclus, fin exclue.' },
  { tier: 2, q: 'Quel mot-clé crée un dictionnaire ?', a: ['{ } (accolades)', '[ ]', '( )', '< >'], answer: 0, expl: 'dict = {cle: valeur}.' },
  { tier: 2, q: 'Que fait del ma_liste[0] ?', a: ['Supprime le 1er élément', 'Ajoute un élément', 'Rien', 'Renverse la liste'], answer: 0, expl: 'del supprime par index.' },
  { tier: 2, q: 'Comment ouvrir le fichier f.txt en lecture ?', a: ['open("f.txt")', 'read("f.txt")', 'File("f.txt", "r")', 'cat f.txt'], answer: 0, expl: 'open() par défaut en lecture.' },
  { tier: 2, q: 'Que fait sorted(ma_liste) ?', a: ['Renvoie une copie triée', 'Trie en place', 'Renvoie la longueur', 'Inverse la liste'], answer: 0, expl: 'sorted renvoie une nouvelle liste.' },
  { tier: 2, q: 'Que signifie __init__ ?', a: ['Le constructeur d\u2019une classe', 'Une boucle', 'Un import', 'Un commentaire'], answer: 0, expl: 'Méthode d\u2019initialisation d\u2019instance.' },
  { tier: 2, q: 'Comment importer uniquement sqrt du module math ?', a: ['from math import sqrt', 'import sqrt from math', 'include math.sqrt', 'using math'], answer: 0, expl: 'from module import nom.' },
  { tier: 2, q: 'Que fait break dans une boucle ?', a: ['Sort de la boucle', 'Passe au tour suivant', 'Redémarre la boucle', 'Rien'], answer: 0, expl: 'break quitte la boucle ; continue saute au suivant.' },
  { tier: 2, q: 'Que renvoie "a,b".split(",") ?', a: ['["a", "b"]', '"ab"', '["a,b"]', 'Erreur'], answer: 0, expl: 'split découpe en liste.' },
  { tier: 2, q: 'Quel opérateur teste l\u2019égalité ?', a: ['==', '=', '===', 'eq'], answer: 0, expl: '== compare ; = affecte.' },
  { tier: 2, q: 'Que fait enumerate(liste) ?', a: ['Donne (index, valeur)', 'Compte les éléments', 'Trie', 'Inverse'], answer: 0, expl: 'enumerate fournit index et valeur.' },
  { tier: 2, q: 'Comment gérer une exception ?', a: ['try: ... except:', 'catch(Exception)', 'rescue', 'on error'], answer: 0, expl: 'try/except en Python.' },
  { tier: 2, q: 'Que signifie None ?', a: ['Absence de valeur', 'Zéro', 'Chaîne vide', 'Erreur'], answer: 0, expl: 'None = pas de valeur.' },
  { tier: 2, q: 'Que fait "ab" * 2 ?', a: ['"abab"', '"ab2"', 'Erreur', '["ab","ab"]'], answer: 0, expl: 'Répétition de chaîne.' }
];

PQ.quiz = {
  random: function (tier) {
    const pool = PQ.QUIZ.filter(function (q) { return q.tier === tier; });
    return pool[Math.floor(Math.random() * pool.length)] || PQ.QUIZ[0];
  }
};

PQ.content = {
  count: function () {
    return {
      maps: Object.keys(PQ.MAPS || {}).length,
      links: (PQ.LINKS || []).length,
      npcs: Object.keys(PQ.NPCS || {}).length,
      creatures: Object.keys(PQ.CREATURES || {}).length,
      questions: (PQ.QUESTIONS || []).length,
      codeQuestions: (PQ.CODE_QUESTIONS || []).length,
      quests: (PQ.QUESTS || []).length
    };
  }
};
