import { Markup, raw } from "@design/jsx/jsx-runtime";
import { GLASS_CSS } from "../../components/glass.tsx";
import { Stage } from "../../components/lab.tsx";
import { STANDARD } from "../../presets.ts";
import { CHAT_ANALYSIS, CHAT_MULTI, CHAT_MULTI_USER, CHAT_TRIP, fmt, SAMPLES, SECTIONS, type Demo, type Spec } from "../../components/jr-specs.ts";
import "../../client/jr-render.js";

// json-render with the standard glass (docs/glass-gallery-next.md §4): every official component with its
// JSON next to the render, the multimodal extensions, three AI chat screens, and a paste-JSON preview.
// One self-contained file. The renderer (client/jr-render.js) draws the static markup here at build
// time and is inlined again so the page stays live. The shell is not gallery.tsx's GalleryPage because
// each item here is "JSON | light | dark" and the stages are fluid; the wallpapers are inlined the same way.

const JR = (globalThis as unknown as { JR: { renderRoot(spec: unknown, opts: Record<string, unknown>): string } }).JR;

const WALLPAPERS = new URL("../../../../.ref/wallpapers/", import.meta.url);
function dataUrl(name: string): string {
  try {
    const bytes = Deno.readFileSync(new URL(name, WALLPAPERS));
    let text = "";
    for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return `url("data:image/jpeg;base64,${btoa(text)}")`;
  } catch {
    return "none"; // .ref/ is local to the Mac that made it; elsewhere the photo cells fall back to their colour
  }
}
const PHOTOS = [["aerial.jpg", "--hl-aerial"], ["sonoma.jpg", "--hl-sonoma"]] as const;
const inlinePhotos = (html: string) =>
  PHOTOS.reduce((s, [file, name]) => s.replaceAll(`url(&quot;../../../.ref/wallpapers/${file}&quot;)`, `var(${name})`), html);

const inline = (path: string): string => {
  const code = Deno.readTextFileSync(new URL(`../../${path}`, import.meta.url));
  if (/<\/script/i.test(code)) throw new Error(`${path} contains "</script" and cannot be inlined`);
  return code;
};
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const MODES = [{ mode: "light", label: "浅色模式" }, { mode: "dark", label: "深色模式" }] as const;

/* ───────────── page CSS ───────────── */

const CSS = `
:root{${PHOTOS.map(([file, name]) => `${name}:${dataUrl(file)}`).join(";")}}
.pg{max-width:1140px;margin:0 auto;padding:32px 16px 72px;color:#1d1d1f;background:#fefefe}
.pg h1{margin:0;font:700 24px/32px var(--font-sans)}.pg h2{margin:0;font:700 20px/28px var(--font-sans)}.pg h3{margin:0;font:600 15px/20px var(--font-sans)}
.pg p{margin:0}.pg-sub{margin-top:4px;font-size:14px;line-height:20px;color:#6e6e73}
.pg-warn{margin-top:12px;border-radius:10px;background:#fff4e5;padding:8px 12px;font-size:14px;line-height:20px;color:#8a5300}
.pg-nav{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}.pg-nav a,.pg-sample{display:inline-block;padding:5px 12px;border-radius:999px;background:#f2f2f7;color:#1d1d1f;font:500 13px/18px var(--font-sans);text-decoration:none;border:0;cursor:pointer}
.pg-nav a:hover,.pg-sample:hover{background:#e5e5ea}.pg-sample.on{background:#007aff;color:#fff}
.pg-sec{margin-top:48px;border-top:1px solid #d2d2d7;padding-top:28px;scroll-margin-top:12px}.pg-desc{margin-top:4px;font-size:14px;line-height:20px;color:#6e6e73}
.pg-item{margin-top:32px;scroll-margin-top:12px}.pg-item h3 code,.pg-sec h3 code{margin-left:8px;font:400 12px var(--font-mono);color:#6e6e73}
.pg-note{margin-top:4px;font-size:12px;line-height:17px;color:#6e6e73}
.pg-cols{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1fr) minmax(0,1fr);gap:14px;margin-top:10px;align-items:start}
.pg-code{min-width:0}.pg-code pre,.pg-code textarea{display:block;width:100%;margin:0;padding:12px 14px;border:0;border-radius:12px;background:#f5f5f7;color:#1d1d1f;font:12px/1.55 var(--font-mono);overflow:auto;white-space:pre;tab-size:2}
.pg-code pre{max-height:440px}.pg-code textarea{height:420px;resize:vertical;white-space:pre;outline:none}.pg-code textarea:focus{box-shadow:0 0 0 2px #007aff}
.pg-stagew{min-width:0}.pg-lab{margin-bottom:4px;font-size:12px;line-height:16px;color:#6e6e73}
.pg-stage{padding:16px;min-height:96px;display:flex;flex-direction:column;justify-content:center}.pg-prev .pg-stage{min-height:420px;justify-content:flex-start}
.pg-tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;align-items:center}.pg-tools .gap{flex:1}
#jr-status{margin-top:8px;font-size:12px;line-height:17px;color:#6e6e73;min-height:17px}#jr-status.ok{color:#1f8a3e}#jr-status.bad{color:#d70015}
.pg-props{margin-top:10px;width:100%;border-collapse:collapse;font-size:12px;line-height:17px}.pg-props th{text-align:left;font-weight:600;color:#6e6e73;padding:4px 10px 4px 0;border-bottom:1px solid #d2d2d7}
.pg-props td{padding:5px 10px 5px 0;border-bottom:1px solid #ececf0;vertical-align:top}.pg-props td{overflow-wrap:anywhere}.pg-props td:first-child{font-family:var(--font-mono)}.pg-props td:nth-child(2){color:#6e6e73;font-family:var(--font-mono)}
.pg-phones{display:flex;flex-wrap:wrap;gap:16px;margin-top:10px}.pg-phone{zoom:var(--fit,1)}
.pg-det{margin-top:10px;font-size:12px}.pg-det summary{cursor:pointer;color:#6e6e73}.pg-det pre{margin:8px 0 0;padding:12px 14px;border-radius:12px;background:#f5f5f7;font:12px/1.55 var(--font-mono);overflow:auto;max-height:360px}

/* chat screens: 393 x 852 */
.pg-chat{position:relative;width:393px;height:852px;border-radius:44px;overflow:hidden;box-shadow:0 0 0 1px rgb(0 0 0/.1)}
.pg-chat[data-mode=light]{color:#000;background:radial-gradient(120% 55% at 0% 0%,#cfe0ff 0,transparent 62%),radial-gradient(90% 45% at 100% 28%,#ecd3ff 0,transparent 62%),radial-gradient(110% 45% at 0% 100%,#cdf2e2 0,transparent 62%),#f3f5fa}
.pg-chat[data-mode=dark]{color:#fff;background:radial-gradient(120% 55% at 0% 0%,#1d3566 0,transparent 62%),radial-gradient(90% 45% at 100% 28%,#40205f 0,transparent 62%),radial-gradient(110% 45% at 0% 100%,#0f3d33 0,transparent 62%),#090b12}
.pg-scroll{position:absolute;inset:0;overflow-y:auto;scrollbar-width:none;padding:118px 14px 120px;display:flex;flex-direction:column;gap:18px}.pg-scroll::-webkit-scrollbar{display:none}
.pg-u{align-self:flex-end;max-width:82%;padding:10px 15px;border-radius:21px 21px 6px 21px;background:#007aff;color:#fff;font-size:16px;line-height:22px}
.pg-chat[data-mode=dark] .pg-u{background:#0a84ff}
.pg-ua{align-self:flex-end;width:78%}.pg-ua .jr{display:block}
.pg-ai{display:flex;align-items:center;gap:7px;margin-bottom:8px;font:600 13px/1 var(--font-sans);opacity:.75}
.pg-ai i{width:24px;height:24px;border-radius:12px;background:linear-gradient(135deg,#5ac8fa,#af52de);display:grid;place-items:center;color:#fff}
.pg-top{position:absolute;left:0;right:0;top:0;padding:0 14px}
.pg-status{display:flex;justify-content:space-between;align-items:center;height:54px;padding:6px 14px 0;font:600 16px/1 var(--font-sans)}.pg-status span{display:flex;gap:6px;align-items:center}
.pg-nav2{display:flex;justify-content:space-between;align-items:center;margin-top:2px}
.pg-gc{width:44px;height:44px;border-radius:22px;display:grid;place-items:center;flex:none}
.pg-gp{height:44px;border-radius:22px;padding:0 18px;display:flex;align-items:center;gap:7px;font:600 16px/1 var(--font-sans)}
.pg-bot{position:absolute;left:14px;right:14px;bottom:30px;display:flex;gap:10px;align-items:center}
.pg-in{flex:1;height:48px;border-radius:24px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;font-size:16px;opacity:.9}.pg-in span{opacity:.5}
.pg-home{position:absolute;left:50%;bottom:8px;width:134px;height:5px;margin-left:-67px;border-radius:3px;background:currentColor;opacity:.9}

@media (max-width:940px){.pg-cols{grid-template-columns:1fr 1fr}.pg-code{grid-column:1/-1}.pg-prev .pg-stage{min-height:300px}}
@media (max-width:600px){.pg-cols{grid-template-columns:1fr}}
`;

/* ───────────── pieces ───────────── */

function root(id: string, mode: string, srcId: string, spec: Spec, extra: { frame?: boolean; open?: boolean } = {}): string {
  const html = JR.renderRoot(spec, { mode, uid: id, frame: !!extra.frame, open: !!extra.open });
  return `<div class="jr" id="${id}" data-mode="${mode}" data-spec="${srcId}"${extra.frame ? ' data-frame="1"' : ""}${extra.open ? ' data-open="1"' : ""}>${html}</div>`;
}

function stage(mode: "light" | "dark", inner: string): string {
  return Stage({ mode, width: 0, height: 0, bg: "photo", radius: 18, class: "pg-stage", style: "width:100%;height:auto", children: raw(inner) }).html;
}

function item(d: Demo): string {
  const src = `s-${d.id}`;
  const stages = MODES.map(({ mode, label }) =>
    `<div class="pg-stagew"><div class="pg-lab">${label}</div>${stage(mode, root(`r-${d.id}-${mode[0]}`, mode, src, d.spec, d))}</div>`
  ).join("");
  const props = d.props
    ? `<table class="pg-props"><thead><tr><th>props</th><th>类型</th><th>说明</th></tr></thead><tbody>${d.props.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table>`
    : "";
  return `<div class="pg-item" id="c-${d.id}"><h3>${esc(d.title)}</h3><p class="pg-note">${esc(d.note)}</p>
<div class="pg-cols"><div class="pg-code"><pre id="${src}">${esc(fmt(d.spec))}</pre></div>${stages}</div>${props}</div>`;
}

function section(s: { id: string; title: string; description: string; demos: Demo[] }): string {
  return `<section class="pg-sec" id="${s.id}"><h2>${esc(s.title)}</h2><p class="pg-desc">${esc(s.description)}</p>${s.demos.map(item).join("")}</section>`;
}

function preview(): string {
  const first = JSON.parse(SAMPLES[0].text) as Spec;
  const stages = MODES.map(({ mode, label }) =>
    `<div class="pg-stagew"><div class="pg-lab">${label}</div>${stage(mode, `<div class="jr" id="jr-p-${mode}" data-mode="${mode}">${JR.renderRoot(first, { mode, uid: `jr-p-${mode}` })}</div>`)}</div>`
  ).join("");
  const samples = JSON.stringify(SAMPLES).replace(/</g, "\\u003c");
  return `<section class="pg-sec pg-prev" id="preview"><h2>粘贴 JSON 实时预览</h2>
<p class="pg-desc">把模型输出的 spec 粘进左边的框，右边立刻出浅色和深色两份。写错 JSON 会指出位置，不会白屏；写错 type 画占位卡。Tabs、Switch、Select、Slider 等可以直接在预览里操作。</p>
<div class="pg-tools">${SAMPLES.map((s, i) => `<button type="button" class="pg-sample${i ? "" : " on"}" data-sample="${i}">${esc(s.name)}</button>`).join("")}<span class="gap"></span><button type="button" class="pg-sample" id="jr-format">格式化</button></div>
<div class="pg-cols"><div class="pg-code"><textarea id="jr-in" spellcheck="false" autocomplete="off" aria-label="json-render spec">${esc(SAMPLES[0].text)}</textarea><div id="jr-status"></div></div>${stages}</div>
<script type="application/json" id="jr-samples">${samples}</script></section>`;
}

const ICON = {
  back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  more: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
  plus: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  mic: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',
  spark: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7z"/></svg>',
  status: '<svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="26" height="12" viewBox="0 0 26 12" fill="none" stroke="currentColor"><rect x=".5" y=".5" width="22" height="11" rx="3.5" opacity=".4"/><rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" stroke="none"/><path d="M24 4v4" opacity=".5" stroke-linecap="round"/></svg>',
};

type Screen = { id: string; title: string; note: string; user: { text?: string; spec?: Spec }; answer: Spec };

function glassDiv(mode: string, cls: string, inner: string, style = ""): string {
  return `<div class="hl-glass ${cls}" data-mode="${mode}"${style ? ` style="${style}"` : ""}>${inner}</div>`;
}

function phone(s: Screen, mode: "light" | "dark"): string {
  const m = mode[0];
  const user = s.user.spec
    ? `<div class="pg-ua">${root(`${s.id}-u-${m}`, mode, `s-${s.id}-user`, s.user.spec)}</div>`
    : `<div class="pg-u">${esc(s.user.text ?? "")}</div>`;
  return `<div class="pg-phone"><div class="pg-chat" data-mode="${mode}">
<div class="pg-scroll">${user}<div><div class="pg-ai"><i>${ICON.spark}</i>智能助手</div>${root(`${s.id}-a-${m}`, mode, `s-${s.id}`, s.answer)}</div></div>
<div class="pg-top"><div class="pg-status"><span>9:41</span><span>${ICON.status}</span></div>
<div class="pg-nav2">${glassDiv(mode, "pg-gc", ICON.back)}${glassDiv(mode, "pg-gp", ICON.spark + "智能助手")}${glassDiv(mode, "pg-gc", ICON.more)}</div></div>
<div class="pg-bot">${glassDiv(mode, "pg-gc", ICON.plus, "width:48px;height:48px;border-radius:24px")}${glassDiv(mode, "pg-in", `<span>发消息…</span>${ICON.mic}`)}</div>
<div class="pg-home"></div></div></div>`;
}

function screen(s: Screen): string {
  const labels = MODES.map(({ mode, label }) => `<div class="pg-stagew"><div class="pg-lab">${label}</div>${phone(s, mode)}</div>`).join("");
  return `<div class="pg-item" id="${s.id}"><h3>${esc(s.title)}</h3><p class="pg-note">${esc(s.note)}</p>
<div class="pg-phones">${labels}</div>
<details class="pg-det"><summary>这条回答的 JSON</summary><pre id="s-${s.id}">${esc(fmt(s.answer))}</pre>${s.user.spec ? `<pre id="s-${s.id}-user">${esc(fmt(s.user.spec))}</pre>` : ""}</details></div>`;
}

const SCREENS: Screen[] = [
  { id: "chat-1", title: "1 · 数据分析回答", note: "工具步骤、指标、柱状图、表格和追问。图表和表格画在玻璃卡片里面，是实色。可以在手机框里上下滚，内容会从玻璃栏下面穿过。", user: { text: "帮我分析一下上个季度各渠道的销售情况" }, answer: CHAT_ANALYSIS },
  { id: "chat-2", title: "2 · 行程规划", note: "天气卡片、三天的 Tabs（可以点）、时间线、地图卡片、提醒、来源。", user: { text: "下周去京都玩 3 天，帮我排一下行程" }, answer: CHAT_TRIP },
  { id: "chat-3", title: "3 · 多模态（图片 + 文件 + 语音）", note: "用户发来图片、PDF 和一段语音；回答里有 Markdown 表格、环形图、生成的文件和正在流式输出的文字。", user: { spec: CHAT_MULTI_USER }, answer: CHAT_MULTI },
];

const NAV: [string, string][] = [["preview", "实时预览"], ["layout", "布局与浮层"], ["display", "数据展示"], ["forms", "表单与操作"], ["chat", "聊天目录"], ["expr", "表达式"], ["ext", "多模态扩展"], ["screens", "聊天整屏"]];

export default function JsonRender(): Markup {
  const html = `<style>${GLASS_CSS}${inline("client/jr.css")}${CSS}</style>
<main class="pg font-sans">
<h1>Liquid Glass 标准参数 · json-render</h1>
<p class="pg-sub">vercel-labs/json-render 的全部官方组件（shadcn 目录 36 个 + 聊天目录新增 10 个）、扩展的 15 个多模态组件、3 个 AI 聊天整屏，加一个粘贴 JSON 的实时预览。props 名照抄官方，模型现有的输出不用改。玻璃只用在容器和浮层上；文字、表格、图表画在玻璃里面，是实色。参数是标准档（design/system/hyalite/presets.ts）。单文件，不依赖任何外部资源。</p>
<p id="hl-unsupported" hidden class="pg-warn">这个浏览器不支持 SVG backdrop filter，看不到折射，只剩模糊。iPhone / iPad 上所有浏览器都是 WebKit 内核，都属于这种情况；请用电脑或安卓手机上的 Chrome / Edge 打开。</p>
<nav class="pg-nav">${NAV.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}</nav>
${preview()}
${SECTIONS.map(section).join("")}
<section class="pg-sec" id="screens"><h2>AI 聊天整屏示例</h2><p class="pg-desc">393 pt 宽的对话界面：顶部导航和底部输入栏是玻璃，回答由左边那种 spec 渲染。窄屏上会自动缩放到屏幕宽度。</p>${SCREENS.map(screen).join("")}</section>
</main>
<script>window.HL_STANDARD=${JSON.stringify(STANDARD.ios)}</script>
<script>\n${inline("vendor/hyalite.js")}\n</script>
<script>\n${inline("client/jr-render.js")}\n</script>
<script>\n${inline("client/json-render.js")}\n</script>`;
  return new Markup(inlinePhotos(html));
}
