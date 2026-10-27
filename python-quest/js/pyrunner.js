// Python Quest — mini-exécuteur Python (sous-ensemble) pour les défis de code
window.PQ = window.PQ || {};

PQ.pyrunner = (function () {
  'use strict';

  function stripComment(line) {
    var q = null;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (q) { if (c === q) q = null; }
      else if (c === '"' || c === "'") q = c;
      else if (c === '#') return line.slice(0, i);
    }
    return line;
  }

  function splitArgs(src) {
    var out = [], buf = '', q = null;
    for (var i = 0; i < src.length; i++) {
      var c = src[i];
      if (q) { buf += c; if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { q = c; buf += c; continue; }
      if (c === ',' ) { out.push(buf.trim()); buf = ''; continue; }
      buf += c;
    }
    if (buf.trim() !== '') out.push(buf.trim());
    return out;
  }

  function parse(src) {
    var toks = [];
    String(src || '').replace(/\t/g, '    ').split(/\r?\n/).forEach(function (raw) {
      var clean = stripComment(raw);
      if (!clean.trim()) return;
      toks.push({ indent: clean.match(/^ */)[0].length, text: clean.trim() });
    });
    var pos = 0;
    function parseBlock(base) {
      var items = [], last = null;
      while (pos < toks.length) {
        var t = toks[pos];
        if (t.indent < base) break;
        if (!items.length && t.indent > base) base = t.indent;
        if (items.length && t.indent !== base) break;
        pos++;
        var head = t.text;
        if (head === 'else:') {
          var childElse = (pos < toks.length && toks[pos].indent > base) ? toks[pos].indent : null;
          if (last && childElse) { pos++; last.elseBody = parseBlock(childElse); }
          continue;
        }
        var item = { head: head, body: [], elseBody: [] };
        if (head.slice(-1) === ':') {
          var childIndent = (pos < toks.length && toks[pos].indent > base) ? toks[pos].indent : null;
          if (childIndent) { pos++; item.body = parseBlock(childIndent); }
        }
        items.push(item);
        last = item;
      }
      return items;
    }
    return parseBlock(0);
  }

  function expr(src) {
    return String(src)
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      .replace(/\band\b/g, '&&')
      .replace(/\bor\b/g, '||')
      .replace(/\bnot\b/g, '!');
  }

  function emit(items, depth) {
    var out = '', pad = new Array(depth + 1).join('  ');
    items.forEach(function (it) {
      var h = it.head;
      var fm = h.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\(([^)]*)\)\s*:?$/);
      if (fm) {
        var args = splitArgs(fm[2]).map(expr);
        var init = args.length > 1 ? ('var ' + fm[1] + ' = ' + args[0]) : ('var ' + fm[1] + ' = 0');
        var cond = args.length > 1 ? (fm[1] + ' < ' + args[1]) : (fm[1] + ' < ' + args[0]);
        out += pad + 'for (' + init + '; ' + cond + '; ' + fm[1] + '++) {\n';
        out += emit(it.body, depth + 1);
        out += pad + '}\n';
        return;
      }
      if (/^if\s+/.test(h)) {
        var cond = expr(h.replace(/^if\s+/, '').replace(/:\s*$/, ''));
        out += pad + 'if (' + cond + ') {\n' + emit(it.body, depth + 1) + pad + '}';
        if (it.elseBody.length) out += ' else {\n' + emit(it.elseBody, depth + 1) + pad + '}';
        out += '\n';
        return;
      }
      var dm = h.match(/^def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:?$/);
      if (dm) {
        out += pad + 'function ' + dm[1] + '(' + dm[2] + ') {\n' + emit(it.body, depth + 1) + pad + '}\n';
        return;
      }
      var pm = h.match(/^print\s*\((.*)\)$/);
      if (pm) {
        var pargs = splitArgs(pm[1]).filter(function (a) { return !/^(end|sep)\s*=/.test(a); });
        out += pad + '__pq_out.push(' + pargs.map(expr).join(", ' ', ") + ');\n';
        return;
      }
      var am = h.match(/^([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/);
      if (am) {
        out += pad + 'var ' + am[1] + ' = ' + expr(am[2]) + ';\n';
        return;
      }
      out += pad + '/* non supporté : ' + h.replace(/\*\//g, '* /') + ' */\n';
    });
    return out;
  }

  function run(code) {
    var out = [];
    var js = '';
    try {
      js = emit(parse(code), 0);
      var fn = new Function('__pq_out', js);
      fn(out);
      return { ok: true, output: out.join('\n'), error: null, js: js };
    } catch (e) {
      return { ok: false, output: out.join('\n'), error: e.message, js: js };
    }
  }

  function check(code, expected) {
    var r = run(code);
    r.passed = r.ok && String(r.output).trim() === String(expected).trim();
    return r;
  }

  return { run: run, check: check, parse: parse };
})();
