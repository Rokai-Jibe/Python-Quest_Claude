(function(){
  var KEY='pyquest_save_v1';
  function fresh(){return {map:'village',x:5,y:6,gold:20,xp:0,lvl:1,hp:30,maxHp:30,inventory:{},quests:{},chests:{},riddles:{},bosses:{},lang:'fr',theme:'dark'};}
  var State={
    data:fresh(),
    save:function(){try{localStorage.setItem(KEY,JSON.stringify(State.data));}catch(e){}},
    load:function(){try{var s=localStorage.getItem(KEY);if(s){State.data=Object.assign(fresh(),JSON.parse(s));}}catch(e){State.data=fresh();}},
    exportCode:function(){return btoa(unescape(encodeURIComponent(JSON.stringify(State.data))));},
    importCode:function(code){State.data=Object.assign(fresh(),JSON.parse(decodeURIComponent(escape(atob(code)))));State.save();},
    reset:function(){State.data=fresh();State.save();}
  };
  window.State=State;
})();
