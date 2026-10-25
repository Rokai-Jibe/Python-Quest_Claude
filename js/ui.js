// Python Quest — interface : dialogues, menus, boutique, grimoire, HUD
window.PQ = window.PQ || {};
PQ.ui = (function () {
  'use strict';
  var t = function (k, v) { return PQ.i18n.t(k, v); };
  var dialogEl, dialogText, dialogOk, menuEl;
  var open = false, cb = null;
  function init() {
    dialogEl = document.getElementById('dialog');
    dialogText = document.getElementById('dialog-text');
    dialogOk = document.getElementById('dialog-ok');
    menuEl = document.getElementById('menu');
    dialogOk.addEventListener('click', closeDialog);
  }
  function closeDialog() { dialogEl.classList.add('hidden'); open = false; if (cb) { var f = cb; cb = null; f(); } }
  function dialog(text, done) {
    if (dialogEl.classList.contains('hidden')) init();
    dialogText.textContent = text;
    dialogOk.textContent = t('ui.ok');
    dialogEl.classList.remove('hidden');
    menuEl.classList.add('hidden');
    open = true; cb = done;
  }
  function menu(text, options) {
    dialogEl.classList.add('hidden');
    menuEl.innerHTML = '';
    var p = document.createElement('p');
    p.textContent = text;
    p.style.whiteSpace = 'pre-wrap';
    menuEl.appendChild(p);
    options.forEach(function (o) {
      var b = document.createElement('button');
      b.textContent = o.label;
      b.addEventListener('click', function () { menuEl.classList.add('hidden'); open = false; o.fn(); });
      menuEl.appendChild(b);
    });
    menuEl.classList.remove('hidden');
    open = true;
  }
  function shop() {
    var s = PQ.state.s;
    menu(t('npc.shopkeeper') + ' — ' + t('ui.shop') + ' | ' + s.gold + ' or', [
      { label: t('shop.sword'), fn: function () { buy(s, 'sword', 20, function () { s.dmg += 5; }); } },
      { label: t('shop.potion'), fn: function () { buy(s, 'potion', 8, function () { s.items.potion = (s.items.potion || 0) + 1; }); } },
      { label: t('ui.grimoire'), fn: grimoire },
      { label: t('ui.close'), fn: function () { close(); PQ.engine.render(); } }
    ]);
  }
  function buy(s, item, price, apply) {
    if (s.gold < price) return dialog(t('msg.buy.poor'), function () { shop(); });
    s.gold -= price; apply(); PQ.state.save(); hud();
    dialog(t('msg.buy.ok'), function () { shop(); });
  }
  function grimoire() {
    var s = PQ.state.s;
    var text = s.spells.length ? t('grimoire.title') + '\n\n' + s.spells.join('\n') : t('grimoire.empty');
    dialog(text, function () { shop(); });
  }
  function close() { menuEl.classList.add('hidden'); dialogEl.classList.add('hidden'); open = false; if (cb) { var f = cb; cb = null; f(); } }
  function hud() {
    var s = PQ.state.s;
    document.getElementById('hud-hp').textContent = 'PV ' + s.hp + '/' + s.maxHp;
    document.getElementById('hud-gold').textContent = s.gold + ' or | ' + t('ui.grimoire') + ': ' + s.spells.length;
  }
  return { init: init, dialog: dialog, menu: menu, shop: shop, grimoire: grimoire, close: close, hud: hud,
    isOpen: function () { return open; } };
})();
