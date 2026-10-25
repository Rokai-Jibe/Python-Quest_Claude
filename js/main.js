(function(){
  function bindControls(){
    var keys={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',z:'up',s:'down',q:'left',d:'right',w:'up',a:'left'};
    window.addEventListener('keydown',function(e){
      var k=e.key;
      if(k===' '||k==='Enter'||k==='e'||k==='E'){e.preventDefault();Engine.interact();return;}
      var dir=keys[k]||keys[(k||'').toLowerCase()];
      if(dir&&!(k==='a'||k==='A')){e.preventDefault();Engine.move(dir);}
      else if(k==='a'||k==='A'){e.preventDefault();Engine.interact();}
    });
    var btns=document.querySelectorAll('#dpad button');
    for(var i=0;i<btns.length;i++){(function(b){
      var t=null;
      function go(ev){ev.preventDefault();Engine.move(b.getAttribute('data-dir'));clearInterval(t);t=setInterval(function(){Engine.move(b.getAttribute('data-dir'));},180);}
      function stop(){clearInterval(t);}
      b.addEventListener('pointerdown',go);b.addEventListener('pointerup',stop);b.addEventListener('pointerleave',stop);b.addEventListener('pointercancel',stop);
    })(btns[i]);}
    document.getElementById('btn-a').addEventListener('click',Engine.interact);
    document.addEventListener('gesturestart',function(e){e.preventDefault();});
    document.addEventListener('touchmove',function(e){e.preventDefault();},{passive:false});
  }
  function start(){
    State.load();
    I18n.load(State.data.lang||'fr').then(function(){
      UI.init();
      document.getElementById('app').hidden=false;
      Engine.init();bindControls();
      document.getElementById('loading').hidden=true;
      window.__ready=true;
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
