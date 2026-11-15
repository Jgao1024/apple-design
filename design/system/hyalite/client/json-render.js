// Driver for pages/json-render. Needs Hyalite, window.HL_STANDARD (presets.ts) and JR (jr-render.js).
//  1. Standard glass: the fill / shadow variables, and the engine options per mode.
//  2. Glass is attached when it comes near the viewport and detached when the renderer removes it
//     (the preview re-renders, so glass comes and goes). Hyalite.watch would attach all ~300 at load.
//  3. Every .jr[data-spec] gets the live renderer so the showcase is interactive; the spec is read
//     from the <pre> next to it.
//  4. The paste-JSON preview.
(() => {
  const S = window.HL_STANDARD;
  const ENGINE = ['bevel', 'thickness', 'slope', 'shade', 'rim', 'edgeW', 'sat', 'edge', 'blur', 'dispersion', 'light', 'smooth'];
  const root = document.documentElement.style;
  const ok = Hyalite.supported();
  const opts = {};
  ['light', 'dark'].forEach((mode) => {
    const p = S[mode];
    root.setProperty('--hl-tone-' + mode, p.tone);
    root.setProperty('--hl-fill-' + mode, p.fill);
    root.setProperty('--hl-shadow-' + mode, p.shadow);
    const o = { shape: p.shape, materialize: 0, settle: 0 };
    ENGINE.forEach((k) => { o[k] = p[k]; });
    opts[mode] = o;
  });
  if (!ok) document.getElementById('hl-unsupported').hidden = false;

  /* glass: attach near the viewport, detach when removed */
  const seen = new WeakSet();
  const io = ok ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      if (e.target.isConnected) Hyalite.attach(e.target, opts[e.target.dataset.mode] || opts.light);
    });
  }, { rootMargin: '400px 0px' }) : null;
  const glassIn = (n) => (n.nodeType !== 1 ? [] : (n.matches('.hl-glass') ? [n] : []).concat(Array.from(n.querySelectorAll('.hl-glass'))));
  const add = (n) => glassIn(n).forEach((g) => { if (io && !seen.has(g)) { seen.add(g); io.observe(g); } });
  const drop = (n) => glassIn(n).forEach((g) => { if (!io || g.isConnected) return; seen.delete(g); io.unobserve(g); Hyalite.detach(g); });
  if (ok) {
    new MutationObserver((ms) => ms.forEach((m) => { m.addedNodes.forEach(add); m.removedNodes.forEach(drop); }))
      .observe(document.body, { childList: true, subtree: true });
    add(document.body);
  }

  /* phones: scale the 393 pt screens to the viewport */
  const fit = () => root.setProperty('--fit', Math.min(1, (document.documentElement.clientWidth - 32) / 393).toFixed(3));
  fit();
  addEventListener('resize', fit);

  /* the showcase becomes interactive */
  document.querySelectorAll('.jr[data-spec]').forEach((el) => {
    const src = document.getElementById(el.dataset.spec);
    if (!src) return;
    let spec;
    try { spec = JSON.parse(src.textContent); } catch (e) { return; }
    JR.mount(el, spec, { mode: el.dataset.mode, uid: el.id, frame: el.dataset.frame === '1', open: el.dataset.open === '1' });
  });

  /* paste JSON → live preview */
  const $ = (id) => document.getElementById(id);
  const ta = $('jr-in'), status = $('jr-status');
  const panes = [$('jr-p-light'), $('jr-p-dark')];
  const samples = JSON.parse($('jr-samples').textContent);
  let timer = 0;
  const run = () => {
    const text = ta.value;
    let v;
    try { v = JSON.parse(text); } catch (e) {
      const at = JR.errorAt(text, e);
      const line = at ? (text.split('\n')[at.line - 1] || '').trim().slice(0, 60) : '';
      status.className = 'bad';
      status.textContent = 'JSON 语法错误' + (at ? '：第 ' + at.line + ' 行第 ' + at.column + ' 列' : '') + (line ? '，附近 “' + line + '”' : '') + '。预览保留上一次的结果。';
      return;
    }
    panes.forEach((p) => JR.mount(p, v, { mode: p.dataset.mode, uid: p.id }));
    const err = panes[0].__jr.error;
    status.className = err ? 'bad' : 'ok';
    status.textContent = err ? err : '渲染成功：' + Object.keys(panes[0].__jr.spec.elements).length + ' 个元素';
  };
  ta.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 200); });
  const buttons = Array.from(document.querySelectorAll('[data-sample]'));
  buttons.forEach((b) => b.addEventListener('click', () => {
    ta.value = samples[+b.dataset.sample].text;
    buttons.forEach((x) => x.classList.toggle('on', x === b));
    run();
  }));
  $('jr-format').addEventListener('click', () => {
    try { ta.value = JSON.stringify(JSON.parse(ta.value), null, 2); run(); } catch (e) { run(); }
  });
  ta.value = samples[0].text;
  run();
})();
