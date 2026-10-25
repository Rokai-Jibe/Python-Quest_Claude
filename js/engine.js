(function(){
  var TILE=32,canvas,ctx,busy=false;
  var COLORS={'#':'#3b3354','.':'#4c8a4f',',':'#2f6b34','T':'#1f4d28','D':'#8a5a2b','S':'#4c8a4f','M':'#4c8a4f'};
  var EMOJI={',':'🌿','T':'🌲','D':'🚪','S':'🪧','M':'🧙'};
  var Engine={
    init:function(){canvas=document.getElementById('world');ctx=canvas.getContext('2d');Engine.resize();window.addEventListener('resize',Engine.resize);Engine.draw();},
    resize:function(){var r=canvas.getBoundingClientRect();canvas.width=Math.max(1,Math.floor(r.width));canvas.height=Math.max(1,Math.floor(r.height));Engine.draw();},
    map:function(){return window.Maps[State.data.map];},
    tile:function(x,y){var rows=Engine.map().rows;if(y<0||y>=rows.length||x<0||x>=rows[y].length)return '#';return rows[y][x];},
    walkable:function(x,y){var t=Engine.tile(x,y);if(t==='#'||t==='T'||t==='S'||t==='M')return false;return !Engine.npcAt(x,y);},
    npcAt:function(x,y){var n=Engine.map().npcs||[];for(var i=0;i<n.length;i++){if(n[i].x===x&&n[i].y===y)return n[i];}return null;},
    move:function(dir){
      if(busy||UI.isDialogOpen())return false;
      var d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!d)return false;
      State.data.facing=dir;
      var nx=State.data.x+d[0],ny=State.data.y+d[1];
      if(Engine.walkable(nx,ny)){State.data.x=nx;State.data.y=ny;State.save();}
      Engine.draw();return true;
    },
    interact:function(){
      if(UI.isDialogOpen()){UI.next();return;}
      var d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[State.data.facing||'down'];
      var n=Engine.npcAt(State.data.x+d[0],State.data.y+d[1]);
      if(n){UI.say(n.name,n.pages);}
    },
    draw:function(){
      if(!ctx||!window.Maps)return;
      var m=Engine.map(),w=canvas.width,h=canvas.height;
      ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
      var cx=Math.floor(w/2-State.data.x*TILE-TILE/2),cy=Math.floor(h/2-State.data.y*TILE-TILE/2);
      ctx.font=(TILE-6)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';
      for(var y=0;y<m.rows.length;y++){for(var x=0;x<m.rows[y].length;x++){
        var t=m.rows[y][x],px=cx+x*TILE,py=cy+y*TILE;
        ctx.fillStyle=COLORS[t]||'#4c8a4f';ctx.fillRect(px,py,TILE,TILE);
        if(EMOJI[t])ctx.fillText(EMOJI[t],px+TILE/2,py+TILE/2+2);
      }}
      ctx.fillText('🧙‍♂️',cx+State.data.x*TILE+TILE/2,cy+State.data.y*TILE+TILE/2+2);
      var hm=document.getElementById('hud-map'),hs=document.getElementById('hud-stats');
      if(hm)hm.textContent=I18n.t(m.name);
      if(hs)hs.textContent=I18n.t('hud.hp')+' '+State.data.hp+'/'+State.data.maxHp+'  '+I18n.t('hud.gold')+' '+State.data.gold;
    }
  };
  window.Engine=Engine;
})();
