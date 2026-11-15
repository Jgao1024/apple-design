import { type Child, Markup, raw } from "@design/jsx/jsx-runtime";
import { GLASS_CSS } from "../components/glass.tsx";

// Cover shot for an index card: 1200 x 675, two wallpaper tiles (light / dark) with a cluster of the
// page's own components on each. Built to design/.covers/*.html by system/build.ts and screenshotted
// to design/pages/assets/covers/*.jpg by design/covers.sh — the card then shows that picture.

const WALLPAPERS = new URL("../../../.ref/wallpapers/", import.meta.url);

function dataUrl(name: string): string {
  const bytes = Deno.readFileSync(new URL(name, WALLPAPERS));
  let text = "";
  for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return `url('data:image/jpeg;base64,${btoa(text)}')`;
}

const AERIAL = dataUrl("aerial.jpg");
const SONOMA = dataUrl("sonoma.jpg");

const CSS = `
*{box-sizing:border-box}
:root{--hl-aerial:${AERIAL};--hl-sonoma:${SONOMA}}
html,body{margin:0;width:1200px;height:675px;overflow:hidden}
.cv{position:relative;width:1200px;height:675px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif}
.cv-bg{position:absolute;inset:-60px;background-image:${AERIAL};background-size:cover;background-position:center;
  filter:blur(32px) saturate(135%) brightness(.8);transform:scale(1.1)}
.cv-scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgb(8 10 22 / 26%),rgb(8 10 22 / 58%))}
.cv-row{position:relative;display:flex;align-items:center;justify-content:center;gap:22px;height:100%}
.tile{position:relative;height:532px;border-radius:30px;overflow:hidden;
  box-shadow:0 34px 64px -26px rgb(0 0 0 / 70%),0 0 0 1px rgb(255 255 255 / 14%)}
.tile-photo{position:absolute;inset:0;background-size:cover;background-position:center;transform:scale(1.02)}
.tile-color{position:absolute;inset:0;background:
  radial-gradient(52% 52% at 16% 20%,#ff8a65 0 26%,transparent 58%),
  radial-gradient(46% 46% at 84% 16%,#7ee08a 0 24%,transparent 56%),
  radial-gradient(58% 58% at 72% 88%,#ffd60a 0 22%,transparent 54%),
  radial-gradient(50% 50% at 20% 84%,#9b8cff 0 26%,transparent 58%),
  linear-gradient(158deg,#b9c6ff,#f3c6ff 52%,#ffd9c2)}
.tile-in{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;height:100%;padding:24px}
.tile-tag{position:absolute;left:20px;bottom:15px;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgb(255 255 255 / 70%)}
.jr{margin:0;padding:16px 18px;border-radius:16px;background:rgb(18 18 22 / 50%);border:1px solid rgb(255 255 255 / 14%);
  backdrop-filter:blur(18px);font:11.5px/1.62 "SF Mono",ui-monospace,Menlo,monospace;color:rgb(255 255 255 / 86%);white-space:pre-wrap}
`;

export type TileSpec = {
  mode: "light" | "dark";
  width: number;
  /// "photo" is the wallpaper tile the pages use; "color" is the parameter lab's flat colour backdrop.
  bg?: "photo" | "color";
  children: Child;
};

export function Cover(props: { tiles: [TileSpec, TileSpec] }): Markup {
  const tile = (spec: TileSpec): string => {
    const backdrop = spec.bg === "color"
      ? `<div class="tile-color"></div>`
      : `<div class="tile-photo" style="background-image:${spec.mode === "light" ? AERIAL : SONOMA}"></div>`;
    const inner = spec.children.html
      .replaceAll("url(&quot;../../../.ref/wallpapers/aerial.jpg&quot;)", "var(--hl-aerial)")
      .replaceAll("url(&quot;../../../.ref/wallpapers/sonoma.jpg&quot;)", "var(--hl-sonoma)");
    return `<div class="tile" style="width:${spec.width}px">${backdrop}<div class="tile-in">${inner}</div>
<span class="tile-tag">${spec.mode === "light" ? "浅色" : "深色"}</span></div>`;
  };
  const body = `<div class="cv"><div class="cv-bg"></div><div class="cv-scrim"></div>
<div class="cv-row">${tile(props.tiles[0])}${tile(props.tiles[1])}</div></div>`;
  return raw(`<style>${GLASS_CSS}${CSS}</style>${body}`);
}

/// A ready-made JSON block for the json-render cover.
export function JsonSample(): Markup {
  const text = `{
  "type": "card",
  "glass": "standard",
  "children": [
    { "type": "heading", "text": "Liquid Glass" },
    { "type": "text", "text": "实时折射" },
    { "type": "button", "label": "继续", "prominent": true }
  ]
}`;
  return raw(`<pre class="jr">${text}</pre>`);
}
