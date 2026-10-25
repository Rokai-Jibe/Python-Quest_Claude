(function(){
  // Légende : # mur, . sol, , haute herbe, T arbre, D porte, S panneau, M mentor
  var maps={
    village:{name:'map.village',rows:[
      '####################',
      '#..................#',
      '#..................#',
      '#....S.............#',
      '#..................#',
      '#..M...............#',
      '#..................#',
      '#..................#',
      '#................,,.',
      '####################'
    ],links:[],npcs:[
      {x:3,y:5,name:'npc.mentor.name',pages:['npc.mentor.1','npc.mentor.2']},
      {x:5,y:3,name:'',pages:['sign.village']}
    ]}
  };
  window.Maps=maps;
})();
