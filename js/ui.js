(function(){
  var pages=[],idx=0,box,nameEl,textEl;
  var UI={
    init:function(){
      box=document.getElementById('dialog');nameEl=document.getElementById('dialog-name');textEl=document.getElementById('dialog-text');
      document.getElementById('dialog-ok').addEventListener('click',UI.next);
    },
    isDialogOpen:function(){return !box.hidden;},
    say:function(name,keys){pages=keys;idx=0;nameEl.textContent=name?I18n.t(name):'';UI.show();box.hidden=false;},
    show:function(){textEl.textContent=I18n.t(pages[idx]);},
    next:function(){idx++;if(idx>=pages.length){box.hidden=true;return;}UI.show();}
  };
  window.UI=UI;
})();
