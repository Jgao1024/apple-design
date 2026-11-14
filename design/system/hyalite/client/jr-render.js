// json-render → Liquid Glass HTML (pages/09-json-render).
//
// One file, two uses: the build imports it to draw the static showcase, and the page inlines it to
// run the paste-JSON live preview and to make the showcase interactive.
//
//   JR.renderRoot(spec, { mode, uid, frame, open })   spec → HTML string (no DOM needed)
//   JR.mount(el, spec, { mode, uid, frame, open })    renders into el, wires events, returns an instance
//   JR.normalize(value)                               accepts flat specs and nested { type, props, children: [...] }
//
// Props names follow @json-render/shadcn and the chat catalog, so model output renders unchanged.
// Expressions: $state $item $index $bindState $bindItem $cond $template; $computed is shown as a
// placeholder. Actions (`on`) are not run. Glass is only used on containers and overlays; text,
// tables and charts are drawn solid inside them. Markup relies on jr.css, not on Tailwind.
(function (G) {
'use strict';

/* ───────────── helpers ───────────── */

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const at = (n, v) => ' ' + n + '="' + esc(v) + '"';
const cls = (...a) => a.filter(Boolean).join(' ');
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const num = (v, d) => { const n = typeof v === 'string' && v.trim() === '' ? NaN : Number(v); return Number.isFinite(n) ? n : d; };
const str = (v) => (v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const safeColor = (c) => (typeof c === 'string' && /^[#\w(),.%\s/-]{1,40}$/.test(c) ? c : '');
const safeUrl = (u) => (typeof u === 'string' && /^(https?:\/\/|mailto:|#)/i.test(u.trim()) ? u.trim() : '#');
const safeImg = (u) => (typeof u === 'string' && /^(https?:\/\/|data:image\/)/i.test(u.trim()) ? u.trim() : '');
const cssLen = (v, d) => { if (v == null || v === '') return d; if (typeof v === 'number') return v + 'px'; return /^[\d.]+(px|%|rem|em|vw|vh)?$/.test(String(v).trim()) ? (/^[\d.]+$/.test(String(v).trim()) ? v + 'px' : String(v).trim()) : d; };
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const listOf = (v) => (Array.isArray(v) ? v : []);
const fmtNum = (n) => (Math.abs(n) >= 1e4 ? (n / 1e3).toFixed(n % 1e3 ? 1 : 0).replace(/\.0$/, '') + 'k' : Number.isInteger(n) ? String(n) : String(+n.toFixed(2)));

const IC = {
  chevD: '<path d="M6 9l6 6 6-6"/>', chevR: '<path d="M9 6l6 6-6 6"/>', chevL: '<path d="M15 6l-6 6 6 6"/>', chevUD: '<path d="M8 9l4-4 4 4M8 15l4 4 4-4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>', ok: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
  warn: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5M12 17.5v.01"/>', err: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  tip: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>',
  star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.2 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>', flat: '<path d="M5 12h14"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>', pause: '<path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
  img: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 9"/>',
  file: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>', dl: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', send: '<path d="M12 19V5M6 11l6-6 6 6"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
  box: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
};
const ic = (n, s, extra) => `<svg class="jr-ic${extra ? ' ' + extra : ''}" width="${s || 16}" height="${s || 16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;

/* ───────────── state paths (JSON Pointer) ───────────── */

const tokens = (p) => (p === '' || p == null ? [] : String(p).split('/').slice(1).map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~')));
function getPath(o, p) { let v = o; for (const t of tokens(p)) { if (v == null) return undefined; v = v[t]; } return v; }
function setPath(o, p, val) {
  const ts = tokens(p);
  if (!ts.length) return;
  let v = o;
  for (let i = 0; i < ts.length - 1; i++) {
    if (v[ts[i]] == null || typeof v[ts[i]] !== 'object') v[ts[i]] = /^\d+$/.test(ts[i + 1]) ? [] : {};
    v = v[ts[i]];
  }
  v[ts[ts.length - 1]] = val;
}
const itemGet = (ctx, field) => (!ctx.hasItem ? undefined : field === '' || field === true ? ctx.item : getPath(ctx.item, '/' + field));
const looseEq = (a, b) => a === b || (a != null && b != null && typeof a !== 'object' && typeof b !== 'object' && String(a) === String(b));

/// A visibility / $cond condition.
function test(c, ctx) {
  if (c === true || c === false) return c;
  if (c == null) return true;
  if (Array.isArray(c)) return c.every((x) => test(x, ctx));
  if (!isObj(c)) return !!c;
  if ('$or' in c) return listOf(c.$or).some((x) => test(x, ctx));
  if ('$and' in c) return listOf(c.$and).every((x) => test(x, ctx));
  let v;
  if ('$state' in c) v = getPath(ctx.state, c.$state);
  else if ('$item' in c) v = itemGet(ctx, c.$item);
  else if ('$index' in c) v = ctx.index;
  else return true;
  const arg = (k) => resolve(c[k], ctx);
  let r;
  if ('eq' in c) r = looseEq(v, arg('eq'));
  else if ('neq' in c) r = !looseEq(v, arg('neq'));
  else if ('gt' in c) r = Number(v) > Number(arg('gt'));
  else if ('gte' in c) r = Number(v) >= Number(arg('gte'));
  else if ('lt' in c) r = Number(v) < Number(arg('lt'));
  else if ('lte' in c) r = Number(v) <= Number(arg('lte'));
  else r = !!v;
  return c.not ? !r : r;
}

/// Replaces every expression with its value.
function resolve(v, ctx) {
  if (Array.isArray(v)) return v.map((x) => resolve(x, ctx));
  if (!isObj(v)) return v;
  if ('$state' in v) return getPath(ctx.state, v.$state);
  if ('$bindState' in v) return getPath(ctx.state, v.$bindState);
  if ('$item' in v) return itemGet(ctx, v.$item);
  if ('$bindItem' in v) return itemGet(ctx, v.$bindItem);
  if ('$index' in v) return ctx.index;
  if ('$cond' in v) return resolve(test(v.$cond, ctx) ? v.$then : v.$else, ctx);
  if ('$template' in v) return String(v.$template).replace(/\$\{([^}]*)\}/g, (_, p) => { const x = getPath(ctx.state, p.trim()); return x == null ? '' : str(x); });
  if ('$computed' in v) return '⟨' + str(v.$computed) + '()⟩';
  const o = {};
  for (const k in v) o[k] = resolve(v[k], ctx);
  return o;
}

/// Where a form prop writes to: a state path (bound), or the element's own local state.
function target(raw, name, ctx, key) {
  const r = raw ? raw[name] : undefined;
  if (isObj(r) && '$bindState' in r) return 's:' + r.$bindState;
  if (isObj(r) && '$bindItem' in r && ctx.hasItem) return 's:' + ctx.itemPath + (r.$bindItem === '' ? '' : '/' + r.$bindItem);
  return 'u:' + key + '.' + name;
}
function readTarget(t, ctx) {
  if (t.startsWith('s:')) return getPath(ctx.state, t.slice(2));
  return ctx.ui[t.slice(2)];
}
/// The current value of a form prop: bound state, else what the user did here, else the literal.
function field(name, p, raw, ctx, key, dflt) {
  const t = target(raw, name, ctx, key);
  let v = readTarget(t, ctx);
  if (v === undefined) v = p[name];
  if (v === undefined || v === null) v = dflt;
  return { t, v };
}

/* ───────────── spec → tree ───────────── */

/// Accepts the flat spec and the nested form `{ type, props, children: [{...}] }`; returns { root, elements, state }.
function normalize(value) {
  if (!isObj(value)) throw new Error('JSON 顶层必须是对象：{ "root": "...", "elements": { ... } }');
  if (isObj(value.elements) && value.root != null) return { root: value.root, elements: value.elements, state: isObj(value.state) ? value.state : {} };
  if (typeof value.type === 'string') {
    const elements = {};
    let n = 0;
    const walk = (node) => {
      const id = 'n' + (n++);
      const kids = listOf(node.children).map((c) => (typeof c === 'string' ? c : isObj(c) ? walk(c) : null)).filter(Boolean);
      elements[id] = { ...node, props: node.props || {}, children: kids };
      return id;
    };
    const root = walk(value);
    return { root, elements, state: isObj(value.state) ? value.state : {} };
  }
  if (isObj(value.elements)) throw new Error('缺少 "root"：要指定根元素的 id');
  throw new Error('不是 json-render spec：需要 "root" 和 "elements"（或单个 { "type": ... } 元素）');
}

function childCtx(ctx, patch) { return Object.assign({}, ctx, patch); }

function placeholder(title, sub) {
  return `<div class="jr-ph"><span class="jr-ph-t">${esc(title)}</span>${sub ? `<span class="jr-ph-s">${esc(sub)}</span>` : ''}</div>`;
}

const THREE_D = new Set(['Scene3D', 'Group3D', 'Box', 'Sphere', 'Cylinder', 'Cone', 'Torus', 'Plane', 'Ring', 'AmbientLight', 'DirectionalLight', 'PointLight', 'SpotLight', 'HemisphereLight', 'Stars', 'Environment', 'Text3D']);

function node(id, ctx) {
  const el = ctx.spec.elements[id];
  if (!el || !isObj(el)) return placeholder('缺少元素', 'id: ' + id);
  if (ctx.depth > 40) return placeholder('嵌套太深', '可能有循环引用：' + id);
  if (el.visible !== undefined && !test(el.visible, ctx)) return '';
  const key = ctx.scope + id;
  const type = String(el.type);
  const raw = isObj(el.props) ? el.props : {};
  const c = childCtx(ctx, { depth: ctx.depth + 1 });
  if (THREE_D.has(type)) return placeholder('3D 场景（未支持）', type + ' · react-three-fiber 组件，这里不渲染');
  const fn = C[type];
  if (!fn) return placeholder('未知组件', 'type: ' + type);
  const p = resolve(raw, c);
  const kids = () => children(el, c, key);
  try {
    return fn({ p, raw, ctx: c, key, el, kids, id });
  } catch (e) {
    return placeholder(type + ' 渲染出错', String(e && e.message || e));
  }
}

function children(el, ctx, key, only) {
  const ids = listOf(el.children);
  if (!ids.length) return '';
  const rep = el.repeat;
  if (rep && isObj(rep)) {
    let base, arr;
    const sp = rep.statePath;
    if (isObj(sp) && '$item' in sp && ctx.hasItem) { base = ctx.itemPath + (sp.$item === '' ? '' : '/' + sp.$item); arr = itemGet(ctx, sp.$item); }
    else { base = typeof sp === 'string' ? sp : ''; arr = getPath(ctx.state, base); }
    return listOf(arr).map((item, i) => {
      const k = rep.key && isObj(item) && item[rep.key] != null ? item[rep.key] : i;
      const cc = childCtx(ctx, { item, index: i, hasItem: true, itemPath: base + '/' + i, scope: ctx.scope + key + '#' + k + '/' });
      return ids.map((id) => node(id, cc)).join('');
    }).join('');
  }
  return ids.map((id) => (only ? only(id, ctx) : node(id, ctx))).join('');
}

/* ───────────── component helpers ───────────── */

const GAP = { none: 0, sm: 8, md: 16, lg: 24, xl: 32 };
const glass = (ctx, c, inner, attrs) => `<div class="hl-glass ${c}" data-mode="${ctx.mode}"${attrs || ''}>${inner}</div>`;
const optsOf = (v) => listOf(v).map((o) => (isObj(o) ? { value: str(o.value != null ? o.value : o.label), label: str(o.label != null ? o.label : o.value) } : { value: str(o), label: str(o) }));
const pick = (v, list, d) => (list.includes(v) ? v : d);
const valAttr = (t, kind) => ` data-t="${esc(t)}"${kind ? ` data-vt="${kind}"` : ''}`;

/// A segmented control (Tabs list, ButtonGroup, ToggleGroup). `sel` is an array of selected values.
function segmented(ctx, items, sel, t, op, cname) {
  return glass(ctx, 'jr-seg ' + (cname || ''), items.map((it) => `<button type="button" class="jr-seg-i${sel.includes(it.value) ? ' on' : ''}" data-jr="${op}" data-v="${esc(it.value)}"${valAttr(t)}>${esc(it.label)}</button>`).join(''));
}

const C = {};

/* ───────────── layout ───────────── */

C.Card = ({ p, ctx, kids }) => {
  const mw = pick(p.maxWidth, ['sm', 'md', 'lg', 'full'], 'full');
  const head = p.title || p.description
    ? `<div class="jr-card-h">${p.title ? `<div class="jr-card-t">${esc(p.title)}</div>` : ''}${p.description ? `<div class="jr-card-d">${esc(p.description)}</div>` : ''}</div>` : '';
  const body = kids();
  return glass(ctx, cls('jr-card', 'jr-mw-' + mw, p.centered && 'jr-center'), head + (body ? `<div class="jr-card-b">${body}</div>` : ''));
};

C.Stack = ({ p, kids }) => {
  const h = p.direction === 'horizontal';
  const align = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' }[p.align] || (h ? 'center' : 'stretch');
  const just = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around' }[p.justify] || 'flex-start';
  return `<div class="jr-stack${h ? ' jr-hz' : ''}" style="gap:${GAP[pick(p.gap, Object.keys(GAP), 'md')]}px;align-items:${align};justify-content:${just}">${kids()}</div>`;
};

C.Grid = ({ p, kids }) => `<div class="jr-grid" data-c="${clamp(Math.round(num(p.columns, 2)), 1, 6)}" style="--c:${clamp(Math.round(num(p.columns, 2)), 1, 6)};gap:${GAP[pick(p.gap, ['sm', 'md', 'lg', 'xl'], 'md')]}px">${kids()}</div>`;

C.Separator = ({ p }) => `<div class="jr-sep${p.orientation === 'vertical' ? ' jr-sep-v' : ''}" role="separator"></div>`;

C.Tabs = ({ p, raw, ctx, key, el }) => {
  const tabs = listOf(p.tabs).map((t) => ({ value: str(t.value != null ? t.value : t.label), label: str(t.label != null ? t.label : t.value) }));
  const t = target(raw, 'value', ctx, key);
  let cur = readTarget(t, ctx);
  if (cur == null) cur = p.value != null ? p.value : p.defaultValue != null ? p.defaultValue : tabs[0] && tabs[0].value;
  cur = str(cur);
  const cc = childCtx(ctx, { tabValue: cur });
  const ids = listOf(el.children);
  const hasContent = ids.some((id) => ctx.spec.elements[id] && ctx.spec.elements[id].type === 'TabContent');
  const body = ids.map((id, i) => {
    if (!hasContent && ids.length === tabs.length) return tabs[i].value === cur ? node(id, cc) : '';
    return node(id, cc);
  }).join('');
  return `<div class="jr-tabs">${segmented(ctx, tabs, [cur], t, 'set', 'jr-seg-tabs')}${body ? `<div class="jr-tabs-b">${body}</div>` : ''}</div>`;
};
C.TabContent = ({ p, ctx, kids }) => (ctx.tabValue === undefined || str(p.value) === ctx.tabValue ? `<div class="jr-tabc">${kids()}</div>` : '');

C.Accordion = ({ p, ctx, key }) => {
  const t = 'u:' + key + '.open';
  let open = readTarget(t, ctx);
  if (!Array.isArray(open)) open = ctx.open ? [0] : [];
  const single = p.type !== 'multiple';
  return `<div class="jr-acc">${listOf(p.items).map((it, i) => {
    const on = open.includes(i);
    return `<div class="jr-acc-i${on ? ' on' : ''}"><button type="button" class="jr-acc-h" data-jr="multi" data-t="${t}" data-v="${i}" data-vt="n" data-cur="${esc(JSON.stringify(open))}"${single ? ' data-single="1"' : ''}><span>${esc(it && it.title)}</span>${ic('chevD', 16, 'jr-chev')}</button><div class="jr-fold"><div class="jr-fold-i"><div class="jr-acc-c">${esc(it && it.content)}</div></div></div></div>`;
  }).join('')}</div>`;
};

C.Collapsible = ({ p, ctx, key, kids }) => {
  const t = 'u:' + key + '.open';
  const stored = readTarget(t, ctx);
  const on = stored === undefined ? !!p.defaultOpen : !!stored;
  return `<div class="jr-col${on ? ' on' : ''}"><button type="button" class="jr-col-h" data-jr="tog" data-t="${t}" data-cur="${on ? 1 : 0}"><span>${esc(p.title)}</span>${ic('chevD', 16, 'jr-chev')}</button><div class="jr-fold"><div class="jr-fold-i"><div class="jr-col-b">${kids()}</div></div></div></div>`;
};

function overlay(kind, { p, ctx, kids }) {
  const path = str(p.openPath);
  const open = !!getPath(ctx.state, path);
  if (!open) return `<button type="button" class="jr-reopen" data-jr="set" data-t="s:${esc(path)}" data-v="1" data-vt="b">${ic('plus', 14)}<span>打开 ${kind === 'dialog' ? 'Dialog' : 'Drawer'}</span><code>${esc(path)}</code></button>`;
  const head = `<div class="jr-ov-h"><div><div class="jr-card-t">${esc(p.title)}</div>${p.description ? `<div class="jr-card-d">${esc(p.description)}</div>` : ''}</div><button type="button" class="jr-x" aria-label="关闭" data-jr="set" data-t="s:${esc(path)}" data-v="0" data-vt="b">${ic('x', 14)}</button></div>`;
  const body = kids();
  const inner = (kind === 'drawer' ? '<div class="jr-grab"></div>' : '') + head + (body ? `<div class="jr-card-b">${body}</div>` : '');
  return `<div class="jr-scene jr-scene-${kind}">${glass(ctx, 'jr-' + kind, inner)}</div>`;
}
C.Dialog = (a) => overlay('dialog', a);
C.Drawer = (a) => overlay('drawer', a);

C.Carousel = ({ p }) => {
  const items = listOf(p.items);
  return `<div class="jr-car">${items.map((it, i) => `<div class="jr-car-i" style="--h:${(hash(str(it && it.title) + i) % 360)}"><div class="jr-car-n">${i + 1} / ${items.length}</div>${it && it.title ? `<div class="jr-car-t">${esc(it.title)}</div>` : ''}${it && it.description ? `<div class="jr-car-d">${esc(it.description)}</div>` : ''}</div>`).join('')}</div>`;
};

/* ───────────── data display ───────────── */

const NUMERIC = /^[-+]?[\d,.]+(%|[kKmMbB])?$/;
C.Table = ({ p }) => {
  let cols = listOf(p.columns).map((c) => (isObj(c) ? { key: str(c.key != null ? c.key : c.label), label: str(c.label != null ? c.label : c.key) } : { key: str(c), label: str(c) }));
  let rows;
  if (Array.isArray(p.rows)) rows = p.rows.map((r) => listOf(r).map(str));
  else if (Array.isArray(p.data)) {
    if (!cols.length && isObj(p.data[0])) cols = Object.keys(p.data[0]).map((k) => ({ key: k, label: k }));
    rows = p.data.map((r) => cols.map((c) => (isObj(r) ? str(r[c.key]) : str(r))));
  } else rows = [];
  const head = cols.length ? `<thead><tr>${cols.map((c) => `<th>${esc(c.label)}</th>`).join('')}</tr></thead>` : '';
  const body = rows.length
    ? `<tbody>${rows.map((r) => `<tr>${r.map((v) => `<td${NUMERIC.test(v.trim()) ? ' class="jr-num"' : ''}>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody>`
    : `<tbody><tr><td class="jr-empty" colspan="${Math.max(cols.length, 1)}">${esc(p.emptyMessage || '暂无数据')}</td></tr></tbody>`;
  return `<div class="jr-tbl"><div class="jr-tbl-w"><table>${head}${body}</table></div>${p.caption ? `<div class="jr-tbl-c">${esc(p.caption)}</div>` : ''}</div>`;
};

C.Heading = ({ p }) => { const l = pick(p.level, ['h1', 'h2', 'h3', 'h4'], 'h2'); return `<${l} class="jr-h jr-${l}">${esc(p.text != null ? p.text : p.content)}</${l}>`; };

C.Text = ({ p }) => {
  const v = pick(p.variant, ['body', 'caption', 'muted', 'lead', 'code'], p.muted ? 'muted' : 'body');
  const t = esc(p.text != null ? p.text : p.content);
  return v === 'code' ? `<div class="jr-t"><code class="jr-code-i">${t}</code></div>` : `<div class="jr-t jr-t-${v}">${t}</div>`;
};

function sized(p) {
  const w = num(p.width, 0), h = num(p.height, 0);
  return (w ? `width:${w}px;max-width:100%;` : '') + (w && h ? `aspect-ratio:${w}/${h};` : h ? `height:${h}px;` : !w ? 'aspect-ratio:16/9;' : 'aspect-ratio:16/9;');
}
C.Image = ({ p }) => {
  const src = safeImg(p.src);
  if (src) return `<img class="jr-img"${at('src', src)} alt="${esc(p.alt)}" loading="lazy" style="${sized(p)}">`;
  return `<div class="jr-img jr-img-ph" style="${sized(p)}--h:${hash(str(p.alt)) % 360}" role="img" aria-label="${esc(p.alt)}">${ic('img', 28)}${p.alt ? `<span>${esc(p.alt)}</span>` : ''}</div>`;
};

function initials(name) {
  const s = str(name).trim();
  if (!s) return '?';
  if (/[\u3400-\u9fff]/.test(s)) return s[0];
  const w = s.split(/\s+/);
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
}
C.Avatar = ({ p }) => {
  const size = pick(p.size, ['sm', 'md', 'lg'], 'md');
  const src = safeImg(p.src);
  return `<span class="jr-av jr-av-${size}" style="--h:${hash(str(p.name)) % 360}" title="${esc(p.name)}">${src ? `<img${at('src', src)} alt="${esc(p.name)}">` : esc(initials(p.name))}</span>`;
};

C.Badge = ({ p }) => `<span class="jr-badge jr-badge-${pick(p.variant, ['default', 'secondary', 'destructive', 'outline'], 'default')}">${esc(p.text != null ? p.text : p.label)}</span>`;

C.Alert = ({ p }) => {
  const t = pick(p.type, ['info', 'success', 'warning', 'error'], 'info');
  const icon = { info: 'info', success: 'ok', warning: 'warn', error: 'err' }[t];
  return `<div class="jr-alert jr-al-${t}" role="alert">${ic(icon, 20, 'jr-al-i')}<div><div class="jr-al-t">${esc(p.title)}</div>${p.message ? `<div class="jr-al-m">${esc(p.message)}</div>` : ''}</div></div>`;
};

C.Progress = ({ p }) => {
  const max = num(p.max, 100) || 100;
  const v = clamp(num(p.value, 0), 0, max);
  const pct = (v / max) * 100;
  return `<div class="jr-prog"><div class="jr-prog-h"><span>${esc(p.label || '')}</span><span>${Math.round(pct)}%</span></div><div class="jr-prog-t" role="progressbar" aria-valuenow="${v}" aria-valuemax="${max}"><i style="width:${pct.toFixed(1)}%"></i></div></div>`;
};

C.Skeleton = ({ p }) => `<div class="jr-skel${p.rounded ? ' jr-round' : ''}" style="width:${cssLen(p.width, '100%')};height:${cssLen(p.height, '16px')}"></div>`;

C.Spinner = ({ p }) => {
  const s = { sm: 16, md: 24, lg: 36 }[pick(p.size, ['sm', 'md', 'lg'], 'md')];
  return `<div class="jr-spin"><svg class="jr-spin-s" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="9" stroke="currentColor" opacity=".2"/><path d="M12 3a9 9 0 019 9" stroke="currentColor"/></svg>${p.label ? `<span>${esc(p.label)}</span>` : ''}</div>`;
};

C.Tooltip = ({ p, ctx, key }) => {
  const t = 'u:' + key + '.open';
  const stored = readTarget(t, ctx);
  const on = stored === undefined ? !!ctx.open : !!stored;
  return `<div class="jr-tip">${on ? glass(ctx, 'jr-tip-b', esc(p.content)) : ''}<button type="button" class="jr-tip-t" data-jr="tog" data-t="${t}" data-cur="${on ? 1 : 0}">${esc(p.text)}</button></div>`;
};

C.Popover = ({ p, ctx, key }) => {
  const t = 'u:' + key + '.open';
  const stored = readTarget(t, ctx);
  const on = stored === undefined ? !!ctx.open : !!stored;
  return `<div class="jr-pop"><button type="button" class="jr-btn jr-btn-outline" data-jr="tog" data-t="${t}" data-cur="${on ? 1 : 0}">${esc(p.trigger)}</button>${on ? glass(ctx, 'jr-pop-b', esc(p.content)) : ''}</div>`;
};

/* ───────────── form inputs ───────────── */

const fld = (label, inner) => `<div class="jr-f">${label ? `<span class="jr-lbl">${esc(label)}</span>` : ''}${inner}</div>`;

function inputField({ p, raw, ctx, key }) {
  const f = field('value', p, raw, ctx, key, '');
  const type = pick(p.type, ['text', 'email', 'password', 'number', 'url'], 'text');
  return fld(p.label, `<input class="jr-in" type="${type}" name="${esc(p.name || key)}" placeholder="${esc(p.placeholder)}" value="${esc(str(f.v))}" data-jr-in="text"${valAttr(f.t)}>`);
}
C.Input = inputField;
C.TextInput = inputField;

C.Textarea = ({ p, raw, ctx, key }) => {
  const f = field('value', p, raw, ctx, key, '');
  return fld(p.label, `<textarea class="jr-in jr-ta" name="${esc(p.name || key)}" rows="${clamp(Math.round(num(p.rows, 3)), 1, 12)}" placeholder="${esc(p.placeholder)}" data-jr-in="text"${valAttr(f.t)}>${esc(str(f.v))}</textarea>`);
};

function selectField({ p, raw, ctx, key }) {
  const f = field('value', p, raw, ctx, key, '');
  const opts = optsOf(p.options);
  const v = str(f.v);
  const has = opts.some((o) => o.value === v);
  const ph = p.placeholder || (has ? '' : '请选择');
  return fld(p.label, `<select class="jr-in jr-sel" name="${esc(p.name || key)}" data-v="${esc(has ? v : '')}" data-jr-in="text"${valAttr(f.t)}>${ph ? `<option value="" disabled${has ? '' : ' selected'}>${esc(ph)}</option>` : ''}${opts.map((o) => `<option value="${esc(o.value)}"${o.value === v ? ' selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`);
}
C.Select = selectField;
C.SelectInput = selectField;

C.Checkbox = ({ p, raw, ctx, key }) => {
  const f = field('checked', p, raw, ctx, key, false);
  return `<label class="jr-chk"><input class="jr-sr" type="checkbox" name="${esc(p.name || key)}"${f.v ? ' checked' : ''} data-jr-in="bool"${valAttr(f.t)}><span class="jr-box">${ic('check', 14)}</span><span>${esc(p.label)}</span></label>`;
};

function radioGroup({ p, raw, ctx, key }) {
  const f = field('value', p, raw, ctx, key, '');
  const v = str(f.v);
  return fld(p.label, `<div class="jr-radios" role="radiogroup">${optsOf(p.options).map((o) => `<label class="jr-rad"><input class="jr-sr" type="radio" name="${esc(ctx.uid + ':' + key)}" value="${esc(o.value)}"${o.value === v ? ' checked' : ''} data-jr-in="text"${valAttr(f.t)}><span class="jr-dot"></span><span>${esc(o.label)}</span></label>`).join('')}</div>`);
}
C.Radio = radioGroup;
C.RadioGroup = radioGroup;

C.Switch = ({ p, raw, ctx, key }) => {
  const f = field('checked', p, raw, ctx, key, false);
  return `<label class="jr-sw"><span>${esc(p.label)}</span><input class="jr-sr" type="checkbox" role="switch" name="${esc(p.name || key)}"${f.v ? ' checked' : ''} data-jr-in="bool"${valAttr(f.t)}><span class="jr-track"><i></i></span></label>`;
};

C.Slider = ({ p, raw, ctx, key }) => {
  const min = num(p.min, 0), max = num(p.max, 100) > min ? num(p.max, 100) : min + 100, step = num(p.step, 1) || 1;
  const f = field('value', p, raw, ctx, key, min);
  const v = clamp(num(f.v, min), min, max);
  return `<div class="jr-f"><div class="jr-sl-h"><span class="jr-lbl">${esc(p.label)}</span><span class="jr-sl-v">${fmtNum(v)}</span></div><input class="jr-range" type="range" min="${min}" max="${max}" step="${step}" value="${v}" style="--p:${(((v - min) / (max - min)) * 100).toFixed(2)}%" data-jr-in="num"${valAttr(f.t)}></div>`;
};

/* ───────────── actions ───────────── */

const BTN = { primary: 'primary', default: 'primary', secondary: 'secondary', danger: 'danger', destructive: 'danger', outline: 'outline', ghost: 'ghost' };
C.Button = ({ p, ctx }) => {
  const v = BTN[p.variant] || 'primary';
  const size = pick(p.size, ['sm', 'default', 'lg'], 'default');
  const c = cls('jr-btn', 'jr-btn-' + v, size !== 'default' && 'jr-btn-' + size);
  const dis = p.disabled ? ' disabled' : '';
  if (v === 'outline' || v === 'ghost') return `<button type="button" class="${c}"${dis}>${esc(p.label)}</button>`;
  return `<button type="button" class="hl-glass ${c} ${v === 'primary' ? 'jr-tint-blue' : v === 'danger' ? 'jr-tint-red' : ''}" data-mode="${ctx.mode}"${dis}>${esc(p.label)}</button>`;
};

C.Link = ({ p }) => {
  const href = safeUrl(p.href);
  return `<a class="jr-a"${at('href', href)}${href === '#' ? '' : ' target="_blank" rel="noopener noreferrer"'}>${esc(p.label != null ? p.label : p.text)}</a>`;
};

C.DropdownMenu = ({ p, raw, ctx, key }) => {
  const ot = 'u:' + key + '.open';
  const stored = readTarget(ot, ctx);
  const on = stored === undefined ? !!ctx.open : !!stored;
  const f = field('value', p, raw, ctx, key, '');
  const items = optsOf(p.items);
  const cur = items.find((i) => i.value === str(f.v));
  const menu = on ? glass(ctx, 'jr-menu', items.map((i) => `<button type="button" class="jr-mi${cur && cur.value === i.value ? ' on' : ''}" data-jr="pick" data-t="${esc(f.t)}" data-v="${esc(i.value)}" data-close="${ot}">${ic('check', 14, 'jr-mi-c')}<span>${esc(i.label)}</span></button>`).join('')) : '';
  return `<div class="jr-dd"><button type="button" class="jr-btn jr-btn-outline" data-jr="tog" data-t="${ot}" data-cur="${on ? 1 : 0}"><span>${esc(p.label)}${cur ? ' · ' + esc(cur.label) : ''}</span>${ic('chevUD', 14)}</button>${menu}</div>`;
};

C.Toggle = ({ p, raw, ctx, key }) => {
  const f = field('pressed', p, raw, ctx, key, false);
  return `<button type="button" class="jr-tg jr-tg-${pick(p.variant, ['default', 'outline'], 'default')}${f.v ? ' on' : ''}" aria-pressed="${f.v ? 'true' : 'false'}" data-jr="tog"${valAttr(f.t)} data-cur="${f.v ? 1 : 0}">${esc(p.label)}</button>`;
};

C.ToggleGroup = ({ p, raw, ctx, key }) => {
  const multi = p.type === 'multiple';
  const f = field('value', p, raw, ctx, key, multi ? [] : '');
  const sel = (Array.isArray(f.v) ? f.v : f.v === '' ? [] : [f.v]).map(str);
  return `<div class="jr-tgg" role="group">${optsOf(p.items).map((i) => `<button type="button" class="jr-tg jr-tg-outline${sel.includes(i.value) ? ' on' : ''}" aria-pressed="${sel.includes(i.value)}" data-jr="${multi ? 'multi' : 'set'}"${valAttr(f.t)} data-v="${esc(i.value)}" data-cur="${esc(JSON.stringify(sel))}">${esc(i.label)}</button>`).join('')}</div>`;
};

C.ButtonGroup = ({ p, raw, ctx, key }) => {
  const f = field('selected', p, raw, ctx, key, '');
  const items = optsOf(p.buttons);
  return segmented(ctx, items, [str(f.v != null && f.v !== '' ? f.v : items[0] && items[0].value)], f.t, 'set', 'jr-seg-btns');
};

C.Pagination = ({ p, raw, ctx, key }) => {
  const total = Math.max(1, Math.round(num(p.totalPages, 1)));
  const f = field('page', p, raw, ctx, key, 1);
  const page = clamp(Math.round(num(f.v, 1)), 1, total);
  let list;
  if (total <= 7) list = Array.from({ length: total }, (_, i) => i + 1);
  else if (page <= 4) list = [1, 2, 3, 4, 5, '…', total];
  else if (page >= total - 3) list = [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  else list = [1, '…', page - 1, page, page + 1, '…', total];
  const b = (label, v, c, dis) => `<button type="button" class="jr-pg ${c || ''}" ${dis ? 'disabled' : `data-jr="set" data-vt="n" data-v="${v}"${valAttr(f.t)}`}>${label}</button>`;
  return `<nav class="jr-pgs" aria-label="分页">${b(ic('chevL', 14), page - 1, 'jr-pg-a', page <= 1)}${list.map((n) => (n === '…' ? '<span class="jr-pg-e">…</span>' : b(n, n, n === page ? 'on' : ''))).join('')}${b(ic('chevR', 14), page + 1, 'jr-pg-a', page >= total)}</nav>`;
};

/* ───────────── chat catalog ───────────── */

C.Metric = ({ p }) => {
  const t = pick(p.trend, ['up', 'down', 'neutral'], '');
  const icon = { up: 'up', down: 'down', neutral: 'flat' }[t];
  return `<div class="jr-metric"><div class="jr-m-l">${esc(p.label)}</div><div class="jr-m-v">${esc(p.value)}</div>${p.detail || t ? `<div class="jr-m-d${t ? ' jr-tr-' + t : ''}">${icon ? ic(icon, 12) : ''}<span>${esc(p.detail)}</span></div>` : ''}</div>`;
};

C.Callout = ({ p }) => {
  const t = pick(p.type, ['info', 'tip', 'warning', 'important'], 'info');
  const icon = { info: 'info', tip: 'tip', warning: 'warn', important: 'star' }[t];
  return `<div class="jr-callout jr-co-${t}">${ic(icon, 18, 'jr-co-i')}<div>${p.title ? `<div class="jr-co-t">${esc(p.title)}</div>` : ''}<div class="jr-co-c">${esc(p.content)}</div></div></div>`;
};

C.Timeline = ({ p }) => `<ol class="jr-tl">${listOf(p.items).map((it) => {
  const s = pick(it && it.status, ['completed', 'current', 'upcoming'], 'upcoming');
  return `<li class="jr-tl-i jr-tl-${s}"><span class="jr-tl-d">${s === 'completed' ? ic('check', 10) : ''}</span><div class="jr-tl-b"><div class="jr-tl-h"><span class="jr-tl-t">${esc(it && it.title)}</span>${it && it.date ? `<span class="jr-tl-dt">${esc(it.date)}</span>` : ''}</div>${it && it.description ? `<div class="jr-tl-p">${esc(it.description)}</div>` : ''}</div></li>`;
}).join('')}</ol>`;

/* ───────────── charts (SVG, solid, no library) ───────────── */

function series(p, xKey, yKey) {
  const rows = listOf(p.data).filter(isObj);
  if (p.aggregate) {
    const g = new Map();
    rows.forEach((r) => { const k = str(r[xKey]); if (!g.has(k)) g.set(k, []); g.get(k).push(num(r[yKey], 0)); });
    return [...g].map(([name, v]) => ({ name, value: p.aggregate === 'count' ? v.length : p.aggregate === 'avg' ? v.reduce((a, b) => a + b, 0) / v.length : v.reduce((a, b) => a + b, 0) }));
  }
  return rows.map((r) => ({ name: str(r[xKey]), value: num(r[yKey], 0) }));
}
function niceMax(m) {
  if (m <= 0) return 1;
  const e = Math.pow(10, Math.floor(Math.log10(m))), f = m / e;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * e;
}
const cut = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

/// Axes + gridlines; returns the plot geometry and the SVG for the frame.
function plot(data, p, kind) {
  const W = 360, H = clamp(num(p.height, 200), 120, 420);
  const L = 38, R = 10, T = 12, B = 28;
  const vals = data.map((d) => d.value);
  const hi = niceMax(Math.max(0, ...vals)), lo = Math.min(0, ...vals) < 0 ? -niceMax(-Math.min(0, ...vals)) : 0;
  const y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const n = data.length || 1;
  const band = (W - L - R) / n;
  const x = (i) => (kind === 'bar' ? L + band * (i + 0.5) : n === 1 ? L + (W - L - R) / 2 : L + ((W - L - R) * i) / (n - 1));
  let g = '';
  for (let i = 0; i <= 4; i++) {
    const v = lo + ((hi - lo) * i) / 4, yy = y(v);
    g += `<line class="jr-gl" x1="${L}" x2="${W - R}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}"/><text class="jr-ax" x="${L - 6}" y="${(yy + 3.5).toFixed(1)}" text-anchor="end">${fmtNum(v)}</text>`;
  }
  const every = Math.ceil(n / Math.max(1, Math.floor((W - L - R) / 44)));
  data.forEach((d, i) => { if (i % every === 0) g += `<text class="jr-ax" x="${x(i).toFixed(1)}" y="${H - 9}" text-anchor="middle">${esc(cut(d.name, 7))}</text>`; });
  return { W, H, L, R, T, B, x, y, band, g, base: y(0) };
}
const chartWrap = (title, svg, color) => `<div class="jr-chart"${safeColor(color) ? ` style="--c:${safeColor(color)}"` : ''}>${title ? `<div class="jr-ch-t">${esc(title)}</div>` : ''}${svg}</div>`;

C.BarChart = ({ p }) => {
  const d = series(p, str(p.xKey), str(p.yKey));
  if (!d.length) return chartWrap(p.title, '<div class="jr-empty-c">暂无数据</div>');
  const g = plot(d, p, 'bar');
  const bw = Math.min(34, g.band * 0.62);
  const bars = d.map((r, i) => {
    const y0 = g.y(Math.max(0, r.value)), y1 = g.y(Math.min(0, r.value));
    return `<rect class="jr-bar" x="${(g.x(i) - bw / 2).toFixed(1)}" y="${y0.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1, y1 - y0).toFixed(1)}" rx="${Math.min(5, bw / 2).toFixed(1)}"/>`;
  }).join('');
  return chartWrap(p.title, `<svg class="jr-svg" viewBox="0 0 ${g.W} ${g.H}" role="img">${g.g}${bars}</svg>`, p.color);
};

function curve(pts) {
  return pts.map((q, i) => {
    if (!i) return `M${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
    const a = pts[i - 1], m = (a[0] + q[0]) / 2;
    return `C${m.toFixed(1)} ${a[1].toFixed(1)} ${m.toFixed(1)} ${q[1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  }).join('');
}
function lineChart(p, area) {
  const d = series(p, str(p.xKey), str(p.yKey));
  if (!d.length) return chartWrap(p.title, '<div class="jr-empty-c">暂无数据</div>');
  const g = plot(d, p, 'line');
  const pts = d.map((r, i) => [g.x(i), g.y(r.value)]);
  const path = curve(pts);
  const fill = area ? `<path class="jr-area" d="${path}L${pts[pts.length - 1][0].toFixed(1)} ${g.base.toFixed(1)}L${pts[0][0].toFixed(1)} ${g.base.toFixed(1)}Z"/>` : '';
  const dots = d.length <= 24 ? pts.map((q) => `<circle class="jr-dot-c" cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3"/>`).join('') : '';
  return chartWrap(p.title, `<svg class="jr-svg" viewBox="0 0 ${g.W} ${g.H}" role="img">${g.g}${fill}<path class="jr-line" d="${path}"/>${dots}</svg>`, p.color);
}
C.LineChart = ({ p }) => lineChart(p, false);
C.AreaChart = ({ p }) => lineChart(p, true);

function pie(p, donut) {
  const d = series({ data: p.data }, str(p.nameKey), str(p.valueKey)).filter((r) => r.value > 0);
  const total = d.reduce((a, r) => a + r.value, 0);
  if (!total) return chartWrap(p.title, '<div class="jr-empty-c">暂无数据</div>');
  const S = 140, c = S / 2, R = 64, r = donut ? 40 : 0;
  const pt = (a, rad) => [(c + rad * Math.cos(a)).toFixed(2), (c + rad * Math.sin(a)).toFixed(2)];
  let a0 = -Math.PI / 2;
  const slices = d.map((s, i) => {
    const frac = s.value / total, a1 = a0 + frac * Math.PI * 2 - (d.length > 1 ? 0 : 0.0001);
    const big = a1 - a0 > Math.PI ? 1 : 0;
    const o0 = pt(a0, R), o1 = pt(a1, R), i0 = pt(a0, r), i1 = pt(a1, r);
    let path;
    if (d.length === 1) path = donut ? `M${c} ${c - R}A${R} ${R} 0 1 1 ${c - 0.01} ${c - R}ZM${c} ${c - r}A${r} ${r} 0 1 0 ${c - 0.01} ${c - r}Z` : `M${c} ${c - R}A${R} ${R} 0 1 1 ${c - 0.01} ${c - R}Z`;
    else path = donut ? `M${o0}A${R} ${R} 0 ${big} 1 ${o1}L${i1}A${r} ${r} 0 ${big} 0 ${i0}Z` : `M${c} ${c}L${o0}A${R} ${R} 0 ${big} 1 ${o1}Z`;
    a0 += frac * Math.PI * 2;
    return `<path class="jr-slice" fill-rule="evenodd" style="fill:var(--jr-c${i % 6})" d="${path.replace(/,/g, ' ')}"/>`;
  }).join('');
  const center = donut ? `<text class="jr-pie-c" x="${c}" y="${c + 1}" text-anchor="middle">${esc(cut(str(p.centerLabel != null ? p.centerLabel : fmtNum(total)), 8))}</text>${p.centerLabel == null ? `<text class="jr-ax" x="${c}" y="${c + 16}" text-anchor="middle">合计</text>` : ''}` : '';
  const legend = `<ul class="jr-leg">${d.map((s, i) => `<li><i style="background:var(--jr-c${i % 6})"></i><span class="jr-leg-n">${esc(cut(s.name, 14))}</span><span class="jr-leg-v">${fmtNum(s.value)} · ${Math.round((s.value / total) * 100)}%</span></li>`).join('')}</ul>`;
  return `<div class="jr-chart">${p.title ? `<div class="jr-ch-t">${esc(p.title)}</div>` : ''}<div class="jr-pie"><svg class="jr-pie-s" viewBox="0 0 ${S} ${S}" width="${clamp(num(p.height, 140), 100, 220)}" role="img">${slices}${center}</svg>${legend}</div></div>`;
}
C.PieChart = ({ p }) => pie(p, false);
C.DonutChart = ({ p }) => pie(p, true);

C.Heatmap = ({ p }) => {
  const cols = listOf(p.columns).map(str), rows = listOf(p.rows).map(str);
  const vals = rows.map((_, r) => cols.map((_, c) => num(listOf(listOf(p.values)[r])[c], 0)));
  const flat = vals.flat();
  const lo = Math.min(...flat), hi = Math.max(...flat);
  if (!flat.length) return chartWrap(p.title, '<div class="jr-empty-c">暂无数据</div>');
  const cells = rows.map((rl, r) => `<span class="jr-hm-r">${esc(cut(rl, 8))}</span>${vals[r].map((v) => { const t = hi > lo ? (v - lo) / (hi - lo) : 0.5; return `<span class="jr-hm-c${t > 0.55 ? ' hot' : ''}" style="--t:${Math.round(10 + t * 85)}%">${cols.length <= 10 ? fmtNum(v) : ''}</span>`; }).join('')}`).join('');
  return `<div class="jr-chart">${p.title ? `<div class="jr-ch-t">${esc(p.title)}</div>` : ''}<div class="jr-hm" style="grid-template-columns:auto repeat(${cols.length},minmax(0,1fr))"><span></span>${cols.map((c) => `<span class="jr-hm-h">${esc(cut(c, 5))}</span>`).join('')}${cells}</div></div>`;
};

/* ───────────── code and markdown ───────────── */

const KW = /^(?:function|return|const|let|var|if|else|elif|for|while|import|from|export|default|class|new|async|await|try|catch|except|finally|throw|raise|def|self|None|True|False|true|false|null|undefined|in|of|as|type|interface|extends|public|private|static|void|int|string|fn|pub|use|mut|impl|struct|enum|match|with|lambda|yield|SELECT|FROM|WHERE|GROUP|BY|ORDER|LIMIT|JOIN|ON|AND|OR|NOT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|AS|DESC|ASC|COUNT|SUM|AVG)$/;
const RE_C = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;
const RE_H = /(#[^\n]*|--[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;
function highlight(code, lang) {
  const re = /^(py|python|sh|bash|shell|zsh|yaml|yml|ruby|rb|toml|sql)$/i.test(lang || '') ? RE_H : RE_C;
  re.lastIndex = 0;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    last = re.lastIndex;
    if (m[1]) out += `<span class="jr-tk-c">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="jr-tk-s">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="jr-tk-n">${esc(m[3])}</span>`;
    else out += KW.test(m[4]) ? `<span class="jr-tk-k">${esc(m[4])}</span>` : esc(m[4]);
  }
  return out + esc(code.slice(last));
}
function codeBlock(lang, code, filename) {
  const l = str(lang);
  return `<div class="jr-cb"><div class="jr-cb-h"><span class="jr-cb-f">${esc(filename || l || 'code')}</span><span class="jr-cb-l">${filename && l ? esc(l) : ''}</span>${ic('copy', 14, 'jr-cb-c')}</div><pre class="jr-cb-p"><code>${highlight(str(code).replace(/\n$/, ''), l)}</code></pre></div>`;
}
C.CodeBlock = ({ p }) => codeBlock(p.language, p.code, p.filename);

function inline(src) {
  const stash = [];
  let s = esc(src).replace(/`([^`]+)`/g, (_, c) => { stash.push(`<code class="jr-code-i">${c}</code>`); return '\u0000' + (stash.length - 1) + '\u0000'; });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>').replace(/~~([^~]+)~~/g, '<del>$1</del>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => { const h = safeUrl(u.replace(/&amp;/g, '&')); return `<a class="jr-a"${at('href', h)}${h === '#' ? '' : ' target="_blank" rel="noopener noreferrer"'}>${t}</a>`; });
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[+i]);
}
const cells = (ln) => ln.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
function markdown(src) {
  const lines = str(src).replace(/\r/g, '').split('\n');
  const BLOCK = /^(\s*$|#{1,4}\s|```|\s*>|\s*[-*+]\s+|\s*\d+[.)]\s+|\s*([-*_])\2{2,}\s*$)/;
  let i = 0, out = '';
  while (i < lines.length) {
    const ln = lines[i];
    let m;
    if (/^\s*$/.test(ln)) { i++; continue; }
    if ((m = /^```\s*(\S*)/.exec(ln))) {
      const buf = [];
      for (i++; i < lines.length && !/^```/.test(lines[i]); i++) buf.push(lines[i]);
      i++;
      out += codeBlock(m[1], buf.join('\n'));
    } else if ((m = /^(#{1,4})\s+(.*)$/.exec(ln))) { out += `<h${m[1].length} class="jr-h jr-h${m[1].length}">${inline(m[2])}</h${m[1].length}>`; i++; }
    else if (/^\s*([-*_])\1{2,}\s*$/.test(ln)) { out += '<div class="jr-sep"></div>'; i++; }
    else if (/^\s*>/.test(ln)) {
      const buf = [];
      for (; i < lines.length && /^\s*>/.test(lines[i]); i++) buf.push(lines[i].replace(/^\s*>\s?/, ''));
      out += `<blockquote class="jr-bq">${inline(buf.join(' '))}</blockquote>`;
    } else if (/^\s*[-*+]\s+/.test(ln) || /^\s*\d+[.)]\s+/.test(ln)) {
      const ord = /^\s*\d+[.)]\s+/.test(ln), re = ord ? /^\s*\d+[.)]\s+/ : /^\s*[-*+]\s+/, buf = [];
      for (; i < lines.length && re.test(lines[i]); i++) buf.push(lines[i].replace(re, ''));
      out += `<${ord ? 'ol' : 'ul'} class="jr-ul">${buf.map((b) => `<li>${inline(b)}</li>`).join('')}</${ord ? 'ol' : 'ul'}>`;
    } else if (ln.includes('|') && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(lines[i + 1])) {
      const head = cells(ln), rows = [];
      for (i += 2; i < lines.length && lines[i].includes('|') && !/^\s*$/.test(lines[i]); i++) rows.push(cells(lines[i]));
      out += `<div class="jr-tbl"><div class="jr-tbl-w"><table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${head.map((_, k) => `<td${NUMERIC.test((r[k] || '').trim()) ? ' class="jr-num"' : ''}>${inline(r[k] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
    } else {
      const buf = [];
      for (; i < lines.length && (!buf.length || !BLOCK.test(lines[i])); i++) buf.push(lines[i]);
      out += `<p class="jr-p">${inline(buf.join(' '))}</p>`;
    }
  }
  return out;
}
C.Markdown = ({ p }) => `<div class="jr-md">${markdown(p.content != null ? p.content : p.text)}</div>`;

/* ───────────── multimodal ───────────── */

C.ImageGrid = ({ p }) => {
  const cols = clamp(Math.round(num(p.columns, 3)), 1, 4);
  return `<div class="jr-ig" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${listOf(p.images).map((im, i) => {
    const src = safeImg(im && im.src), alt = str(im && im.alt);
    return src ? `<img class="jr-ig-i"${at('src', src)} alt="${esc(alt)}" loading="lazy">` : `<div class="jr-ig-i jr-img-ph" style="--h:${(hash(alt) + i * 47) % 360}" role="img" aria-label="${esc(alt)}">${ic('img', 22)}<span>${esc(cut(alt, 10))}</span></div>`;
  }).join('')}</div>`;
};

const KIND = { pdf: ['PDF', '#ff3b30'], doc: ['DOC', '#2f7bff'], xls: ['XLS', '#1fae52'], ppt: ['PPT', '#ff8a00'], zip: ['ZIP', '#8e8e93'], image: ['IMG', '#af52de'], audio: ['MP3', '#ff2d78'], video: ['MOV', '#5856d6'], other: ['FILE', '#8e8e93'] };
C.FileCard = ({ p }) => {
  const k = KIND[pick(p.kind, Object.keys(KIND), 'other')];
  const meta = [p.size, p.pages != null ? p.pages + ' 页' : ''].filter(Boolean).map(esc).join(' · ');
  return `<div class="jr-file"><span class="jr-file-i" style="--k:${k[1]}">${k[0]}</span><div class="jr-file-b"><div class="jr-file-n">${esc(p.name)}</div>${meta ? `<div class="jr-file-m">${meta}</div>` : ''}</div>${ic('dl', 18, 'jr-file-d')}</div>`;
};

C.AudioMessage = ({ p }) => {
  let w = listOf(p.waveform).map((v) => clamp(num(v, 0.3), 0.08, 1));
  if (!w.length) w = Array.from({ length: 30 }, (_, i) => 0.2 + 0.8 * Math.abs(Math.sin(i * 1.7 + (hash(str(p.duration)) % 7)) * Math.cos(i * 0.63)));
  const played = Math.round(w.length * 0.35);
  return `<div class="jr-audio"><div class="jr-au-r"><span class="jr-au-p">${ic('play', 14)}</span><div class="jr-wave">${w.map((v, i) => `<i${i < played ? ' class="on"' : ''} style="height:${Math.round(4 + v * 24)}px"></i>`).join('')}</div><span class="jr-au-d">${esc(p.duration)}</span></div>${p.transcript ? `<div class="jr-au-t">${esc(p.transcript)}</div>` : ''}</div>`;
};

C.VideoCard = ({ p, ctx }) => {
  const src = safeImg(p.poster);
  return `<div class="jr-video"><div class="jr-vid-p${src ? '' : ' jr-img-ph'}" style="--h:${hash(str(p.title)) % 360};${src ? `background-image:url(&quot;${esc(src)}&quot;)` : ''}">${glass(ctx, 'jr-vid-b', ic('play', 22))}${p.duration ? `<span class="jr-vid-d">${esc(p.duration)}</span>` : ''}</div><div class="jr-vid-t">${esc(p.title)}</div></div>`;
};

C.MapCard = ({ p }) => `<div class="jr-map"><svg class="jr-map-s" viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<rect width="360" height="150" class="jr-map-bg"/><rect x="214" y="14" width="96" height="52" rx="10" class="jr-map-park"/><path d="M-10 108C60 90 110 130 190 112S310 70 380 92v70H-10z" class="jr-map-water"/>
<g class="jr-map-rd"><path d="M0 40h360M0 84h360M70 0v150M170 0v150M262 0v150"/></g><g class="jr-map-rd2"><path d="M0 62h360M120 0v150M216 0v150M310 0v150" /></g>
<path d="M70 84H170V40H262" class="jr-map-route"/><circle cx="70" cy="84" r="5" class="jr-map-from"/>
<g transform="translate(262 40)"><path d="M0 0c-9-10-12-17-12-23a12 12 0 1124 0c0 6-3 13-12 23z" class="jr-map-pin"/><circle cx="0" cy="-23" r="4.5" fill="#fff"/></g></svg>
<div class="jr-map-b"><div class="jr-map-t">${esc(p.title)}</div>${p.address ? `<div class="jr-map-a">${ic('pin', 13)}<span>${esc(p.address)}</span></div>` : ''}${p.distance || p.eta ? `<div class="jr-map-c">${p.distance ? `<span>${esc(p.distance)}</span>` : ''}${p.eta ? `<span>${esc(p.eta)}</span>` : ''}</div>` : ''}</div></div>`;

const WX = {
  sunny: ['晴', '<circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3L7 7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7"/>'],
  cloudy: ['多云', '<path d="M7 18.5a4.2 4.2 0 010-8.4 5.6 5.6 0 0110.7-1 4.7 4.7 0 01-.7 9.4z" fill="currentColor" stroke="none"/>'],
  rain: ['雨', '<path d="M7 15a4.2 4.2 0 010-8.4 5.6 5.6 0 0110.7-1A4.7 4.7 0 0117 15z" fill="currentColor" stroke="none"/><path d="M8 18.5l-1 2.5M12.5 18.5l-1 2.5M17 18.5l-1 2.5"/>'],
  snow: ['雪', '<path d="M7 15a4.2 4.2 0 010-8.4 5.6 5.6 0 0110.7-1A4.7 4.7 0 0117 15z" fill="currentColor" stroke="none"/><path d="M8 18.5v.01M12 20.5v.01M16 18.5v.01" stroke-width="3"/>'],
  storm: ['雷暴', '<path d="M7 14.5a4.2 4.2 0 010-8.4 5.6 5.6 0 0110.7-1A4.7 4.7 0 0117 14.5z" fill="currentColor" stroke="none"/><path d="M12.5 14.5l-3 4.5h4l-2 3.5" stroke-width="2"/>'],
};
const wxIcon = (c, s) => `<svg class="jr-wx-i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(WX[c] || WX.cloudy)[1]}</svg>`;
C.WeatherCard = ({ p }) => {
  const c = pick(p.condition, Object.keys(WX), 'cloudy');
  const hr = listOf(p.hourly);
  return `<div class="jr-wx jr-wx-${c}"><div class="jr-wx-top"><div><div class="jr-wx-city">${ic('pin', 13)}${esc(p.city)}</div><div class="jr-wx-temp">${esc(p.temp)}°</div><div class="jr-wx-cond">${WX[c][0]}${p.high != null || p.low != null ? ` · 高 ${esc(p.high)}° 低 ${esc(p.low)}°` : ''}</div></div>${wxIcon(c, 64)}</div>${hr.length ? `<div class="jr-wx-h">${hr.map((h) => `<div><span>${esc(h && h.time)}</span>${wxIcon(pick(h && h.condition, Object.keys(WX), 'cloudy'), 22)}<b>${esc(h && h.temp)}°</b></div>`).join('')}</div>` : ''}</div>`;
};

C.Sources = ({ p }) => `<div class="jr-srcs"><div class="jr-srcs-t">${ic('link', 13)}来源</div>${listOf(p.items).map((it, i) => {
  const u = it && it.url ? safeUrl(it.url) : '#';
  const body = `<span class="jr-src-n">${i + 1}</span><span class="jr-src-f" style="--h:${hash(str(it && it.site)) % 360}">${esc(str(it && it.site).slice(0, 1).toUpperCase())}</span><span class="jr-src-b"><span class="jr-src-t">${esc(it && it.title)}</span><span class="jr-src-s">${esc(it && it.site)}</span></span>`;
  return u === '#' ? `<div class="jr-src">${body}</div>` : `<a class="jr-src"${at('href', u)} target="_blank" rel="noopener noreferrer">${body}</a>`;
}).join('')}</div>`;

C.ToolSteps = ({ p }) => `<ol class="jr-steps">${listOf(p.steps).map((s) => {
  const st = pick(s && s.status, ['done', 'running', 'pending', 'error'], 'pending');
  const mark = { done: ic('check', 11), running: '<svg class="jr-spin-s" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="3.5" stroke-linecap="round"><path d="M12 3a9 9 0 019 9" stroke="currentColor"/></svg>', pending: '', error: ic('x', 11) }[st];
  return `<li class="jr-st jr-st-${st}"><span class="jr-st-m">${mark}</span><div><div class="jr-st-l">${esc(s && s.label)}</div>${s && s.detail ? `<div class="jr-st-d">${esc(s.detail)}</div>` : ''}</div></li>`;
}).join('')}</ol>`;

C.FollowUps = ({ p }) => `<div class="jr-fu">${listOf(p.items).map((t) => `<span class="jr-fu-i"><span>${esc(isObj(t) ? t.text || t.label : t)}</span>${ic('arrow', 13)}</span>`).join('')}</div>`;

C.Streaming = ({ p }) => `<div class="jr-stream"><div class="jr-stream-t">${esc(p.text)}${p.cursor === false ? '' : '<span class="jr-cursor"></span>'}</div><div class="jr-stream-s"><div class="jr-skel" style="width:92%;height:12px"></div><div class="jr-skel" style="width:78%;height:12px"></div><div class="jr-skel" style="width:44%;height:12px"></div></div></div>`;

/* ───────────── root ───────────── */

const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

function draw(spec, state, ui, opts) {
  const ctx = { spec, state, ui, mode: opts.mode === 'dark' ? 'dark' : 'light', uid: opts.uid || 'r', open: !!opts.open, scope: '', depth: 0, hasItem: false };
  const html = node(spec.root, ctx);
  return opts.frame ? glass(ctx, 'jr-card jr-frame', `<div class="jr-card-b">${html}</div>`) : html;
}

/// spec (any accepted shape) → HTML, for the build.
function renderRoot(value, opts) {
  const spec = normalize(value);
  return draw(spec, clone(spec.state), {}, opts || {});
}

/* ───────────── live DOM ───────────── */

function syncAttrs(x, y) {
  const keepStyle = x.classList.contains('hl-glass');   // the engine writes --hyalite onto glass elements
  for (let i = x.attributes.length - 1; i >= 0; i--) {
    const n = x.attributes[i].name;
    if (!y.hasAttribute(n) && !(keepStyle && n === 'style')) x.removeAttribute(n);
  }
  for (const a of y.attributes) {
    if (keepStyle && a.name === 'style') continue;
    if (x.getAttribute(a.name) !== a.value) x.setAttribute(a.name, a.value);
  }
}
function patch(x, y) {
  if (x.nodeType !== y.nodeType || x.nodeName !== y.nodeName) { x.parentNode.replaceChild(y.cloneNode(true), x); return; }
  if (x.nodeType !== 1) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; return; }
  syncAttrs(x, y);
  const tag = x.nodeName;
  if (tag === 'TEXTAREA') { if (x.value !== y.textContent) x.value = y.textContent; return; }
  morph(x, y);
  if (tag === 'INPUT') {
    if (x.type === 'checkbox' || x.type === 'radio') x.checked = y.hasAttribute('checked');
    else if (x.value !== (y.getAttribute('value') || '')) x.value = y.getAttribute('value') || '';
  } else if (tag === 'SELECT') x.value = y.getAttribute('data-v') || '';
}
function morph(from, to) {
  const b = to.childNodes;
  for (let i = 0; i < b.length; i++) {
    if (i >= from.childNodes.length) from.appendChild(b[i].cloneNode(true));
    else patch(from.childNodes[i], b[i]);
  }
  while (from.childNodes.length > b.length) from.removeChild(from.lastChild);
}

const coerce = (v, kind) => (kind === 'n' ? Number(v) : kind === 'b' ? v === '1' || v === 'true' : v);

/// Renders into `el` and keeps it live: Tabs, Accordion, Collapsible, Switch, Checkbox, Select,
/// Slider and the other controls update the spec's state (and the local state of the element).
function mount(el, value, opts) {
  const inst = el.__jr || (el.__jr = { el, wired: false });
  inst.opts = opts || inst.opts || {};
  inst.render = () => {
    if (inst.error) { el.innerHTML = `<div class="jr-err">${esc(inst.error)}</div>`; return; }
    const t = document.createElement('template');
    t.innerHTML = draw(inst.spec, inst.state, inst.ui, Object.assign({ uid: el.id || 'm' }, inst.opts));
    if (el.querySelector('.jr-err')) el.textContent = '';
    morph(el, t.content);
  };
  inst.set = (v) => {
    try { inst.spec = normalize(v); inst.state = clone(inst.spec.state); inst.ui = {}; inst.error = null; }
    catch (e) { inst.error = e.message; }
    inst.render();
  };
  const write = (t, v) => { if (t.startsWith('s:')) setPath(inst.state, t.slice(2), v); else inst.ui[t.slice(2)] = v; };
  if (!inst.wired) {
    inst.wired = true;
    el.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('[data-jr]');
      if (!b || !el.contains(b) || b.disabled) return;
      const d = b.dataset;
      if (d.jr === 'set') write(d.t, coerce(d.v, d.vt));
      else if (d.jr === 'tog') write(d.t, d.cur !== '1');
      else if (d.jr === 'multi') {
        const cur = JSON.parse(d.cur || '[]'), v = coerce(d.v, d.vt || (/\.open$/.test(d.t) ? 'n' : ''));
        write(d.t, d.single ? (cur.includes(v) ? [] : [v]) : cur.includes(v) ? cur.filter((x) => x !== v) : cur.concat([v]));
      } else if (d.jr === 'pick') { write(d.t, d.v); if (d.close) write(d.close, false); }
      else return;
      inst.render();
    });
    const onInput = (e) => {
      const x = e.target, m = x.dataset && x.dataset.jrIn;
      if (!m || !x.dataset.t) return;
      if (m === 'bool') { if (e.type !== 'change') return; write(x.dataset.t, x.checked); }
      else write(x.dataset.t, m === 'num' ? Number(x.value) : x.value);
      inst.render();
    };
    el.addEventListener('input', onInput);
    el.addEventListener('change', onInput);
  }
  inst.set(value);
  return inst;
}

/// Where in the text a JSON.parse error is: { line, column } (1-based) or null.
function errorAt(text, err) {
  const m = /position (\d+)/.exec(err.message) || null;
  const lc = /line (\d+) column (\d+)/.exec(err.message);
  if (lc) return { line: +lc[1], column: +lc[2] };
  if (!m) return null;
  const upto = text.slice(0, +m[1]).split('\n');
  return { line: upto.length, column: upto[upto.length - 1].length + 1 };
}

G.JR = { renderRoot, mount, normalize, errorAt, markdown, version: '1' };
})(typeof globalThis !== 'undefined' ? globalThis : window);
