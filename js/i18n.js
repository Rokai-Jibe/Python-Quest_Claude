(function(){
  var fr={},cur={};
  var I18n={
    lang:'fr',
    load:function(lang){
      var base=fetch('i18n/fr.json').then(function(r){return r.json();}).then(function(j){fr=j;});
      return base.then(function(){
        if(lang==='fr'){cur={};return;}
        return fetch('i18n/'+lang+'.json').then(function(r){return r.json();}).then(function(j){cur=j;}).catch(function(){cur={};});
      }).then(function(){I18n.lang=lang;});
    },
    t:function(key){
      if(cur[key]!==undefined)return cur[key];
      if(fr[key]!==undefined)return fr[key];
      return key;
    },
    has:function(key){return fr[key]!==undefined;}
  };
  window.I18n=I18n;
})();
