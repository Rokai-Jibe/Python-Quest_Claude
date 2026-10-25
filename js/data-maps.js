// Python Quest — définition des cartes, portes, PNJ et enseignements
window.PQ = window.PQ || {};
PQ.MAPS = {
  village: {
    title: 'map.village', music: null,
    // # = arbre, ~ = eau, . = sol, = = chemin, = = maison(toit), d = porte, c = comptoir, s = panneau
    rows: [
      '###########.##########',
      '#....=====....=======.#',
      '#.T..=...=...=.....=..#',
      '#.T..=.d.=...=.ddd.=..#',
      '#....=====...=====d==.#',
      '#.......s...........==#',
      '#..................==.#',
      '#..T........~~~....==.#',
      '#..T........~~~....===d',
      '#...........s.........#',
      '#########.############'
    ],
    legend: { '.': 'grass', '=': 'path', '#': 'tree', 'T': 'tree', '~': 'water', 'd': 'door' },
    walkable: '.=~',
    doors: [
      { x: 5, y: 3, to: 'house1', tx: 3, ty: 2 },
      { x: 9, y: 3, to: 'shop', tx: 3, ty: 2 },
      { x: 15, y: 3, to: 'house2', tx: 3, ty: 2 },
      { x: 19, y: 3, to: 'shop', tx: 3, ty: 2 },
      { x: 19, y: 4, to: 'house2', tx: 3, ty: 2 },
      { x: 22, y: 8, to: 'forest', tx: 2, ty: 8 }
    ],
    npcs: [
      { id: 'mage', ch: 'M', x: 12, y: 5, lines: ['npc.mage1', 'npc.mage2'], spell: 'print("Bonjour !")' },
      { id: 'cat', ch: 'c', x: 7, y: 7, lines: ['npc.cat1'] },
      { id: 'merchant', ch: '$', x: 17, y: 7, lines: ['npc.merchant1'] },
      { id: 'vsign', ch: 's', x: 9, y: 5, lines: ['sign.village'] },
      { id: 'vsign2', ch: 's', x: 9, y: 9, lines: ['sign.village'] }
    ],
    enemies: null
  },
  house1: {
    title: 'map.house1',
    rows: [
      '#######',
      '#.....#',
      '#.....#',
      '#.....#',
      '#.....#',
      '#.....4',
      '#######'
    ],
    legend: { '.': 'floor', '#': 'wall', '4': 'exit' },
    walkable: '.4',
    doors: [{ x: 5, y: 5, to: 'village', tx: 5, ty: 4 }],
    npcs: [{ id: 'mage', ch: 'M', x: 3, y: 2, lines: ['npc.mage1', 'npc.mage2'], spell: 'print("Bonjour !")' }],
    enemies: null
  },
  house2: {
    title: 'map.house2',
    rows: [
      '#######',
      '#.....#',
      '#.....#',
      '#.....#',
      '#.....#',
      '#.....#',
      '#######'
    ],
    legend: { '.': 'floor', '#': 'wall' },
    walkable: '.',
    doors: [{ x: 3, y: 5, to: 'village', tx: 15, ty: 4 }],
    npcs: [{ id: 'smith', ch: 'S', x: 3, y: 2, lines: ['npc.smith1'] }],
    enemies: null
  },
  shop: {
    title: 'map.shop',
    rows: [
      '#######',
      '#.....#',
      '#..c..#',
      '#.....#',
      '#.....#',
      '#.....5',
      '#######'
    ],
    legend: { '.': 'floor', '#': 'wall', 'c': 'counter', '5': 'exit' },
    walkable: '.5',
    doors: [{ x: 5, y: 5, to: 'village', tx: 9, ty: 4 }],
    npcs: [{ id: 'shopkeeper', ch: 'K', x: 3, y: 1, lines: ['npc.shopkeeper1'], shop: true }],
    enemies: null
  },
  forest: {
    title: 'map.forest',
    rows: [
      '########4###',
      '#....T.....#',
      '#..T....T..#',
      '#.....T....#',
      '#.T........#',
      '#4.........3',
      '#....T...T.#',
      '#.........3',
      '4..........3'
    ],
    legend: { '.': 'grass', '#': 'tree', 'T': 'tree', '3': 'door', '4': 'door' },
    walkable: '.34',
    doors: [
      { x: 2, y: 8, to: 'village', tx: 21, ty: 8 },
      { x: 0, y: 8, to: 'village', tx: 21, ty: 8 },
      { x: 0, y: 5, to: 'village', tx: 21, ty: 8 },
      { x: 7, y: 0, to: 'dungeon', tx: 3, ty: 2 }
    ],
    npcs: [{ id: 'fsign', ch: 's', x: 9, y: 5, lines: ['sign.forest'] }],
    enemies: [{ id: 'snake', ch: '~', rate: 0.25 }, { id: 'slime', ch: 'o', rate: 0.15 }]
  },
  dungeon: {
    title: 'map.dungeon',
    rows: [
      '########7',
      '#......#',
      '#..##..#',
      '#......#',
      '#..##..#',
      '#......#',
      '########'
    ],
    legend: { '.': 'cave', '#': 'wall', '7': 'exit' },
    walkable: '.7',
    doors: [{ x: 0, y: 0, to: 'forest', tx: 7, ty: 1 }],
    npcs: [],
    enemies: [{ id: 'snake', ch: '~', rate: 0.3 }, { id: 'guardian', ch: 'G', rate: 0.2 }]
  }
};

PQ.ENEMIES = {
  snake: { key: 'enemy.snake', hp: 18, dmg: 5, gold: 6, xp: 10, tier: 1 },
  slime: { key: 'enemy.slime', hp: 12, dmg: 4, gold: 4, xp: 8, tier: 1 },
  guardian: { key: 'enemy.guardian', hp: 30, dmg: 8, gold: 20, xp: 30, tier: 2 }
};
