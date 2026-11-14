import { type Child, type Markup, raw } from "@design/jsx/jsx-runtime";
import type { Mode } from "../../doubao/theme.ts";
import { Icon, type IconName } from "../../macos27/components/icons.tsx";
import { TrafficLights } from "../../macos27/components/traffic-lights.tsx";
import { Glass } from "./glass.tsx";
import { PushButton, SwitchTrack, ToolbarButton, ToolbarSearch, ToolbarSegmented } from "./macos.tsx";

// The rest of the macOS 27 components (pages/08-macos-more), drawn with the standard glass. Geometry is
// the macos27 kit's, from the Figma specs as recorded in design/system/macos27/components/*.tsx:
//   menu bar 45 high, parts 24 high from 10 px, 13 pt; selected part a pill 8 px wider
//   Dock 55 high radius 15, icons 36 with 9 px gaps, 8 px in; running dot 4 px #707070 3 px below
//   toolbar parts are glass capsules 36 high (XL); window radius 16, shadow 0 18 54
//   menu 244 wide radius 12, 24 pt items, 5 px top / bottom padding, key row #0069F9, separator 11
//   notification 344 x 77 radius 20, app icon 32; tooltip 11 pt on #ECECEC 88 %, 6 / 3 padding
//   sheet radius 16, white / #1E1E1E; utility panel 300 x 300 radius 15, header 65, tabs 44 x 30
//   table rows 20, header 28, selection #0165E2 inset 10 radius 8, zebra black 5 %
//   stepper 20 x 24 radius 6; linear progress 6 / 10 high; circular 16 / 32, ring 5; spinner 8 ticks
// Glass is on bars, menus, panels, popovers and HUDs; window content, tables and fields are flat.

const ACCENT = "#0088ff";
const KEY = "#0069f9";
export const ink = (m: Mode) => (m === "light" ? "#1a1a1a" : "#f5f5f5");
export const dim = (m: Mode) => (m === "light" ? "rgb(0 0 0 / 0.5)" : "rgb(255 255 255 / 0.55)");
const fill = (m: Mode, a: number) => (m === "light" ? `rgb(0 0 0 / ${a})` : `rgb(255 255 255 / ${a})`);
const paper = (m: Mode) => (m === "light" ? "#ffffff" : "#1e1e1e");
const TEXT = "font-size:13px;line-height:16px;font-weight:500";
const SMALL = "font-size:11px;line-height:14px";

// Glyphs the macos27 kit does not have, on its 16 unit grid.
const EXTRA = {
  "battery": '<rect x="1.5" y="4.5" width="11.5" height="7" rx="2"/><rect x="3" y="6" width="7" height="4" rx="1" fill="currentColor" stroke="none"/><path d="M14.5 7v2"/>',
  "controlcenter": '<rect x="1.8" y="3" width="12.4" height="4.2" rx="2.1"/><circle cx="11" cy="5.1" r="1" fill="currentColor"/><rect x="1.8" y="8.8" width="12.4" height="4.2" rx="2.1"/><circle cx="5" cy="10.9" r="1" fill="currentColor"/>',
  "speaker": '<path d="M2.5 6h2.5l3-2.5v9L5 10H2.5zM10.5 5.5a3.5 3.5 0 010 5M12.3 3.8a6 6 0 010 8.4"/>',
  "sun": '<circle cx="8" cy="8" r="2.6"/><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1"/>',
  "moon": '<path d="M13 9.5A5.5 5.5 0 016.5 3a5.5 5.5 0 106.5 6.5z"/>',
  "bluetooth": '<path d="M4.5 5l6.5 6-3 2.5v-11l3 2.5L4.5 11"/>',
  "airdrop": '<circle cx="8" cy="8" r="1.4"/><path d="M5 11a4.2 4.2 0 116 0M3 13a7 7 0 1110 0"/>',
  "display": '<rect x="1.8" y="2.5" width="12.4" height="8.5" rx="1.5"/><path d="M6 14h4M8 11v3"/>',
  "keyboard": '<rect x="1.5" y="4" width="13" height="8" rx="1.5"/><path d="M4 6.5h.01M6.5 6.5h.01M9 6.5h.01M11.5 6.5h.01M5 9.5h6"/>',
  "back": '<path d="M10 3L5 8l5 5"/>',
  "forward": '<path d="M6 3l5 5-5 5"/>',
  "list": '<path d="M5.5 4.5h8M5.5 8h8M5.5 11.5h8M2.5 4.5h.01M2.5 8h.01M2.5 11.5h.01"/>',
  "grid": '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>',
  "columns": '<rect x="1.8" y="3" width="12.4" height="10" rx="2"/><path d="M6 3v10M10 3v10"/>',
  "calendar": '<rect x="2" y="3" width="12" height="11" rx="2"/><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3"/>',
  "bold": '<path d="M4.5 2.5h4a2.6 2.6 0 010 5.2h-4zM4.5 7.7h4.7a2.9 2.9 0 010 5.8H4.5z"/>',
  "italic": '<path d="M7 2.5h5M4 13.5h5M9.5 2.5l-3 11"/>',
  "underline": '<path d="M4.5 2.5V7a3.5 3.5 0 007 0V2.5M3.5 14h9"/>',
  "align.left": '<path d="M2.5 3.5h11M2.5 6.5h7M2.5 9.5h11M2.5 12.5h7"/>',
  "align.center": '<path d="M2.5 3.5h11M4.5 6.5h7M2.5 9.5h11M4.5 12.5h7"/>',
  "align.right": '<path d="M2.5 3.5h11M6.5 6.5h7M2.5 9.5h11M6.5 12.5h7"/>',
  "app": '<rect x="2" y="2" width="12" height="12" rx="3"/>',
  "doc.text": '<path d="M4 2h5l3 3v8.5a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-11A.5.5 0 014 2z"/><path d="M9 2v3h3M6 8h4M6 10.5h4"/>',
  "globe": '<circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2.2 2.2 2.2 9.8 0 12M8 2c-2.2 2.2-2.2 9.8 0 12"/>',
  "download": '<path d="M8 2.5v8M4.5 7.5L8 11l3.5-3.5M3 13.5h10"/>',
  "pause": '<path d="M5.5 3.5v9M10.5 3.5v9"/>',
  "fastforward": '<path d="M2 4l5.5 4L2 12zM8 4l5.5 4L8 12z" fill="currentColor"/>',
  "rewind": '<path d="M14 4L8.5 8 14 12zM8 4L2.5 8 8 12z" fill="currentColor"/>',
  "focus": '<circle cx="8" cy="8" r="5.5"/><circle cx="8" cy="8" r="2" fill="currentColor"/>',
  "mirror": '<rect x="1.5" y="3" width="9" height="7" rx="1.2"/><rect x="6" y="6.5" width="8.5" height="6.5" rx="1.2"/>',
  "arrow.clockwise": '<path d="M13 8a5 5 0 11-1.5-3.6M13 2.5v3h-3"/>',
  "lock": '<rect x="3.5" y="7" width="9" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2"/>',
} as const;

export type Glyph = IconName | keyof typeof EXTRA;

export function G(props: { name: Glyph; size?: number; weight?: number }): Markup {
  if (!(props.name in EXTRA)) return <Icon name={props.name as IconName} size={props.size} weight={props.weight} />;
  const size = props.size ?? 16;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width={props.weight ?? 1.4} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      {raw(EXTRA[props.name as keyof typeof EXTRA])}
    </svg>
  );
}


/// A stand-in app icon: a rounded square in a hue, with a glyph.
function AppIcon(props: { size: number; hue: number; glyph?: Glyph }): Markup {
  const s = props.size;
  return (
    <div
      class="grid shrink-0 place-items-center text-white"
      style={`width:${s}px;height:${s}px;border-radius:${s * 0.225}px;background:linear-gradient(180deg,hsl(${props.hue} 80% 62%),hsl(${props.hue} 75% 44%));box-shadow:0 1px 2px rgb(0 0 0 / .25)`}
    >
      {props.glyph && <G name={props.glyph} size={Math.round(s * 0.55)} weight={1.6} />}
    </div>
  );
}

function windowShadow(m: Mode): string {
  return m === "light" ? "0 18px 54px rgb(0 0 0 / 0.3),0 0 0 0.5px rgb(0 0 0 / 0.2)" : "0 18px 54px rgb(0 0 0 / 0.6),0 0 0 0.5px rgb(255 255 255 / 0.2)";
}

/// A glass capsule of any width, 36 high, as on a toolbar.
function Capsule(props: { mode: Mode; width: number; height?: number; children: Child; class?: string }): Markup {
  const h = props.height ?? 36;
  return (
    <Glass mode={props.mode} width={props.width} height={h} radius={h / 2} class={props.class ?? "flex items-center justify-center gap-1"} style={`color:${ink(props.mode)};${TEXT}`}>
      {props.children}
    </Glass>
  );
}

function IconGroup(props: { mode: Mode; icons: Glyph[]; selected?: number }): Markup {
  const m = props.mode;
  return (
    <Capsule mode={m} width={props.icons.length * 36 + 4} class="flex items-center px-[2px]">
      {props.icons.map((icon, i) => (
        <div class="grid h-8 w-9 place-items-center rounded-full" style={i === props.selected ? `background:${fill(m, 0.08)}` : ""}><G name={icon} size={15} /></div>
      ))}
    </Capsule>
  );
}

// ---------------------------------------------------------------- 系统

type MenuRow = { text: string; key?: string; more?: boolean; hover?: boolean; check?: boolean; icon?: Glyph; off?: boolean } | "separator" | { header: string };

function rowsHeight(rows: MenuRow[]): number {
  return 10 + rows.reduce((h, r) => h + (r === "separator" ? 11 : "header" in r ? 25 : 24), 0);
}

export function MenuPanel(props: { mode: Mode; rows: MenuRow[]; width?: number }): Markup {
  const m = props.mode;
  const checks = props.rows.some((r) => r !== "separator" && !("header" in r) && r.check !== undefined);
  return (
    <Glass mode={m} width={props.width ?? 244} height={rowsHeight(props.rows)} radius={12} class="flex flex-col px-[5px] py-[5px]" style={`color:${ink(m)};${TEXT}`}>
      {props.rows.map((row) => {
        if (row === "separator") return <div class="mx-[7px] my-[5px] h-px" style={`background:${fill(m, 0.1)}`} />;
        if ("header" in row) return <div class="flex h-[25px] items-center px-[7px]" style={`font-weight:700;color:${dim(m)}`}>{row.header}</div>;
        return (
          <div class="flex h-6 items-center gap-[6px] rounded-[8px] px-[7px]" style={row.hover ? `background:${KEY};color:#fff` : row.off ? `color:${m === "light" ? "#bfbfbf" : "#5a5a5a"}` : ""}>
            {checks && <span class="w-3">{row.check && <Icon name="check" size={11} weight={2.2} />}</span>}
            {row.icon && <G name={row.icon} size={14} />}
            <span class="flex-1">{row.text}</span>
            {row.key && <span style={row.hover ? "" : `color:${dim(m)}`}>{row.key}</span>}
            {row.more && <Icon name="chevron.right" size={11} weight={1.8} />}
          </div>
        );
      })}
    </Glass>
  );
}

export function MenuBar(props: { mode: Mode }): Markup {
  const m = props.mode;
  const c = m === "light" ? "rgb(0 0 0 / 0.85)" : "#ffffff";
  const part = (child: Child, opts: { bold?: number; pad?: number } = {}) => (
    <div class="flex h-6 items-center whitespace-nowrap" style={`padding:0 ${opts.pad ?? 8}px;font-weight:${opts.bold ?? 590}`}>{child}</div>
  );
  return (
    <div class="relative h-full w-full">
      {m === "dark" && <div class="absolute inset-x-0 top-0 h-[60px]" style="background:linear-gradient(rgb(0 0 0 / .3),transparent)" />}
      <div class="absolute inset-x-[10px] top-[10px] flex h-6 items-center justify-between" style={`color:${c};font-size:13px;line-height:16px`}>
        <div class="flex items-center">
          {part(<G name="apple" size={15} />, { pad: 10 })}
          {part("访达", { bold: 800 })}
          {part("文件")}{part("编辑")}{part("显示")}
        </div>
        <div class="flex items-center">
          {part(<G name="battery" size={17} />, { pad: 6 })}
          <Glass mode={m} width={31} height={25} radius={12.5} class="grid place-items-center"><G name="wifi" size={15} /></Glass>
          {part(<G name="magnifyingglass" size={14} />, { pad: 6 })}
          {part(<G name="controlcenter" size={15} />, { pad: 6 })}
          {part("周六 9:41", { pad: 8 })}
        </div>
      </div>
      <div class="absolute right-[70px] top-[42px]">
        <MenuPanel
          mode={m}
          width={260}
          rows={[
            { header: "Wi-Fi" },
            { text: "Home-5G", icon: "wifi", check: true },
            { text: "Office", icon: "wifi", check: false },
            { text: "iPhone 热点", icon: "airdrop", check: false },
            "separator",
            { text: "其他网络", more: true, hover: true },
            "separator",
            { text: "Wi-Fi 设置…" },
          ]}
        />
      </div>
    </div>
  );
}

const DOCK: [number, Glyph, boolean][] = [
  [210, "house", true], [200, "globe", true], [130, "photo", false], [0, "calendar", false], [35, "doc.text", true],
  [280, "paintbrush", false], [160, "gear", true],
];

export function DockBar(props: { mode: Mode }): Markup {
  const m = props.mode;
  // The pointer is over the fifth icon: it and its neighbours are magnified.
  const sizes = [36, 36, 42, 52, 64, 52, 42];
  const width = 8 * 2 + sizes.reduce((a, b) => a + b, 0) + 9 * (sizes.length - 1) + 9 + 1 + 9 + 36;
  const center = 8 + sizes.slice(0, 4).reduce((a, b) => a + b, 0) + 4 * 9 + sizes[4] / 2;
  return (
    <div class="relative mt-10 flex flex-col items-center">
      <div class="relative" style={`width:${width}px;height:55px`}>
        <div class="absolute inset-0"><Glass mode={m} width={width} height={55} radius={15} /></div>
        <div class="absolute whitespace-nowrap rounded-[6px] px-[8px] py-[3px]" style={`left:${center}px;bottom:82px;transform:translateX(-50%);background:${m === "light" ? "rgb(236 236 236 / 0.88)" : "rgb(50 50 50 / 0.9)"};color:${ink(m)};${SMALL};font-weight:500;box-shadow:0 2px 6px rgb(0 0 0 / .15)`}>备忘录</div>
        <div class="absolute bottom-[11px] left-[8px] flex items-end gap-[9px]">
          {DOCK.map(([hue, glyph, dot], i) => (
            <div class="relative flex flex-col items-center">
              <AppIcon size={sizes[i]} hue={hue} glyph={glyph} />
              {dot && <div class="absolute -bottom-[7px] size-1 rounded-full" style={`background:${m === "light" ? "#707070" : "#a0a0a0"}`} />}
            </div>
          ))}
          <div class="mx-0 h-9 w-px self-center" style={`background:${fill(m, 0.2)}`} />
          <div class="grid size-9 place-items-center rounded-[8px]" style={`background:${fill(m, 0.1)};color:${dim(m)}`}><G name="trash" size={20} /></div>
        </div>
      </div>
    </div>
  );
}

export function ControlCenterPanel(props: { mode: Mode }): Markup {
  const m = props.mode;
  const mod = (h: number, children: Child, cls = "") => <div class={`rounded-[18px] ${cls}`} style={`height:${h}px;background:${fill(m, m === "light" ? 0.05 : 0.08)}`}>{children}</div>;
  const toggle = (g: Glyph, t: string, sub: string, on: boolean) => (
    <div class="flex items-center gap-[10px]">
      <div class="grid size-[30px] place-items-center rounded-full" style={`background:${on ? ACCENT : fill(m, 0.1)};color:${on ? "#fff" : ink(m)}`}><G name={g} size={15} /></div>
      <div style={TEXT}>{t}<div style={`${SMALL};color:${dim(m)}`}>{sub}</div></div>
    </div>
  );
  const slider = (t: string, g: Glyph, pct: number) => mod(64, (
    <div class="flex flex-col justify-center gap-2 px-3 pt-[10px]">
      <span style={`${TEXT};font-weight:600`}>{t}</span>
      <div class="relative h-[22px] rounded-full" style={`background:${fill(m, 0.1)}`}>
        <div class="h-full rounded-full" style={`width:${pct}%;background:${m === "light" ? "#fff" : "rgb(255 255 255 / .85)"}`} />
        <span class="absolute left-[6px] top-[3px]" style="color:#8e8e93"><G name={g} size={16} /></span>
      </div>
    </div>
  ));
  return (
    <Glass mode={m} width={320} height={358} radius={24} class="flex flex-col gap-[10px] p-[10px]" style={`color:${ink(m)}`}>
      <div class="grid grid-cols-2 gap-[10px]">
        {mod(146, <div class="flex h-full flex-col justify-center gap-[12px] px-3">{toggle("wifi", "Wi-Fi", "Home-5G", true)}{toggle("bluetooth", "蓝牙", "开", true)}{toggle("airdrop", "隔空投送", "仅限联系人", false)}</div>)}
        <div class="flex flex-col gap-[10px]">
          {mod(68, <div class="flex h-full items-center px-3">{toggle("moon", "专注", "关", false)}</div>)}
          {mod(68, <div class="flex h-full items-center px-3">{toggle("mirror", "屏幕镜像", "", false)}</div>)}
        </div>
      </div>
      {slider("显示器", "sun", 70)}
      {slider("声音", "speaker", 45)}
      {mod(52, (
        <div class="flex h-full items-center gap-[10px] px-[10px]">
          <div class="size-8 rounded-[6px]" style="background:linear-gradient(160deg,#c86aff,#3a7bd5)" />
          <div class="flex-1" style={TEXT}>Golden Hour<div style={`${SMALL};color:${dim(m)}`}>JVKE</div></div>
          <G name="pause" size={16} weight={2.2} /><G name="fastforward" size={16} />
        </div>
      ))}
    </Glass>
  );
}

function Banner(props: { mode: Mode; title: string; message: string; time: string; hue: number; glyph: Glyph; width?: number }): Markup {
  const m = props.mode;
  return (
    <Glass mode={m} width={props.width ?? 344} height={77} radius={20} class="flex gap-2 pl-[14px] pr-[12px] pt-[14px]" style={`color:${ink(m)}`}>
      <AppIcon size={32} hue={props.hue} glyph={props.glyph} />
      <div class="min-w-0 flex-1">
        <div class="flex justify-between" style={`${TEXT};font-weight:700`}>{props.title}<span style={`${SMALL};font-weight:400;color:${dim(m)}`}>{props.time}</span></div>
        <div class="mt-[2px]" style={`${TEXT};font-weight:400;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden`}>{props.message}</div>
      </div>
    </Glass>
  );
}

export function Notifications(props: { mode: Mode }): Markup {
  const m = props.mode;
  return (
    <div class="flex w-[460px] items-start justify-between">
      <div class="flex flex-col gap-3">
        <span style={`${SMALL};color:#fff;font-weight:600;text-shadow:0 1px 3px rgb(0 0 0 / .5)`}>横幅</span>
        <Banner mode={m} width={210} title="信息" message="小林：周六上午十点码头见，别忘了带防晒" time="现在" hue={130} glyph="person" />
        <div class="relative">
          <div class="absolute inset-x-[16px] -bottom-[8px] opacity-80"><Glass mode={m} width={178} height={60} radius={18} /></div>
          <Banner mode={m} width={210} title="日历" message="团队周会 15:00 开始，地点在 3 号会议室" time="10 分钟" hue={0} glyph="calendar" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <span style={`${SMALL};color:#fff;font-weight:600;text-shadow:0 1px 3px rgb(0 0 0 / .5)`}>通知中心</span>
        <Glass mode={m} width={230} height={120} radius={20} class="flex flex-col p-3" style={`color:${ink(m)}`}>
          <div style={`${SMALL};font-weight:700;color:#ff3b30`}>星期六</div>
          <div style="font-size:26px;line-height:30px">14</div>
          {[["团队周会", "15:00", "#0a84ff"], ["健身", "18:30", "#34c759"]].map(([t, h, col]) => (
            <div class="mt-1 flex items-center gap-[6px]" style={TEXT}><div class="h-[14px] w-[3px] rounded-full" style={`background:${col}`} />{t}<span class="ml-auto" style={`color:${dim(m)}`}>{h}</span></div>
          ))}
        </Glass>
        <Banner mode={m} width={230} title="邮件" message="Apple：你的订单已发货，预计周二送达" time="9:12" hue={210} glyph="doc.text" />
        <Banner mode={m} width={230} title="提醒事项" message="下午 5 点前提交报销单" time="8:00" hue={30} glyph="check" />
      </div>
    </div>
  );
}

export function Spotlight(props: { mode: Mode }): Markup {
  const m = props.mode;
  const rows: [number, Glyph, string, string, boolean][] = [
    [210, "house", "访达", "应用程序", true],
    [35, "doc.text", "季度报告.pages", "文稿 · 昨天", false],
    [130, "photo", "金门大桥日落.heic", "照片 · 上周末", false],
    [200, "globe", "在网页中搜索“季度”", "Safari", false],
  ];
  return (
    <div class="flex flex-col gap-[10px]">
      <div class="flex items-center gap-2">
        <Glass mode={m} width={320} height={52} radius={26} class="flex items-center gap-3 px-[18px]" style={`color:${ink(m)}`}>
          <span style={`color:${dim(m)}`}><G name="magnifyingglass" size={20} weight={1.6} /></span>
          <span style="font-size:22px;line-height:26px">季度</span><span class="-ml-2 h-[24px] w-[2px]" style={`background:${ACCENT}`} />
        </Glass>
        {(["app", "doc", "switch.2"] as Glyph[]).map((g) => <ToolbarIcon mode={m} glyph={g} size={44} />)}
      </div>
      <Glass mode={m} width={320} height={200} radius={22} class="flex flex-col p-[8px]" style={`color:${ink(m)}`}>
        {rows.map(([hue, g, t, d, sel]) => (
          <div class="flex h-[46px] items-center gap-3 rounded-[12px] px-2" style={sel ? `background:${KEY};color:#fff` : ""}>
            <AppIcon size={30} hue={hue} glyph={g} />
            <div class="flex-1" style={TEXT}>{t}<div style={`${SMALL};color:${sel ? "rgb(255 255 255 / .75)" : dim(m)}`}>{d}</div></div>
            {sel && <span style={SMALL}>打开 ↩</span>}
          </div>
        ))}
      </Glass>
    </div>
  );
}

function ToolbarIcon(props: { mode: Mode; glyph: Glyph; size?: number }): Markup {
  const s = props.size ?? 52;
  return (
    <Glass mode={props.mode} width={s} height={s} radius={s / 2} class="grid place-items-center" style={`color:${ink(props.mode)}`}>
      <G name={props.glyph} size={Math.round(s * 0.36)} />
    </Glass>
  );
}

export function Huds(props: { mode: Mode }): Markup {
  const m = props.mode;
  const hud = (g: Glyph, t: string, pct: number) => (
    <Glass mode={m} width={290} height={64} radius={22} class="flex flex-col justify-center gap-2 px-4" style={`color:${ink(m)}`}>
      <div class="flex justify-between" style={`${TEXT};font-weight:600`}>{t}<span style={`font-weight:500;color:${dim(m)}`}>{pct}%</span></div>
      <div class="flex items-center gap-[10px]">
        <span style={`color:${dim(m)}`}><G name={g} size={15} /></span>
        <div class="h-[6px] flex-1 rounded-full" style={`background:${fill(m, 0.12)}`}><div class="h-full rounded-full" style={`width:${pct}%;background:${ink(m)}`} /></div>
      </div>
    </Glass>
  );
  return <div class="flex flex-col gap-3">{hud("speaker", "音量 · MacBook Pro 扬声器", 60)}{hud("sun", "亮度 · 内建显示器", 80)}{hud("keyboard", "键盘背光", 35)}</div>;
}

export function DesktopWidgets(props: { mode: Mode }): Markup {
  const m = props.mode;
  const c = ink(m), d = dim(m);
  const H = 170;
  return (
    <div class="flex flex-col gap-4">
      <div class="flex gap-4">
        <Glass mode={m} width={H} height={H} radius={22} class="grid place-items-center" style={`color:${c}`}>
          <svg width="138" height="138" viewBox="0 0 138 138">
            {Array.from({ length: 12 }, (_, i) => <text x={69 + 54 * Math.sin((i + 1) * Math.PI / 6)} y={74 + -54 * Math.cos((i + 1) * Math.PI / 6)} text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">{i + 1}</text>)}
            <path d="M69 69L69 34" stroke="currentColor" stroke-width="4" stroke-linecap="round" transform="rotate(290 69 69)" />
            <path d="M69 69L69 22" stroke="currentColor" stroke-width="3" stroke-linecap="round" transform="rotate(246 69 69)" />
            <path d="M69 78L69 20" stroke="#ff9f0a" stroke-width="1.5" stroke-linecap="round" transform="rotate(60 69 69)" />
            <circle cx="69" cy="69" r="3.5" fill="#ff9f0a" />
          </svg>
        </Glass>
        <Glass mode={m} width={H} height={H} radius={22} class="flex flex-col p-4" style={`color:${c}`}>
          <div style={`${TEXT};font-weight:600`}>旧金山</div>
          <div style="font-size:40px;line-height:44px;font-weight:300">18°</div>
          <div class="mt-auto" style="color:#ffcc00"><G name="sun" size={20} weight={1.8} /></div>
          <div style={`${SMALL};font-weight:600`}>晴</div>
          <div style={`${SMALL};color:${d}`}>最高 21° 最低 12°</div>
        </Glass>
      </div>
      <Glass mode={m} width={H * 2 + 16} height={H} radius={22} class="flex flex-col px-4 py-[14px]" style={`color:${c}`}>
        <div class="flex justify-between" style={`${TEXT};font-weight:700;color:#ff9f0a`}>提醒事项<span>4</span></div>
        {[["提交报销单", true], ["给妈妈回电话", false], ["预订周六晚餐", false], ["备份照片图库", false]].map(([t, done]) => (
          <div class="mt-[8px] flex items-center gap-2" style={TEXT}>
            <div class="size-[14px] rounded-full" style={done ? "background:#ff9f0a;box-shadow:inset 0 0 0 3px rgb(255 255 255 / .9)" : `box-shadow:inset 0 0 0 1.5px ${d}`} />
            <span style={done ? `color:${d};text-decoration:line-through` : ""}>{t}</span>
          </div>
        ))}
      </Glass>
    </div>
  );
}

// ---------------------------------------------------------------- 窗口

/// Thumbnails filling a window, the content that scrolls under the glass toolbar.
function Thumbs(props: { mode: Mode; cols: number; size: number; top: number; left: number }): Markup {
  const names = ["日落.heic", "海岸.heic", "大桥.heic", "森林.heic", "雾.heic", "山丘.heic", "城市.heic", "夜景.heic", "湖.heic", "雪山.heic", "麦田.heic", "港口.heic"];
  return (
    <div class="absolute grid gap-x-4 gap-y-3" style={`left:${props.left}px;top:${props.top}px;grid-template-columns:repeat(${props.cols},${props.size}px)`}>
      {names.map((n, i) => (
        <div class="flex flex-col items-center gap-1">
          <div class="rounded-[8px]" style={`width:${props.size}px;height:${props.size * 0.72}px;background:linear-gradient(160deg,hsl(${(i * 47) % 360} 75% 64%),hsl(${(i * 47 + 60) % 360} 60% 38%))`} />
          <span style={`${SMALL};color:${ink(props.mode)}`}>{n}</span>
        </div>
      ))}
    </div>
  );
}

function Win(props: { mode: Mode; width: number; height: number; children: Child; bg?: string }): Markup {
  return (
    <div class="relative overflow-hidden" style={`width:${props.width}px;height:${props.height}px;border-radius:16px;background:${props.bg ?? paper(props.mode)};box-shadow:${windowShadow(props.mode)}`}>
      {props.children}
    </div>
  );
}

function PopUp(props: { mode: Mode; label: string; width: number; icon?: Glyph }): Markup {
  return (
    <Capsule mode={props.mode} width={props.width} class="flex items-center justify-center gap-[5px]">
      {props.icon && <G name={props.icon} size={15} />}{props.label}<span style={`color:${dim(props.mode)}`}><Icon name="chevron.down" size={10} weight={1.8} /></span>
    </Capsule>
  );
}

export function FullToolbar(props: { mode: Mode }): Markup {
  const m = props.mode;
  return (
    <Win mode={m} width={680} height={250}>
      <Thumbs mode={m} cols={6} size={92} top={34} left={20} />
      <div class="absolute inset-x-0 top-0 h-[60px]" style={`background:linear-gradient(${paper(m)} 10%,transparent)`} />
      <div class="absolute left-[16px] top-[20px]"><TrafficLights mode={m} active /></div>
      <div class="absolute inset-x-[8px] top-[8px] flex items-center gap-[8px] pl-[78px]">
        <ToolbarButton mode={m} icon="sidebar.left" />
        <IconGroup mode={m} icons={["back", "forward"]} />
        <span class="ml-1 whitespace-nowrap" style={`${TEXT};font-weight:700;color:${ink(m)}`}>照片</span>
        <div class="flex-1" />
        <IconGroup mode={m} icons={["grid", "list", "columns"]} selected={0} />
        <PopUp mode={m} label="分组" width={74} />
        <ToolbarButton mode={m} icon="share" />
        <PopUp mode={m} label="" width={50} icon="ellipsis.circle" />
        <ToolbarSearch mode={m} width={110} />
      </div>
    </Win>
  );
}

export function WindowTabs(props: { mode: Mode }): Markup {
  const m = props.mode;
  const tabs = ["文稿", "下载", "照片"];
  return (
    <Win mode={m} width={480} height={250}>
      <Thumbs mode={m} cols={4} size={96} top={56} left={22} />
      <div class="absolute inset-x-0 top-0 h-[100px]" style={`background:linear-gradient(${paper(m)} 40%,transparent)`} />
      <div class="absolute left-[16px] top-[20px]"><TrafficLights mode={m} active /></div>
      <div class="absolute right-[8px] top-[8px] flex gap-2"><IconGroup mode={m} icons={["grid", "list"]} selected={0} /><ToolbarSearch mode={m} width={110} /></div>
      <span class="absolute left-[80px] top-[18px]" style={`${TEXT};font-weight:700;color:${ink(m)}`}>照片</span>
      <div class="absolute inset-x-[8px] top-[52px] flex items-center gap-2">
        <Capsule mode={m} width={420} height={32} class="flex items-center gap-[2px] px-[3px]">
          {tabs.map((t, i) => (
            <div class="relative grid h-[26px] flex-1 place-items-center rounded-full" style={i === 2 ? `background:${fill(m, 0.1)};font-weight:600` : `color:${dim(m)}`}>
              {i === 0 && <span class="absolute left-[8px] top-[6px]" style={`color:${dim(m)}`}><Icon name="xmark" size={11} weight={1.8} /></span>}
              {t}
            </div>
          ))}
        </Capsule>
        <ToolbarButtonS mode={m} glyph="plus" size={32} />
      </div>
    </Win>
  );
}

function ToolbarButtonS(props: { mode: Mode; glyph: Glyph; size: number }): Markup {
  return (
    <Glass mode={props.mode} width={props.size} height={props.size} radius={props.size / 2} class="grid place-items-center" style={`color:${ink(props.mode)}`}>
      <G name={props.glyph} size={14} />
    </Glass>
  );
}

function Field(props: { mode: Mode; width: number; text: string; dimText?: boolean; focus?: boolean }): Markup {
  const m = props.mode;
  return (
    <div class="flex h-[22px] items-center whitespace-nowrap rounded-[6px] px-[7px]" style={`width:${props.width}px;background:${m === "light" ? "#fff" : "rgb(255 255 255 / 0.08)"};box-shadow:0 0 0 0.5px ${fill(m, 0.15)}${props.focus ? `,0 0 0 3.5px rgb(0 136 255 / .5)` : ""};color:${props.dimText ? dim(m) : ink(m)};${TEXT};font-variant-numeric:tabular-nums`}>{props.text}</div>
  );
}

function MiniStepper(props: { mode: Mode }): Markup {
  const m = props.mode;
  return (
    <div class="flex h-6 w-5 flex-col overflow-hidden rounded-[6px]" style={`color:${m === "light" ? "rgb(0 0 0 / .85)" : "#fff"}`}>
      <div class="grid h-3 place-items-center" style={`background:${fill(m, 0.08)}`}><Icon name="chevron.up" size={9} weight={2} /></div>
      <div class="mx-[3px] h-px" style={`background:${fill(m, 0.12)}`} />
      <div class="grid h-3 place-items-center" style={`background:${fill(m, 0.08)}`}><Icon name="chevron.down" size={9} weight={2} /></div>
    </div>
  );
}

function SmallSeg(props: { mode: Mode; items: Child[]; selected: number; width: number }): Markup {
  const m = props.mode;
  return (
    <div class="flex h-6 items-center rounded-[6px] p-[2px]" style={`width:${props.width}px;background:${fill(m, 0.08)};color:${ink(m)};${TEXT}`}>
      {props.items.map((t, i) => <div class="grid h-5 flex-1 place-items-center rounded-[5px]" style={i === props.selected ? `background:${m === "light" ? "#fff" : "rgb(255 255 255 / .2)"};box-shadow:0 1px 2px rgb(0 0 0 / .15)` : ""}>{t}</div>)}
    </div>
  );
}

export function Inspector(props: { mode: Mode }): Markup {
  const m = props.mode;
  const page = m === "light" ? "#f2f2f2" : "#2a2a2a";
  return (
    <Win mode={m} width={480} height={340} bg={page}>
      <div class="absolute left-[24px] top-[60px] h-[300px] w-[230px] px-5 pt-5" style={`background:${m === "light" ? "#fff" : "#1e1e1e"};box-shadow:0 2px 8px rgb(0 0 0 / .12);color:${ink(m)}`}>
        <div style="font-size:20px;line-height:26px;font-weight:700">季度报告</div>
        <div class="mt-2" style={`${SMALL};color:${dim(m)}`}>2026 年第四季度 · 草稿</div>
        {[100, 92, 96, 70, 0, 98, 88, 94, 60].map((w) => w ? <div class="mt-[9px] h-[6px] rounded-full" style={`width:${w}%;background:${fill(m, 0.12)}`} /> : <div class="h-3" />)}
      </div>
      <div class="absolute left-[16px] top-[20px]"><TrafficLights mode={m} active /></div>
      <div class="absolute left-[82px] top-[8px] flex gap-2"><ToolbarButton mode={m} icon="sidebar.left" /><PopUp mode={m} label="100%" width={76} /></div>
      <div class="absolute right-[8px] top-[8px]">
        <Glass mode={m} width={210} height={324} radius={16} class="flex flex-col gap-[10px] px-3 pt-3" style={`color:${ink(m)};${TEXT}`}>
          <div class="flex justify-end gap-2"><ToolbarButtonS mode={m} glyph="paintbrush" size={30} /><ToolbarButtonS mode={m} glyph="doc" size={30} /></div>
          <SmallSeg mode={m} width={186} items={["样式", "布局", "更多"]} selected={0} />
          <span style={`${SMALL};font-weight:700;color:${dim(m)}`}>字体</span>
          <div class="flex h-[22px] items-center justify-between rounded-[6px] px-2" style={`background:${fill(m, 0.08)}`}>苹方-简<Icon name="chevron.up.chevron.down" size={11} /></div>
          <div class="flex items-center gap-2">
            <div class="flex h-[22px] flex-1 items-center justify-between rounded-[6px] px-2" style={`background:${fill(m, 0.08)}`}>中等<Icon name="chevron.up.chevron.down" size={11} /></div>
            <Field mode={m} width={44} text="13 pt" /><MiniStepper mode={m} />
          </div>
          <div class="flex gap-2">
            <SmallSeg mode={m} width={88} items={[<G name="bold" size={12} weight={1.8} />, <G name="italic" size={12} weight={1.6} />, <G name="underline" size={12} weight={1.6} />]} selected={0} />
            <SmallSeg mode={m} width={90} items={[<G name="align.left" size={12} />, <G name="align.center" size={12} />, <G name="align.right" size={12} />]} selected={0} />
          </div>
          <span style={`${SMALL};font-weight:700;color:${dim(m)}`}>颜色</span>
          <div class="flex items-center gap-[6px]">
            {[ink(m), "#ff3b30", "#ff9f0a", "#34c759", "#0a84ff", "#bf5af2"].map((c, i) => <div class="size-[18px] rounded-full" style={`background:${c};${i === 4 ? `box-shadow:0 0 0 2px ${paper(m)},0 0 0 3.5px ${ACCENT}` : ""}`} />)}
          </div>
          <div class="flex items-center justify-between">行距<Field mode={m} width={60} text="1.2 倍" /></div>
        </Glass>
      </div>
    </Win>
  );
}

export function SheetFromTitlebar(props: { mode: Mode }): Markup {
  const m = props.mode;
  return (
    <Win mode={m} width={480} height={330}>
      <Thumbs mode={m} cols={4} size={96} top={56} left={22} />
      <div class="absolute left-[16px] top-[20px]"><TrafficLights mode={m} active={false} /></div>
      <div class="absolute right-[8px] top-[8px] flex gap-2"><ToolbarButton mode={m} icon="share" /><ToolbarSearch mode={m} width={110} /></div>
      <div class="absolute inset-0" style={`background:${m === "light" ? "rgb(0 0 0 / .12)" : "rgb(0 0 0 / .35)"}`} />
      <div class="absolute left-[90px] top-[52px] flex w-[300px] flex-col gap-3 rounded-[16px] p-5" style={`background:${paper(m)};color:${ink(m)};box-shadow:0 0 54px rgb(0 0 0 / ${m === "light" ? 0.25 : 0.6}),0 0 0 0.5px ${fill(m, 0.15)}`}>
        <div style={`${TEXT};font-weight:700`}>导出“金门大桥日落”</div>
        {([["存储为", <Field mode={m} width={170} text="金门大桥日落.jpg" focus />], ["位置", <div class="flex h-[22px] w-[170px] items-center justify-between rounded-[6px] px-2" style={`background:${fill(m, 0.08)}`}><span class="flex items-center gap-1"><span style={`color:${ACCENT}`}><G name="folder" size={13} /></span>下载</span><Icon name="chevron.up.chevron.down" size={11} /></div>], ["格式", <SmallSeg mode={m} width={170} items={["JPEG", "HEIC", "PNG"]} selected={0} />]] as [string, Child][]).map(([k, v]) => (
          <div class="flex items-center justify-between" style={TEXT}><span style={`color:${dim(m)}`}>{k}</span>{v}</div>
        ))}
        <div class="flex items-center gap-2" style={TEXT}><span class="w-[60px]" style={`color:${dim(m)}`}>质量</span>
          <div class="relative h-1 flex-1 rounded-full" style={`background:${fill(m, 0.1)}`}><div class="h-1 w-[80%] rounded-full" style={`background:${ACCENT}`} /><div class="absolute left-[76%] top-[-6px] h-4 w-5 rounded-full bg-white" style="box-shadow:0 0.5px 2px rgb(0 0 0 / .35)" /></div>
        </div>
        <div class="mt-2 flex justify-end gap-2" style={TEXT}>
          <div class="grid h-7 w-[80px] place-items-center rounded-full" style={`background:${fill(m, 0.08)}`}>取消</div>
          <div class="grid h-7 w-[80px] place-items-center rounded-full text-white" style={`background:${ACCENT}`}>导出</div>
        </div>
      </div>
    </Win>
  );
}

export function UtilityPanel(props: { mode: Mode }): Markup {
  const m = props.mode;
  const tabs: Glyph[] = ["paintbrush", "photo", "star", "tag", "gear"];
  const sw = ["#ff3b30", "#ff9f0a", "#ffcc00", "#34c759", "#00c7be", "#0a84ff", "#5e5ce6", "#bf5af2", "#ff2d55", "#a2845e", "#8e8e93", "#1a1a1a"];
  return (
    <Glass mode={m} width={300} height={300} radius={15} class="flex flex-col" style={`color:${ink(m)};${TEXT}`}>
      <div class="flex h-[65px] flex-col px-3 pt-[9px]" style={`border-bottom:1px solid ${m === "light" ? "rgb(60 60 67 / .12)" : "rgb(255 255 255 / .1)"}`}>
        <div class="flex items-center"><TrafficLights mode={m} active size={10} /><span class="flex-1 text-center" style={`${SMALL};font-weight:600;margin-left:-40px`}>颜色</span></div>
        <div class="mt-[6px] flex justify-center gap-[2px]">
          {tabs.map((g, i) => <div class="grid h-[30px] w-[44px] place-items-center rounded-[6px]" style={i === 0 ? `background:${fill(m, 0.1)};color:${ACCENT}` : `color:${dim(m)}`}><G name={g} size={16} /></div>)}
        </div>
      </div>
      <div class="flex flex-1 flex-col gap-3 p-3">
        <div class="h-[110px] rounded-[8px]" style="background:linear-gradient(transparent,#000),linear-gradient(90deg,#fff,hsl(210 100% 50%))" />
        <div class="relative h-3 rounded-full" style="background:linear-gradient(90deg,red,#ff0,lime,cyan,blue,#f0f,red)"><div class="absolute left-[58%] top-[-3px] size-[18px] rounded-full bg-white" style="box-shadow:0 0.5px 3px rgb(0 0 0 / .4)" /></div>
        <div class="grid grid-cols-12 gap-[4px]">{sw.map((c) => <div class="aspect-square rounded-[4px]" style={`background:${c}`} />)}</div>
        <div class="flex items-center justify-between">不透明度<Field mode={m} width={56} text="100%" /></div>
      </div>
    </Glass>
  );
}

// ---------------------------------------------------------------- 菜单

const POINTER = '<svg width="20" height="26" viewBox="0 0 20 26"><path d="M2 2v19l5-4.5 3.2 7 3-1.4-3.1-6.8H17z" fill="#000" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';

export function ContextMenu(props: { mode: Mode }): Markup {
  const m = props.mode;
  return (
    <div class="relative h-[320px] w-[480px]">
      <div class="absolute left-[30px] top-[24px] flex flex-col items-center gap-1">
        <AppIcon size={64} hue={210} glyph="folder" />
        <span class="rounded-[4px] px-[5px]" style={`${SMALL};font-weight:500;background:${KEY};color:#fff`}>项目资料</span>
      </div>
      <div class="absolute left-[110px] top-[70px]">{raw(POINTER)}</div>
      <div class="absolute left-[116px] top-[76px]">
        <MenuPanel
          mode={m}
          width={200}
          rows={[
            { text: "打开" },
            { text: "在新标签页中打开" },
            "separator",
            { text: "显示简介", key: "⌘I" },
            { text: "重新命名" },
            { text: "压缩“项目资料”" },
            { text: "共享", more: true, hover: true },
            "separator",
            { text: "拷贝", key: "⌘C" },
            { text: "移到废纸篓", key: "⌘⌫" },
          ]}
        />
      </div>
      <div class="absolute left-[312px] top-[207px]">
        <MenuPanel mode={m} width={150} rows={[{ text: "隔空投送", icon: "airdrop" }, { text: "邮件", icon: "doc.text" }, { text: "信息", icon: "person" }, "separator", { text: "编辑扩展…", off: true }]} />
      </div>
    </div>
  );
}

export function Tooltips(props: { mode: Mode }): Markup {
  const m = props.mode;
  const tip = (t: string) => (
    <div class="whitespace-nowrap rounded-[6px] px-[6px] py-[3px]" style={`${SMALL};font-weight:500;background:${m === "light" ? "rgb(236 236 236 / 0.88)" : "rgb(48 48 48 / 0.92)"};color:${ink(m)};box-shadow:0 2px 8px rgb(0 0 0 / .18),0 0 0 0.5px ${fill(m, 0.12)}`}>{t}</div>
  );
  return (
    <div class="flex items-start gap-10">
      <div class="relative flex flex-col items-start">
        <div class="flex gap-2"><ToolbarButton mode={m} icon="sidebar.left" /><ToolbarSegmented mode={m} icons={["square", "slider"]} /></div>
        <div class="absolute left-[20px] top-[34px]">{raw(POINTER)}</div>
        <div class="ml-[28px] mt-[26px]">{tip("显示或隐藏边栏")}</div>
      </div>
      <div class="relative flex flex-col items-start">
        <PushButton mode={m} text="好" prominent />
        <div class="absolute left-[40px] top-[12px]">{raw(POINTER)}</div>
        <div class="ml-[40px] mt-[16px]">{tip("存储更改并关闭窗口（↩）")}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- 数据

const FILES: [string, string, string, string, Glyph, number][] = [
  ["季度报告.pages", "今天 09:12", "2.4 MB", "Pages 文稿", "doc.text", 35],
  ["金门大桥日落.heic", "昨天 18:40", "5.1 MB", "HEIC 图像", "photo", 130],
  ["项目资料", "11月10日", "--", "文件夹", "folder", 210],
  ["会议纪要.txt", "11月9日", "4 KB", "纯文本", "doc", 0],
  ["预算.numbers", "11月6日", "860 KB", "Numbers 表格", "grid", 140],
  ["演示.key", "11月2日", "18.3 MB", "Keynote 演示文稿", "display", 200],
  ["备份.zip", "10月28日", "1.2 GB", "ZIP 归档", "download", 260],
];

export function DataTable(props: { mode: Mode }): Markup {
  const m = props.mode;
  const cols = [210, 110, 70, 130];
  const strong = m === "light" ? "rgb(0 0 0 / 0.85)" : "rgb(255 255 255 / 0.9)";
  return (
    <Win mode={m} width={560} height={300}>
      <div class="absolute left-[16px] top-[20px]"><TrafficLights mode={m} active /></div>
      <span class="absolute left-[82px] top-[18px]" style={`${TEXT};font-weight:700;color:${ink(m)}`}>文稿</span>
      <div class="absolute right-[8px] top-[8px] flex gap-2"><IconGroup mode={m} icons={["grid", "list", "columns"]} selected={1} /><ToolbarSearch mode={m} width={120} /></div>
      <div class="absolute inset-x-0 top-[52px]">
        <div class="mx-[10px] flex h-7 items-center" style={`${SMALL};color:${dim(m)};font-weight:500`}>
          {["名称", "修改日期", "大小", "种类"].map((h, i) => (
            <div class="flex h-4 items-center justify-between px-2" style={`width:${cols[i]}px;${i ? `border-left:1px solid ${fill(m, 0.1)}` : ""};${i === 1 ? `font-weight:700;color:${strong}` : ""}`}>
              {h}{i === 1 && <Icon name="chevron.down" size={9} weight={2} />}
            </div>
          ))}
        </div>
        {FILES.map(([n, d, s, k, g, hue], r) => {
          const sel = r === 1;
          const bg = sel ? "background:#0165e2;color:#fff" : r % 2 === 1 ? `background:${fill(m, 0.05)}` : "";
          return (
            <div class="mx-[10px] flex h-[26px] items-center rounded-[8px]" style={`${TEXT};${bg}`}>
              <div class="flex items-center gap-[6px] px-2" style={`width:${cols[0]}px;color:${sel ? "#fff" : strong}`}>
                <span style={`color:${sel ? "#fff" : `hsl(${hue} 70% 50%)`}`}><G name={g} size={15} /></span>{n}
              </div>
              {[d, s, k].map((v, i) => <div class="px-2" style={`width:${cols[i + 1]}px;color:${sel ? "#fff" : dim(m)};${i === 1 ? "text-align:right" : ""}`}>{v}</div>)}
            </div>
          );
        })}
      </div>
      <div class="absolute bottom-[8px] right-[4px] top-[86px] w-[12px]"><div class="mx-auto mt-1 h-[90px] w-[6px] rounded-full" style={`background:${fill(m, 0.4)}`} /></div>
    </Win>
  );
}

export function DatePicker(props: { mode: Mode }): Markup {
  const m = props.mode;
  // 1 Nov 2026 is a Sunday: 30 days, then December fills the sixth week.
  const cells: [number, boolean][] = Array.from({ length: 42 }, (_, i) => (i < 30 ? [i + 1, true] : [i - 29, false]));
  return (
    <div class="flex flex-col items-start gap-[8px]">
      <div class="flex items-center gap-[3px]">
        <Field mode={m} width={110} text="2026/11/20" focus />
        <MiniStepper mode={m} />
      </div>
      <Glass mode={m} width={224} height={236} radius={16} class="flex flex-col px-3 pt-3" style={`color:${ink(m)}`}>
        <div class="flex items-center justify-between" style={`${TEXT};font-weight:700`}>
          2026年11月
          <span class="flex items-center gap-3" style={`color:${dim(m)}`}><Icon name="chevron.left" size={12} weight={2} /><div class="size-[6px] rounded-full" style={`background:${dim(m)}`} /><Icon name="chevron.right" size={12} weight={2} /></span>
        </div>
        <div class="mt-2 grid grid-cols-7 text-center" style={`${SMALL};font-weight:600;color:${dim(m)}`}>{["日", "一", "二", "三", "四", "五", "六"].map((d) => <span>{d}</span>)}</div>
        <div class="mt-1 grid grid-cols-7 text-center" style={`${TEXT};font-variant-numeric:tabular-nums`}>
          {cells.map(([d, inMonth]) => (
            <div class="grid h-[28px] place-items-center">
              <div class="grid size-[24px] place-items-center rounded-full" style={!inMonth ? `color:${m === "light" ? "#bfbfbf" : "#5a5a5a"}` : d === 20 && inMonth ? `background:${ACCENT};color:#fff;font-weight:700` : d === 14 ? "color:#ff3b30;font-weight:700" : ""}>{d}</div>
            </div>
          ))}
        </div>
      </Glass>
    </div>
  );
}

export function SteppersAndFields(props: { mode: Mode }): Markup {
  const m = props.mode;
  const row = (k: string, v: Child) => <div class="flex items-center gap-3" style={`${TEXT};color:${ink(m)}`}><span class="w-[70px] text-right" style={`color:${dim(m)}`}>{k}</span>{v}</div>;
  const date = (parts: string[], sel: number, sep: string) => (
    <div class="flex items-center gap-[3px]">
      <div class="flex h-[22px] items-center rounded-[6px] px-[6px]" style={`background:${m === "light" ? "#fff" : "rgb(255 255 255 / 0.08)"};box-shadow:0 0 0 0.5px ${fill(m, 0.15)};${TEXT};font-variant-numeric:tabular-nums;color:${ink(m)}`}>
        {parts.map((p, i) => <>{i > 0 && <span style={`color:${dim(m)}`}>{sep}</span>}<span class="rounded-[3px] px-[1px]" style={i === sel ? `background:${ACCENT};color:#fff` : ""}>{p}</span></>)}
      </div>
      <MiniStepper mode={m} />
    </div>
  );
  return (
    <div class="flex flex-col gap-[14px]">
      {row("日期", date(["2026", "11", "20"], 2, "/"))}
      {row("时间", date(["09", "41", "00"], 1, ":"))}
      {row("份数", <div class="flex items-center gap-[3px]"><Field mode={m} width={48} text="3" /><MiniStepper mode={m} /></div>)}
      {row("提醒", <div class="flex items-center gap-2"><SwitchTrack mode={m} on /><span style={`color:${dim(m)}`}>提前 15 分钟</span></div>)}
    </div>
  );
}

function Spinner(props: { mode: Mode; large?: boolean }): Markup {
  const s = props.large ? 32 : 16, w = props.large ? 4 : 2, h = props.large ? 10 : 5;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style="opacity:.55">
      {Array.from({ length: 8 }, (_, i) => (
        <rect x={(s - w) / 2} y="0" width={w} height={h} rx={w / 2} fill={ink(props.mode)} opacity={(1 - i * 0.12).toFixed(2)} transform={`rotate(${-i * 45} ${s / 2} ${s / 2})`} />
      ))}
    </svg>
  );
}

function Ring(props: { mode: Mode; size: number; value: number }): Markup {
  const s = props.size, sw = s > 20 ? 5 : 3, r = (s - sw) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke={fill(props.mode, 0.1)} stroke-width={sw} />
      <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke={ACCENT} stroke-width={sw} stroke-linecap="round" stroke-dasharray={`${(c * props.value).toFixed(1)} ${c.toFixed(1)}`} transform={`rotate(-90 ${s / 2} ${s / 2})`} />
    </svg>
  );
}

function Bar(props: { mode: Mode; width: number; height: 6 | 10; value: number; striped?: boolean }): Markup {
  const m = props.mode;
  return (
    <div class="overflow-hidden rounded-full" style={`width:${props.width}px;height:${props.height}px;background:${fill(m, 0.1)};box-shadow:inset 0 0 0 0.5px ${fill(m, 0.07)}`}>
      <div class="h-full rounded-full" style={`width:${props.value * 100}%;background:${props.striped ? `repeating-linear-gradient(-45deg,${ACCENT} 0 6px,#5cb2ff 6px 12px)` : ACCENT}`} />
    </div>
  );
}

export function Progress(props: { mode: Mode }): Markup {
  const m = props.mode;
  const item = (n: string, sub: string, v: number, hue: number, g: Glyph) => (
    <div class="flex items-center gap-[10px]">
      <AppIcon size={30} hue={hue} glyph={g} />
      <div class="flex flex-1 flex-col gap-[4px]" style={TEXT}>{n}<Bar mode={m} width={170} height={6} value={v} /><span class="whitespace-nowrap" style={`${SMALL};color:${dim(m)}`}>{sub}</span></div>
      <span style={`color:${dim(m)}`}><Icon name="xmark.circle.fill" size={15} /></span>
    </div>
  );
  return (
    <div class="flex items-center gap-8">
      <div class="flex flex-col gap-4 rounded-[14px] p-4" style={`background:${paper(m)};color:${ink(m)};box-shadow:0 0 0 0.5px ${fill(m, 0.12)}`}>
        <div class="flex items-center gap-3"><Bar mode={m} width={100} height={6} value={0.45} /><Bar mode={m} width={100} height={10} value={0.7} /></div>
        <div class="flex items-center gap-3"><Bar mode={m} width={212} height={6} value={1} striped /></div>
        <div class="flex items-center gap-4"><Ring mode={m} size={16} value={0.6} /><Ring mode={m} size={32} value={0.35} /><Spinner mode={m} /><Spinner mode={m} large /></div>
      </div>
      <div class="relative">
        <Glass mode={m} width={270} height={150} radius={20} class="flex flex-col justify-center gap-[14px] px-4" style={`color:${ink(m)}`}>
          {item("备份.zip", "820 MB / 1.2 GB · 还剩 1 分钟", 0.66, 260, "download")}
          {item("演示.key", "正在准备…", 0.08, 200, "display")}
        </Glass>
      </div>
    </div>
  );
}

