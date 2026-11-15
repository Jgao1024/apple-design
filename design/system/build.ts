// Renders every page in system/<kit>/pages/**.tsx to design/pages/<kit>/**/*.html and writes
// a card gallery at design/pages/index.html. Run with `./build.sh [kit...]`.
// With no argument every kit listed in KITS is built.
//
// This copy of the repo only carries the hyalite kit (iOS 27 / macOS 27 / doubao pages stayed in
// the source repo). Add a kit back here only together with its system/<kit>/ folder.

import type { Markup } from "./jsx/jsx-runtime.ts";
import { COLOR, FONT_MONO, FONT_SANS } from "./theme.ts";
import { compile } from "tailwindcss";

const KITS = ["hyalite"];
// Kits whose pages run JavaScript in the browser (live parameter labs). Every other kit stays zero-JS.
const SCRIPTED_KITS = new Set(["hyalite"]);
const systemDirectory = new URL("./", import.meta.url);
const distDirectory = new URL("../pages/", import.meta.url);

await Deno.mkdir(distDirectory, { recursive: true });

const requested = Deno.args.length > 0 ? Deno.args : KITS;
for (const kit of requested) {
  if (!KITS.includes(kit)) throw new Error(`unknown kit "${kit}", expected one of: ${KITS.join(", ")}`);
}

const theme = await Deno.readTextFile(new URL(import.meta.resolve("tailwindcss/theme.css")));
const preflight = await Deno.readTextFile(new URL(import.meta.resolve("tailwindcss/preflight.css")));
const styles = await Deno.readTextFile(new URL("./styles.css", import.meta.url));

function toVariables(colors: Record<string, string>): string {
  return Object.entries(colors).map(([name, value]) => {
    const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    return `--color-${cssName}:${value};`;
  }).join("\n");
}

async function stylesheetFor(kit: string): Promise<string> {
  const kitTheme = await import(new URL(`./${kit}/theme.ts`, systemDirectory).href);
  return `
@layer theme, base, components, utilities;
@layer theme { ${theme} }
@layer base { ${preflight} }
@theme { ${toVariables({ ...COLOR, ...kitTheme.COLOR })} --font-sans:${FONT_SANS}; --font-mono:${FONT_MONO}; }
${styles}
@tailwind utilities;
`;
}

async function* pageFiles(directory: URL, prefix = ""): AsyncGenerator<string> {
  const entries = [...Deno.readDirSync(directory)].sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.isDirectory) {
      yield* pageFiles(new URL(`${entry.name}/`, directory), `${prefix}${entry.name}/`);
    } else if (entry.isFile && entry.name.endsWith(".tsx")) {
      yield `${prefix}${entry.name.replace(/\.tsx$/, "")}`;
    }
  }
}

function unescapeAttribute(text: string): string {
  return text.replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
}

for (const kit of requested) {
  const pagesDirectory = new URL(`./${kit}/pages/`, systemDirectory);
  const stylesheet = await stylesheetFor(kit);
  for await (const name of pageFiles(pagesDirectory)) {
    const module = await import(new URL(`${name}.tsx`, pagesDirectory).href);
    const page: () => Markup = module.default;
    const markup = page().html;
    const classes = [...markup.matchAll(/\bclass="([^"]*)"/g)].flatMap((match) =>
      unescapeAttribute(match[1]).split(/\s+/)
    );
    const compiler = await compile(stylesheet);
    const css = compiler.build(classes);
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${kit}/${name}</title>
<style>${css}</style>
<style>body{margin:0;background:${COLOR.paper}}svg{display:block}</style>
</head>
<body>
${markup}
</body>
</html>
`;
    // The output is static markup; JSX only runs here, at build time.
    if (!SCRIPTED_KITS.has(kit) && /<script\b|\son[a-z]+=/i.test(html)) {
      throw new Error(`${kit}/${name}: the built HTML must not contain JavaScript`);
    }
    const target = new URL(`./${kit}/${name}.html`, distDirectory);
    await Deno.mkdir(new URL("./", target), { recursive: true });
    await Deno.writeTextFile(target, html);
    console.log(`pages/${kit}/${name}.html`);
  }
}

// One card per built page. Titles and blurbs live here so the index reads like a gallery rather than
// a file listing; a page with no entry still shows up, under "其他".
type Card = { title: string; description: string; tags: string[]; group: string };

const GROUPS = ["标准页", "实验台", "组件补充", "JSON 渲染"] as const;
const GROUP_TINT: Record<string, string> = {
  "标准页": "linear-gradient(90deg,#0a84ff,#64d2ff)",
  "实验台": "linear-gradient(90deg,#bf5af2,#e07cf0)",
  "组件补充": "linear-gradient(90deg,#30d158,#7ee08a)",
  "JSON 渲染": "linear-gradient(90deg,#ff9f0a,#ffd60a)",
  "其他": "linear-gradient(90deg,#8e8e93,#c7c7cc)",
};

const CARD_META: Record<string, Card> = {
  "standard/ios-macos": {
    group: "标准页",
    title: "标准页 · iOS + macOS",
    description: "两平台全部组件，标准玻璃参数，没有调节面板。引擎和两张壁纸都内联在一个文件里，可以直接发到手机。",
    tags: ["iOS 27", "macOS 27", "无面板"],
  },
  "standard/macos": {
    group: "标准页",
    title: "标准页 · macOS",
    description: "同上，只收 macOS 组件：窗口与浮动侧边栏、工具栏、按钮、分段、弹窗。",
    tags: ["macOS 27", "无面板"],
  },
  "lab/ios": {
    group: "实验台",
    title: "iOS 实验台",
    description: "16 个玻璃滑杆实时调参，5 个预设，9 种底图，还有帧率测试。定好档位后可以一键复制成标准参数。",
    tags: ["iOS 27", "参数面板", "预设", "帧率"],
  },
  "lab/macos": {
    group: "实验台",
    title: "macOS 实验台",
    description: "和 iOS 实验台同一套面板，换掉的是 macOS 组件和它们的底图。",
    tags: ["macOS 27", "参数面板"],
  },
  "showcase/ios": {
    group: "组件补充",
    title: "iOS 组件补充",
    description: "标准页之外的第二批 iOS 27 组件，用标准玻璃画，尺寸仍按 Figma 的规格。",
    tags: ["iOS 27", "标准玻璃"],
  },
  "showcase/macos": {
    group: "组件补充",
    title: "macOS 组件补充",
    description: "标准页之外的第二批 macOS 27 组件，同样用标准玻璃。",
    tags: ["macOS 27", "标准玻璃"],
  },
  "json-render/index": {
    group: "JSON 渲染",
    title: "json-render 玻璃版",
    description: "每个组件左边是它的 JSON、右边是渲染结果；另有三屏 AI 对话和粘贴 JSON 预览。",
    tags: ["iOS 27", "JSON", "AI 对话"],
  },
};

const cardFor = (name: string): Card =>
  CARD_META[name] ?? {
    group: "其他",
    title: name.split("/").pop() ?? name,
    description: "",
    tags: [],
  };

await writeIndexes();

/// Lists every built page as a card gallery. Scans the output on disk, so a page that was just added
/// shows up without touching this file.
async function writeIndexes(): Promise<void> {
  const cards: { href: string; card: Card }[] = [];
  for (const kit of KITS) {
    const found: string[] = [];
    try {
      for await (const name of htmlFiles(new URL(`./${kit}/`, distDirectory))) found.push(name);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) throw error;
    }
    for (const name of found) cards.push({ href: `${kit}/${name}.html`, card: cardFor(name) });
  }

  const rank = (card: Card) => {
    const index = (GROUPS as readonly string[]).indexOf(card.group);
    return index === -1 ? GROUPS.length : index;
  };
  const ordered = [...cards].sort((a, b) => rank(a.card) - rank(b.card) || a.card.title.localeCompare(b.card.title, "zh-Hans-CN"));

  const gallery = ordered.map(({ href, card }) => `      <a class="card" href="${href}" style="--tint:${GROUP_TINT[card.group] ?? GROUP_TINT["其他"]}">
        <div class="body">
          <span class="kind">${card.group}</span>
          <h3>${card.title}</h3>
          <p>${card.description}</p>
        </div>
        <div class="foot">
          <div class="tags">${card.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
          <span class="open">打开 →</span>
        </div>
      </a>`).join("\n");

  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Apple 界面原型 · Liquid Glass</title>
<style>
:root{--ink:${COLOR.ink};--dim:${COLOR.dim};--rule:#e5e5ea;--paper:#fbfbfd}
*{box-sizing:border-box}
body{margin:0;padding:72px 24px 96px;font:15px/1.5 ${FONT_SANS};color:var(--ink);min-height:100vh;
  background:radial-gradient(1100px 560px at 8% -12%,#e9f1ff 0%,transparent 62%),
             radial-gradient(900px 520px at 94% -6%,#f7ecff 0%,transparent 58%),var(--paper)}
.wrap{max-width:1060px;margin:0 auto}
.eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 13px;border:1px solid var(--rule);border-radius:999px;background:#fff;
  font-size:11.5px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--dim)}
.dot{width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,#0a84ff,#64d2ff)}
h1{margin:22px 0 12px;font-size:clamp(30px,4.6vw,46px);line-height:1.06;letter-spacing:-.025em;font-weight:700}
.lead{margin:0;max-width:640px;font-size:16px;line-height:1.6;color:var(--dim)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:16px;margin-top:44px;align-items:stretch}
.card{position:relative;display:flex;flex-direction:column;gap:14px;overflow:hidden;padding:22px 20px 18px;
  color:inherit;text-decoration:none;background:#fff;border:1px solid var(--rule);border-radius:18px;
  box-shadow:0 1px 2px rgb(0 0 0 / 4%),0 10px 30px -22px rgb(0 0 0 / 40%);
  transition:transform .22s cubic-bezier(.22,.68,0,1),box-shadow .22s,border-color .22s}
.card::before{content:"";position:absolute;inset:0 0 auto;height:4px;background:var(--tint);opacity:.85}
.card:hover{transform:translateY(-3px);border-color:#d6d6db;box-shadow:0 2px 4px rgb(0 0 0 / 5%),0 20px 42px -22px rgb(0 0 0 / 34%)}
.body{flex:1}
.kind{display:block;margin-bottom:8px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#a1a1a6}
.card h3{margin:0 0 6px;font-size:17px;font-weight:600;letter-spacing:-.01em}
.card p{margin:0;font-size:13.5px;line-height:1.55;color:var(--dim)}
.foot{display:flex;align-items:center;justify-content:space-between;gap:10px}
.tags{display:flex;flex-wrap:wrap;gap:6px}
.tags span{padding:3px 9px;border-radius:999px;background:#f2f2f7;font-size:11.5px;font-weight:500;color:#48484a}
.open{flex:none;font-size:12px;color:#b0b0b5;transition:color .2s,transform .2s}
.card:hover .open{color:var(--ink);transform:translateX(2px)}
footer{display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;margin-top:58px;padding-top:20px;
  border-top:1px solid var(--rule);font-size:12.5px;color:#a1a1a6}
@media (max-width:640px){
  body{padding:44px 18px 64px}
  h1{font-size:32px}
  .grid{grid-template-columns:1fr;gap:12px;margin-top:32px}
  .card{padding:18px 16px 16px}
  footer{margin-top:40px}
}
@media (prefers-reduced-motion:reduce){.card,.card:hover{transition:none;transform:none}}
</style>
</head>
<body>
<div class="wrap">
  <span class="eyebrow"><span class="dot"></span>Liquid Glass · 网页原型</span>
  <h1>Apple 界面原型</h1>
  <p class="lead">用 TSX 画 iOS 27 / macOS 27 的界面，构建成自包含的单文件 HTML。玻璃是 hyalite 引擎的实时折射，参数取自 Figma 的实测值。</p>
  <div class="grid">
${gallery}
  </div>
  <footer><span>${cards.length} 个页面 · 全部单文件，CSS / JS / 壁纸内联</span><span>构建：./design/build.sh</span></footer>
</div>
</body>
</html>
`;
  await Deno.writeTextFile(new URL("./index.html", distDirectory), html);
}

async function* htmlFiles(directory: URL, prefix = ""): AsyncGenerator<string> {
  const entries = [...Deno.readDirSync(directory)].sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.isDirectory) yield* htmlFiles(new URL(`${entry.name}/`, directory), `${prefix}${entry.name}/`);
    else if (entry.isFile && entry.name.endsWith(".html") && (entry.name !== "index.html" || prefix !== "")) {
      yield `${prefix}${entry.name.replace(/\.html$/, "")}`;
    }
  }
}
