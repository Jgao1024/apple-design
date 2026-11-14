import type { Child, Markup } from "@design/jsx/jsx-runtime";
import type { Mode } from "../../doubao/theme.ts";
import { Battery, Signal, Wifi } from "../../ios27/components/chrome.tsx";
import { Icon, type IconName } from "../../ios27/components/icon.tsx";
import { Glass } from "./glass.tsx";
import { SymbolButton } from "./ios.tsx";

// The rest of the iOS 27 components (pages/07-ios-more), drawn with the standard glass. Geometry is
// the ios27 kit's, from the Figma specs as recorded in design/system/ios27/components/*.tsx:
//   status bar 402 x 62; toolbar top 54 (16 side padding, 44 buttons); bottom toolbar 84 (28 side
//   padding, 48 buttons); large title 34 / 41 bold; page control 8 pt dots 8 apart in a 24 capsule
//   action sheet 300 wide radius 34, 272 x 48 actions; edit menu 232 x 44; menu 238 wide, 40 rows
//   notification banner 386 x 63 radius 24, icon 38; expanded 370 wide radius 26
//   widgets small 164.67, medium 349.67 x 164.33, radius 28; lock screen circular 72, rectangular 162 x 72
//   stepper 92 x 32 (two 46 halves, #767680 12 %); list row 52, 16 side padding, 17 / 22
// Glass is used on bars, buttons, menus, sheets, banners and widgets; text, tracks and list cells are flat.

export const BLUE = "#0088ff";
const RED = "#ff383c";
export const label = (m: Mode) => (m === "light" ? "#000000" : "#ffffff");
export const secondary = (m: Mode) => (m === "light" ? "rgb(60 60 67 / 0.6)" : "rgb(235 235 245 / 0.6)");
const divider = (m: Mode) => (m === "light" ? "rgb(0 0 0 / 0.1)" : "rgb(255 255 255 / 0.12)");
const quiet = (m: Mode) => (m === "light" ? "rgb(120 120 128 / 0.16)" : "rgb(120 120 128 / 0.32)");
const cell = (m: Mode) => (m === "light" ? "rgb(255 255 255 / 0.72)" : "rgb(255 255 255 / 0.08)");
const BODY = "font-size:17px;line-height:22px";

// Symbols the ios27 kit does not have, on the same 24 unit grid.
const EXTRA = {
  pause: "M8 5v14M16 5v14",
  forward: "M4 6l8 6-8 6zM12 6l8 6-8 6z",
  backward: "M20 6l-8 6 8 6zM12 6l-8 6 8 6z",
  flashlight: "M8 3h8v4l-2 3v11h-4V10L8 7zM12 13v2",
  moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z",
  sun: "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  speaker: "M4 9h4l5-4v14l-5-4H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12",
  bluetooth: "M7 7l10 10-5 4V3l5 4L7 17",
  wifi: "M2.5 9a13.5 13.5 0 0 1 19 0M5.5 12.5a9 9 0 0 1 13 0M8.7 15.8a4.5 4.5 0 0 1 6.6 0M12 19.5h.01",
  antenna: "M12 10v11M8.5 6.5a5 5 0 0 0 0 7M15.5 6.5a5 5 0 0 1 0 7M6 4a8.5 8.5 0 0 0 0 12M18 4a8.5 8.5 0 0 1 0 12",
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  archive: "M3 4h18v4H3zM5 8v12h14V8M10 12h4",
  message: "M4 5h16v11H9l-5 4z",
  location: "M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  scissors: "M6 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 7l12 11M8 17L20 6",
  music: "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  airplay: "M5 17H3V4h18v13h-2M7 21l5-6 5 6z",
  quote: "M5 7h14M5 12h14M5 17h9",
  keyboard: "M3 6h18v10H3zM7 9h.01M11 9h.01M15 9h.01M8 13h8M10 20l2 1.5 2-1.5",
  photo: "M4 5h16v14H4zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM4 17l5-5 4 4 3-3 4 4",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  timer: "M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2.5 2M10 2h4",
  rotate: "M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4",
  repeat: "M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4",
  shuffle: "M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5",
  sparkles: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z",
} as const;

export type Sym = IconName | keyof typeof EXTRA;

/// An ios27 symbol, or one of the extra ones above.
export function S(props: { name: Sym; size?: number; weight?: number; color?: string }): Markup {
  if (!(props.name in EXTRA)) return <Icon name={props.name as IconName} size={props.size} weight={props.weight} color={props.color} />;
  const size = props.size ?? 22;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} stroke-width={props.weight ?? 2} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d={EXTRA[props.name as keyof typeof EXTRA]} />
    </svg>
  );
}

/// A strip of a 402 pt screen; the stage around it supplies the backdrop.
function Screen(props: { height: number; width?: number; children?: Child }): Markup {
  return <div class="relative overflow-hidden" style={`width:${props.width ?? 402}px;height:${props.height}px`}>{props.children}</div>;
}

function Status(props: { mode: Mode; color?: string; time?: string }): Markup {
  const c = props.color ?? label(props.mode);
  return (
    <div class="absolute inset-x-0 top-0 h-[62px]" style={`color:${c}`}>
      <span class="absolute left-0 top-[23px] w-[138px] text-center" style="font-size:17px;line-height:20px;font-weight:590">{props.time ?? "9:41"}</span>
      <div class="absolute left-[138.5px] top-[14px] h-[37px] w-[125px] rounded-full bg-black" />
      <div class="absolute right-0 top-[25px] flex h-[15px] w-[138px] items-center justify-center gap-2"><Signal color={c} /><Wifi color={c} /><Battery color={c} /></div>
    </div>
  );
}

/// Content scrolling under a bar: solid cards of text, the thing a scroll-edge effect sits over.
function Feed(props: { mode: Mode; top: number; rows?: number }): Markup {
  const items = [
    ["上周末 · 旧金山", "金门大桥日落，21 张照片"],
    ["10 月 · 优胜美地", "半穹顶徒步，48 张照片"],
    ["9 月 · 东京", "涩谷、浅草、台场，112 张照片"],
    ["8 月 · 杭州", "西湖夜游，36 张照片"],
  ].slice(0, props.rows ?? 4);
  return (
    <div class="absolute inset-x-4 flex flex-col gap-3" style={`top:${props.top}px`}>
      {items.map(([t, d], i) => (
        <div class="flex h-[76px] items-center gap-3 rounded-[22px] px-3" style={`background:${props.mode === "light" ? "#fff" : "#1c1c1e"}`}>
          <div class="size-[52px] rounded-[12px]" style={`background:linear-gradient(135deg,hsl(${20 + i * 70} 80% 62%),hsl(${60 + i * 70} 70% 45%))`} />
          <div>
            <div style={`${BODY};font-weight:600;color:${label(props.mode)}`}>{t}</div>
            <div style={`font-size:15px;line-height:20px;color:${secondary(props.mode)}`}>{d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/// Glass group of symbols, as on a toolbar (44 or 48 tall, 44 per symbol).
function Group(props: { mode: Mode; icons: Sym[]; size?: 44 | 48 }): Markup {
  const h = props.size ?? 44;
  return (
    <Glass mode={props.mode} width={props.icons.length * h} height={h} radius={h / 2} class="flex items-center justify-around" style={`color:${label(props.mode)}`}>
      {props.icons.map((i) => <S name={i} size={h === 48 ? 22 : 21} />)}
    </Glass>
  );
}

function Round(props: { mode: Mode; icon: Sym; size: number; tint?: string; color?: string; iconSize?: number }): Markup {
  return (
    <Glass mode={props.mode} width={props.size} height={props.size} radius={props.size / 2} tint={props.tint} class="grid place-items-center" style={`color:${props.color ?? (props.tint ? "#fff" : label(props.mode))}`}>
      <S name={props.icon} size={props.iconSize ?? Math.round(props.size * 0.46)} />
    </Glass>
  );
}

// ---------------------------------------------------------------- 导航

export function LargeTitleBar(props: { mode: Mode; scrolled: boolean }): Markup {
  const m = props.mode;
  const fade = m === "light" ? "rgb(242 242 247 / 0.94)" : "rgb(0 0 0 / 0.9)";
  return (
    <Screen height={300}>
      <div class="absolute inset-0" style={`background:${m === "light" ? "#f2f2f7" : "#000"}`} />
      <Feed mode={m} top={props.scrolled ? 40 : 186} />
      {props.scrolled && <div class="absolute inset-x-0 top-0 h-[150px]" style={`background:linear-gradient(${fade} 62%,transparent)`} />}
      <Status mode={m} />
      <div class="absolute left-4 top-[67px]"><SymbolButton mode={m} icon="chevron-left" /></div>
      {props.scrolled && <span class="absolute inset-x-0 top-[78px] text-center" style={`${BODY};font-weight:590;color:${label(m)}`}>相簿</span>}
      <div class="absolute right-4 top-[67px] flex gap-2">
        <Group mode={m} icons={["plus", "ellipsis"]} />
      </div>
      {!props.scrolled && (
        <div class="absolute left-4 top-[118px]" style={`color:${label(m)}`}>
          <div style="font-size:34px;line-height:41px;font-weight:700">相簿</div>
          <div style={`font-size:15px;line-height:20px;color:${secondary(m)}`}>217 张照片，4 个回忆</div>
        </div>
      )}
    </Screen>
  );
}

export function BottomToolbar(props: { mode: Mode }): Markup {
  const m = props.mode;
  return (
    <Screen height={150}>
      <div class="absolute inset-x-[28px] bottom-[30px] flex items-center justify-between">
        <SymbolButtonL mode={m} icon="share" />
        <Group mode={m} icons={["heart", "text-size", "trash"]} size={48} />
        <Glass mode={m} width={73} height={48} radius={24} tint="rgb(0 136 255 / 0.92)" class="grid place-items-center" style="color:#fff;font-size:17px;font-weight:590">完成</Glass>
      </div>
      <div class="absolute bottom-[8px] left-[129px] h-[5px] w-[144px] rounded-full" style={`background:${label(m)}`} />
      <span class="absolute left-[28px] top-[22px]" style={`font-size:13px;line-height:18px;color:${m === "light" ? "#fff" : "#fff"};font-weight:510;text-shadow:0 1px 4px rgb(0 0 0 / .4)`}>84 pt 工具栏，48 pt 按钮，左右各 28 pt</span>
    </Screen>
  );
}

function SymbolButtonL(props: { mode: Mode; icon: Sym }): Markup {
  return <Round mode={props.mode} icon={props.icon} size={48} iconSize={22} />;
}

export function PageIndicator(props: { mode: Mode }): Markup {
  const m = props.mode;
  const dot = (on: boolean, s = 8) => <div class="rounded-full" style={`width:${s}px;height:${s}px;background:${on ? label(m) : m === "light" ? "rgb(0 0 0 / 0.3)" : "rgb(255 255 255 / 0.3)"}`} />;
  return (
    <div class="flex flex-col items-center gap-5">
      <Glass mode={m} width={24 + 5 * 8 + 4 * 8} height={24} radius={12} class="flex items-center justify-center gap-2">{[0, 1, 2, 3, 4].map((i) => dot(i === 1))}</Glass>
      <Glass mode={m} width={24 + 7 * 8 + 6 * 8 - 6} height={24} radius={12} class="flex items-center justify-center gap-2">
        {[4, 6, 8, 8, 8, 6, 4].map((s, i) => dot(i === 3, s))}
      </Glass>
      <Glass mode={m} width={118} height={24} radius={12} class="flex items-center justify-center gap-[6px]" style={`color:${label(m)}`}>
        <S name="search" size={10} weight={3} />
        {[0, 1, 2, 3].map((i) => dot(i === 0))}
        <S name="plus" size={10} weight={3} />
      </Glass>
    </div>
  );
}

// ---------------------------------------------------------------- 浮层

function Photo(props: { width: number; height: number; radius: number; hue?: number }): Markup {
  const h = props.hue ?? 24;
  return (
    <div
      style={`width:${props.width}px;height:${props.height}px;border-radius:${props.radius}px;background:radial-gradient(circle at 70% 30%,hsl(${h + 30} 95% 75%) 0 12%,transparent 13%),linear-gradient(180deg,hsl(${h} 85% 62%),hsl(${h + 300} 50% 40%) 70%,hsl(${h + 260} 40% 22%))`}
    />
  );
}

type MenuItem = { text: string; icon: Sym; red?: boolean } | "divider";

function MenuList(props: { mode: Mode; items: MenuItem[]; width?: number }): Markup {
  const m = props.mode;
  const rows = props.items.filter((r) => r !== "divider").length;
  const dividers = props.items.length - rows;
  return (
    <Glass mode={m} width={props.width ?? 238} height={28 + rows * 40 + dividers * 9} radius={34} class="flex flex-col px-6 py-[14px]">
      {props.items.map((row) =>
        row === "divider"
          ? <div class="my-[4px] h-px" style={`background:${divider(m)}`} />
          : (
            <div class="flex h-10 items-center justify-between" style={`font-size:17px;color:${row.red ? RED : label(m)}`}>
              <span>{row.text}</span><S name={row.icon} size={19} weight={1.8} />
            </div>
          )
      )}
    </Glass>
  );
}

export function ContextMenu(props: { mode: Mode }): Markup {
  const dim = props.mode === "light" ? "rgb(0 0 0 / 0.18)" : "rgb(0 0 0 / 0.45)";
  return (
    <>
      <div class="absolute inset-0" style={`background:${dim};backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)`} />
      <div class="relative flex flex-col items-center gap-3">
        <div style="box-shadow:0 12px 40px rgb(0 0 0 / 0.3);border-radius:24px"><Photo width={300} height={200} radius={24} /></div>
        <div class="self-start">
          <MenuList
            mode={props.mode}
            items={[{ text: "拷贝", icon: "copy" }, { text: "共享", icon: "share" }, { text: "个人收藏", icon: "heart" }, "divider", { text: "删除", icon: "trash", red: true }]}
          />
        </div>
      </div>
    </>
  );
}

export function ActionSheet(props: { mode: Mode }): Markup {
  const m = props.mode;
  const action = (t: string, kind: "plain" | "red" | "cancel") => (
    <div class="grid h-12 place-items-center rounded-full" style={`${BODY};font-weight:${kind === "cancel" ? 600 : 510};background:${quiet(m)};color:${kind === "red" ? RED : label(m)}`}>{t}</div>
  );
  return (
    <div class="absolute inset-x-0 bottom-[10px] flex justify-center">
      <Glass mode={m} width={300} height={316} radius={34} class="flex flex-col gap-2 p-[14px]">
        <div class="px-2 pb-2 pt-[6px] text-center">
          <div style={`font-size:15px;line-height:20px;font-weight:600;color:${label(m)}`}>此照片将从所有设备上删除</div>
          <div class="mt-[2px]" style={`font-size:13px;line-height:18px;color:${secondary(m)}`}>“最近删除”会保留 30 天。</div>
        </div>
        {action("删除照片", "red")}
        {action("隐藏照片", "plain")}
        {action("移到相簿…", "plain")}
        {action("取消", "cancel")}
      </Glass>
    </div>
  );
}

export function EditMenu(props: { mode: Mode }): Markup {
  const m = props.mode;
  const text = m === "light" ? "#1c1c1e" : "#f2f2f7";
  return (
    <div class="relative h-[200px] w-[380px] rounded-[22px] px-5 pt-[78px]" style={`background:${m === "light" ? "#fff" : "#1c1c1e"};color:${text};font-size:17px;line-height:26px`}>
      <div class="absolute left-[140px] top-[22px]">
        <Glass mode={m} width={220} height={44} radius={22} class="flex items-center px-1" style={`color:${label(m)};font-size:15px;font-weight:510`}>
          {["剪切", "拷贝", "粘贴"].map((t, i) => (
            <div class="grid h-9 flex-1 place-items-center" style={i > 0 ? `border-left:1px solid ${divider(m)}` : ""}>{t}</div>
          ))}
          <div class="grid h-9 w-8 place-items-center" style={`border-left:1px solid ${divider(m)}`}><S name="chevron-right" size={15} /></div>
        </Glass>
      </div>
      <p>周六上午十点在码头集合，<span class="relative inline-block" style="background:rgb(0 136 255 / 0.22)">
        <span class="absolute -left-px -top-[6px] bottom-0 w-[2px]" style={`background:${BLUE}`}><span class="absolute -left-[4px] -top-[4px] size-[10px] rounded-full" style={`background:${BLUE}`} /></span>
        记得带上防晒
        <span class="absolute -right-px -bottom-[6px] top-0 w-[2px]" style={`background:${BLUE}`}><span class="absolute -bottom-[4px] -left-[4px] size-[10px] rounded-full" style={`background:${BLUE}`} /></span>
      </span>和雨衣，天气预报说下午可能有阵雨。</p>
    </div>
  );
}

export function IpadPopover(props: { mode: Mode }): Markup {
  const m = props.mode;
  return (
    <div class="relative h-[300px] w-[400px]">
      <div class="absolute right-[16px] top-[12px] flex gap-2">
        <SymbolButton mode={m} icon="share" />
        <Glass mode={m} width={44} height={44} radius={22} class="grid place-items-center" style={`color:${BLUE};box-shadow:inset 0 0 0 2px ${BLUE}`}><S name="text-size" size={21} /></Glass>
      </div>
      <div class="absolute right-[10px] top-[64px]">
        <Glass mode={m} width={300} height={224} radius={26} class="flex flex-col px-5 py-4" style={`color:${label(m)}`}>
          <div class="flex items-center justify-between">
            <span style={`${BODY};font-weight:600`}>文字</span>
            <span style={`color:${secondary(m)}`}><S name="xmark" size={16} weight={2.4} /></span>
          </div>
          <div class="mt-4 flex h-11 items-center justify-between rounded-full px-4" style={`background:${quiet(m)}`}>
            <span style="font-size:15px">A</span>
            <div class="flex gap-[5px]">{[0, 1, 2, 3, 4, 5, 6].map((i) => <div class="size-[6px] rounded-full" style={`background:${i <= 3 ? label(m) : secondary(m)}`} />)}</div>
            <span style="font-size:22px">A</span>
          </div>
          {[["粗体文本", true], ["自动夜间主题", false]].map(([t, on]) => (
            <div class="mt-3 flex h-8 items-center justify-between" style="font-size:17px">
              {t}
              <div class="relative h-7 w-16 rounded-full" style={`background:${on ? "#34c759" : quiet(m)}`}><div class="absolute top-[2px] h-6 w-[38px] rounded-full bg-white" style={`left:${on ? 24 : 2}px;box-shadow:0 3px 8px rgb(0 0 0 / .15)`} /></div>
            </div>
          ))}
        </Glass>
      </div>
    </div>
  );
}

const PEOPLE = [["小林", 200], ["妈妈", 330], ["Alex", 140], ["王工", 30]] as const;
const APPS: [string, string][] = [["信息", "#34c759"], ["邮件", "#0a84ff"], ["备忘录", "#ffcc00"], ["微信", "#07c160"], ["更多", "#8e8e93"]];

export function ShareSheet(props: { mode: Mode }): Markup {
  const m = props.mode;
  return (
    <div class="absolute inset-x-[6px] bottom-[6px]">
      <Glass mode={m} width={408} height={452} radius={38} class="flex flex-col px-4 pt-4" style={`color:${label(m)}`}>
        <div class="flex items-center gap-3">
          <Photo width={52} height={52} radius={10} />
          <div class="flex-1">
            <div style={`${BODY};font-weight:600`}>金门大桥日落</div>
            <div style={`font-size:13px;line-height:18px;color:${secondary(m)}`}>1 张照片 · 选项 ›</div>
          </div>
          <div class="grid size-[34px] place-items-center rounded-full" style={`background:${quiet(m)};color:${secondary(m)}`}><S name="xmark" size={14} weight={2.6} /></div>
        </div>
        <div class="mt-5 flex justify-between px-1">
          {PEOPLE.map(([n, h]) => (
            <div class="flex w-[72px] flex-col items-center gap-[6px]">
              <div class="relative grid size-[60px] place-items-center rounded-full text-white" style={`background:linear-gradient(160deg,hsl(${h} 70% 65%),hsl(${h} 60% 45%));font-size:22px;font-weight:600`}>
                {n.slice(0, 1)}
                <div class="absolute -bottom-[2px] -right-[2px] grid size-[22px] place-items-center rounded-full" style={`background:${BLUE};box-shadow:0 0 0 2px ${m === "light" ? "#fff" : "#1c1c1e"}`}><S name="airplay" size={12} weight={2.4} /></div>
              </div>
              <span style="font-size:12px;line-height:16px">{n}</span>
            </div>
          ))}
        </div>
        <div class="mt-3 h-px" style={`background:${divider(m)}`} />
        <div class="mt-4 flex justify-between px-1">
          {APPS.map(([n, c]) => (
            <div class="flex w-[64px] flex-col items-center gap-[6px]">
              <div class="size-[60px] rounded-[15px]" style={`background:linear-gradient(180deg,${c},color-mix(in srgb,${c} 75%,#000))`} />
              <span style="font-size:12px;line-height:16px">{n}</span>
            </div>
          ))}
        </div>
        <div class="mt-4 overflow-hidden rounded-[26px]" style={`background:${cell(m)}`}>
          {([["拷贝", "copy"], ["添加到个人收藏", "heart"], ["存储到“文件”", "folder"]] as [string, Sym][]).map(([t, i], k) => (
            <div class="mx-4 flex h-[46px] items-center justify-between" style={`font-size:17px;${k ? `border-top:1px solid ${divider(m)}` : ""}`}>{t}<S name={i} size={20} weight={1.8} /></div>
          ))}
        </div>
      </Glass>
    </div>
  );
}

// ---------------------------------------------------------------- 系统

function AppGlyph(props: { size: number; color: string; icon: Sym; radius?: number }): Markup {
  return (
    <div class="grid shrink-0 place-items-center text-white" style={`width:${props.size}px;height:${props.size}px;border-radius:${props.radius ?? props.size * 0.26}px;background:linear-gradient(180deg,${props.color},color-mix(in srgb,${props.color} 75%,#000))`}>
      <S name={props.icon} size={Math.round(props.size * 0.55)} weight={2.2} />
    </div>
  );
}

function Banner(props: { mode: Mode; app: string; title: string; body: string; time: string; icon: Sym; color: string; width?: number }): Markup {
  const m = props.mode;
  return (
    <Glass mode={m} width={props.width ?? 386} height={63 + 6} radius={24} class="flex items-center gap-3 px-[14px]" style={`color:${label(m)}`}>
      <AppGlyph size={38} color={props.color} icon={props.icon} radius={10} />
      <div class="min-w-0 flex-1">
        <div class="flex justify-between" style="font-size:15px;line-height:20px;font-weight:600"><span>{props.title}</span><span style={`font-size:13px;font-weight:400;color:${secondary(m)}`}>{props.time}</span></div>
        <div class="truncate" style="font-size:15px;line-height:20px">{props.body}</div>
      </div>
    </Glass>
  );
}

export function Notifications(props: { mode: Mode }): Markup {
  const m = props.mode;
  return (
    <div class="flex flex-col items-center gap-5">
      <Banner mode={m} app="信息" title="小林" body="周六上午十点码头见，别忘了防晒 ☀️" time="现在" icon="message" color="#34c759" />
      <div class="relative">
        <div class="absolute inset-x-[16px] -bottom-[8px] opacity-80"><Glass mode={m} width={354} height={60} radius={22} /></div>
        <Banner mode={m} app="日历" title="团队周会" body="15:00 · 3 号会议室 · 还有 10 分钟" time="2 分钟前" icon="calendar" color="#ff3b30" />
      </div>
    </div>
  );
}

export function NotificationExpanded(props: { mode: Mode }): Markup {
  const m = props.mode;
  return (
    <div class="flex flex-col items-end gap-3">
      <Glass mode={m} width={370} height={300} radius={26} class="flex flex-col p-[14px]" style={`color:${label(m)}`}>
        <div class="flex items-center gap-3">
          <AppGlyph size={38} color="#34c759" icon="message" radius={10} />
          <div class="flex-1">
            <div style="font-size:15px;line-height:20px;font-weight:600">小林</div>
            <div style={`font-size:13px;line-height:18px;color:${secondary(m)}`}>信息 · 现在</div>
          </div>
        </div>
        <div class="mt-3" style="font-size:15px;line-height:20px">看看这张！昨天在金门大桥拍的</div>
        <div class="mt-3"><Photo width={342} height={170} radius={16} /></div>
      </Glass>
      <MenuList mode={m} width={250} items={[{ text: "回复", icon: "message" }, { text: "静音 1 小时", icon: "bell" }]} />
    </div>
  );
}

export function LockScreen(props: { mode: Mode }): Markup {
  const m = props.mode;
  const w = "#fff";
  const ring = (pct: number, center: string, sub: string) => (
    <Glass mode={m} width={72} height={72} radius={36} class="grid place-items-center" style={`color:${label(m)}`}>
      <svg width="62" height="62" viewBox="0 0 62 62" class="absolute">
        <circle cx="31" cy="31" r="27" fill="none" stroke="currentColor" stroke-opacity="0.2" stroke-width="5" />
        <circle cx="31" cy="31" r="27" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-dasharray={`${(pct * 169.6).toFixed(1)} 170`} transform="rotate(-90 31 31)" />
      </svg>
      <div class="relative text-center" style="line-height:1"><div style="font-size:18px;font-weight:700">{center}</div><div style="font-size:10px;font-weight:600;margin-top:2px">{sub}</div></div>
    </Glass>
  );
  return (
    <Screen height={640}>
      <div class="absolute inset-0" style="background:linear-gradient(rgb(0 0 0 / .28),transparent 45%,transparent 75%,rgb(0 0 0 / .2))" />
      <Status mode={m} color={w} />
      <div class="absolute inset-x-0 top-[70px] text-center" style={`color:${w};text-shadow:0 1px 12px rgb(0 0 0 / .25)`}>
        <div style="font-size:20px;line-height:24px;font-weight:600">11月14日 星期六</div>
        <div style="font-size:104px;line-height:108px;font-weight:700;letter-spacing:-2px">9:41</div>
      </div>
      <div class="absolute left-[38px] top-[206px] flex gap-[9px]">
        {ring(0.76, "76", "%")}
        {ring(0.4, "18°", "旧金山")}
        <Glass mode={m} width={162} height={72} radius={20} class="flex flex-col justify-center px-3" style={`color:${label(m)}`}>
          <div style="font-size:13px;line-height:16px;font-weight:700">团队周会</div>
          <div style="font-size:13px;line-height:16px">15:00 – 16:00</div>
          <div style={`font-size:13px;line-height:16px;color:${secondary(m)}`}>3 号会议室</div>
        </Glass>
      </div>
      <div class="absolute inset-x-[8px] top-[440px]">
        <Banner mode={m} app="信息" title="小林" body="周六上午十点码头见" time="现在" icon="message" color="#34c759" />
      </div>
      <div class="absolute bottom-[42px] left-[46px]"><Round mode={m} icon="flashlight" size={50} /></div>
      <div class="absolute bottom-[42px] right-[46px]"><Round mode={m} icon="camera" size={50} /></div>
      <div class="absolute bottom-[8px] left-[129px] h-[5px] w-[144px] rounded-full bg-white" />
    </Screen>
  );
}

export function HomeWidgets(props: { mode: Mode }): Markup {
  const m = props.mode;
  const c = label(m), d = secondary(m);
  return (
    <div class="flex w-[350px] flex-col gap-[18px]">
      <div class="flex justify-between">
        <Glass mode={m} width={164.67} height={164.67} radius={28} class="flex flex-col p-4" style={`color:${c}`}>
          <div style="font-size:15px;line-height:18px;font-weight:600">旧金山 <S name="location" size={11} weight={2.6} /></div>
          <div style="font-size:44px;line-height:48px;font-weight:300">18°</div>
          <div class="mt-auto" style={`color:#ffcc00`}><S name="sun" size={22} weight={2.2} /></div>
          <div style="font-size:13px;line-height:16px;font-weight:600">晴</div>
          <div style={`font-size:13px;line-height:16px;color:${d}`}>最高 21° 最低 12°</div>
        </Glass>
        <Glass mode={m} width={164.67} height={164.67} radius={28} class="flex flex-col p-4" style={`color:${c}`}>
          <div style="font-size:12px;line-height:14px;font-weight:700;color:#ff3b30">星期六</div>
          <div style="font-size:36px;line-height:40px;font-weight:400">14</div>
          <div class="mt-auto flex flex-col gap-[6px]">
            {[["团队周会", "15:00", "#0a84ff"], ["健身", "18:30", "#34c759"]].map(([t, h, col]) => (
              <div class="flex gap-[6px]"><div class="w-1 rounded-full" style={`background:${col}`} /><div><div style="font-size:13px;line-height:15px;font-weight:600">{t}</div><div style={`font-size:12px;line-height:14px;color:${d}`}>{h}</div></div></div>
            ))}
          </div>
        </Glass>
      </div>
      <Glass mode={m} width={349.67} height={164.33} radius={28} class="flex gap-4 p-4" style={`color:${c}`}>
        <Photo width={132} height={132} radius={16} hue={280} />
        <div class="flex flex-1 flex-col">
          <div style={`font-size:12px;line-height:14px;font-weight:600;color:${d}`}>正在播放</div>
          <div class="mt-1" style="font-size:17px;line-height:21px;font-weight:600">Golden Hour</div>
          <div style={`font-size:15px;line-height:19px;color:${d}`}>JVKE</div>
          <div class="mt-auto flex items-center justify-between pr-1">
            <S name="backward" size={24} /><S name="pause" size={28} weight={3} /><S name="forward" size={24} />
          </div>
        </div>
      </Glass>
      <div class="flex justify-between px-[10px]">
        {([["电话", "#34c759", "phone"], ["Safari", "#0a84ff", "globe"], ["信息", "#34c759", "message"], ["音乐", "#ff2d55", "music"]] as [string, string, Sym][]).map(([n, col, i]) => (
          <div class="flex flex-col items-center gap-1"><AppGlyph size={64} color={col} icon={i} /><span style="font-size:12px;line-height:14px;color:#fff;text-shadow:0 1px 3px rgb(0 0 0 / .4)">{n}</span></div>
        ))}
      </div>
    </div>
  );
}

export function ControlCenter(props: { mode: Mode }): Markup {
  const m = props.mode;
  const U = 72, G = 14;
  const span = (n: number) => n * U + (n - 1) * G;
  const tile = (w: number, h: number, children: Child, opts: { tint?: string; color?: string; round?: boolean; cls?: string } = {}) => (
    <Glass mode={m} width={span(w)} height={span(h)} radius={opts.round ? span(Math.min(w, h)) / 2 : 30} tint={opts.tint} class={opts.cls ?? "grid place-items-center"} style={`color:${opts.color ?? (opts.tint ? "#fff" : label(m))}`}>{children}</Glass>
  );
  const dot = (icon: Sym, on: string | null) => (
    <div class="grid size-[54px] place-items-center rounded-full" style={`background:${on ?? quiet(m)};color:${on ? "#fff" : label(m)}`}><S name={icon} size={24} /></div>
  );
  const vslider = (icon: Sym, pct: number) => (
    <Glass mode={m} width={U} height={span(2)} radius={30} class="relative overflow-hidden" style={`color:${label(m)}`}>
      <div class="absolute inset-x-0 bottom-0" style={`height:${pct}%;background:${m === "light" ? "#fff" : "rgb(255 255 255 / .85)"}`} />
      <div class="absolute inset-x-0 bottom-[14px] grid place-items-center" style={`color:${m === "light" ? "#8e8e93" : "#3a3a3c"}`}><S name={icon} size={24} /></div>
    </Glass>
  );
  return (
    <div class="grid gap-[14px]" style={`grid-template-columns:repeat(4,${U}px)`}>
      <div style="grid-column:span 2;grid-row:span 2">
        {tile(2, 2, <div class="grid grid-cols-2 gap-[12px]">{dot("airplane", null)}{dot("antenna", "#34c759")}{dot("wifi", BLUE)}{dot("bluetooth", BLUE)}</div>)}
      </div>
      <div style="grid-column:span 2;grid-row:span 2">
        {tile(2, 2, (
          <div class="flex size-full flex-col p-4">
            <Photo width={44} height={44} radius={10} hue={280} />
            <div class="mt-2" style="font-size:15px;line-height:18px;font-weight:600">Golden Hour</div>
            <div style={`font-size:13px;line-height:16px;color:${secondary(m)}`}>JVKE</div>
            <div class="mt-auto flex items-center justify-between px-1"><S name="backward" size={22} /><S name="pause" size={26} weight={3} /><S name="forward" size={22} /></div>
          </div>
        ), { cls: "" })}
      </div>
      <div>{tile(1, 1, <S name="rotate" size={26} />, { tint: "rgb(255 59 48 / 0.9)", round: true })}</div>
      <div>{tile(1, 1, <S name="airplay" size={26} />, { round: true })}</div>
      <div style="grid-row:span 2">{vslider("sun", 62)}</div>
      <div style="grid-row:span 2">{vslider("speaker", 40)}</div>
      <div style="grid-column:span 2">
        {tile(2, 1, <div class="flex w-full items-center gap-3 px-3"><div class="grid size-[46px] place-items-center rounded-full text-white" style="background:#5e5ce6"><S name="moon" size={22} /></div><div style="font-size:15px;line-height:18px;font-weight:600">专注<div style={`font-weight:400;font-size:13px;color:${secondary(m)}`}>勿扰模式</div></div></div>, { round: true })}
      </div>
      <div>{tile(1, 1, <S name="flashlight" size={26} />, { round: true })}</div>
      <div>{tile(1, 1, <S name="timer" size={26} />, { round: true })}</div>
      <div>{tile(1, 1, <S name="camera" size={26} />, { round: true })}</div>
      <div>{tile(1, 1, <S name="lock" size={26} />, { round: true })}</div>
    </div>
  );
}

export function DynamicIsland(props: { mode: Mode }): Markup {
  const pill = (w: number, h: number, r: number, body: Child) => <div class="relative bg-black text-white" style={`width:${w}px;height:${h}px;border-radius:${r}px`}>{body}</div>;
  return (
    <div class="flex flex-col items-center gap-4">
      {pill(200, 37, 18.5, <div class="flex h-full items-center justify-between px-[10px]"><span style="color:#ff9f0a"><S name="timer" size={20} weight={2.4} /></span><span style="color:#ff9f0a;font-size:15px;font-weight:600;font-variant-numeric:tabular-nums">4:59</span></div>)}
      <div class="flex items-center gap-2">
        {pill(160, 37, 18.5, <div class="flex h-full items-center justify-between px-[8px]"><Photo width={24} height={24} radius={6} hue={280} /><div class="flex h-[14px] items-end gap-[2px]">{[6, 12, 8, 14, 5].map((h) => <div class="w-[3px] rounded-full" style={`height:${h}px;background:#bf5af2`} />)}</div></div>)}
        {pill(37, 37, 18.5, <div class="grid h-full place-items-center" style="color:#34c759"><S name="phone" size={18} weight={2.4} /></div>)}
      </div>
      {pill(370, 168, 46, (
        <div class="flex h-full flex-col px-5 pt-[18px]">
          <div class="flex items-center gap-3">
            <Photo width={52} height={52} radius={12} hue={280} />
            <div class="flex-1"><div style="font-size:15px;line-height:20px;font-weight:600">Golden Hour</div><div style="font-size:15px;line-height:20px;color:rgb(235 235 245 / .6)">JVKE</div></div>
            <div class="flex h-[22px] items-end gap-[3px]">{[8, 18, 12, 22, 9].map((h) => <div class="w-[4px] rounded-full" style={`height:${h}px;background:#bf5af2`} />)}</div>
          </div>
          <div class="mt-[14px] flex items-center gap-2" style="font-size:12px;color:rgb(235 235 245 / .6)">1:32<div class="relative h-[6px] flex-1 rounded-full" style="background:rgb(255 255 255 / .2)"><div class="h-full w-[45%] rounded-full bg-white" /></div>-1:57</div>
          <div class="mt-[10px] flex items-center justify-center gap-12"><S name="backward" size={26} /><S name="pause" size={30} weight={3} /><S name="forward" size={26} /></div>
        </div>
      ))}
    </div>
  );
}

export function Toasts(props: { mode: Mode }): Markup {
  const m = props.mode;
  return (
    <div class="flex items-center gap-6">
      <div class="flex flex-col items-center gap-4">
        <Glass mode={m} width={168} height={44} radius={22} class="flex items-center justify-center gap-2" style={`color:${label(m)};font-size:15px;font-weight:590`}>
          <span style="color:#34c759"><S name="checkmark" size={18} weight={2.8} /></span>已拷贝链接
        </Glass>
        <Glass mode={m} width={196} height={44} radius={22} class="flex items-center gap-2 px-[6px]" style={`color:${label(m)};font-size:15px;font-weight:590`}>
          <div class="grid size-8 place-items-center rounded-full text-white" style={`background:${RED}`}><S name="bell" size={17} weight={2.4} /></div>
          <div class="flex-1 leading-[17px]">静音模式<div style={`font-size:12px;font-weight:400;color:${secondary(m)}`}>已打开</div></div>
        </Glass>
        <Glass mode={m} width={196} height={44} radius={22} class="flex items-center gap-2 px-[6px]" style={`color:${label(m)};font-size:15px;font-weight:590`}>
          <div class="grid size-8 place-items-center rounded-full" style={`background:${quiet(m)}`}><S name="airplay" size={17} /></div>
          <div class="flex-1 leading-[17px]">AirPods Pro<div style={`font-size:12px;font-weight:400;color:${secondary(m)}`}>已连接 · 82%</div></div>
        </Glass>
      </div>
      <Glass mode={m} width={150} height={150} radius={34} class="flex flex-col items-center justify-center gap-3" style={`color:${label(m)}`}>
        <S name="speaker" size={52} weight={1.8} />
        <div class="h-[6px] w-[96px] rounded-full" style={`background:${quiet(m)}`}><div class="h-full w-[60%] rounded-full" style={`background:${label(m)}`} /></div>
      </Glass>
    </div>
  );
}

// ---------------------------------------------------------------- 媒体

const TABS: { icon: Sym; text: string }[] = [
  { icon: "house-fill", text: "主页" },
  { icon: "grid", text: "新发现" },
  { icon: "airplay", text: "广播" },
  { icon: "music", text: "资料库" },
];

export function MiniPlayer(props: { mode: Mode }): Markup {
  const m = props.mode;
  const sel = m === "dark" ? "rgb(255 255 255 / 0.1)" : "rgb(0 0 0 / 0.06)";
  return (
    <div class="flex flex-col gap-[8px]">
      <Glass mode={m} width={356} height={48} radius={24} class="flex items-center gap-3 pl-[6px] pr-4" style={`color:${label(m)}`}>
        <Photo width={36} height={36} radius={8} hue={280} />
        <div class="min-w-0 flex-1" style="font-size:15px;line-height:18px;font-weight:590">Golden Hour<div style={`font-size:13px;font-weight:400;color:${secondary(m)}`}>JVKE</div></div>
        <S name="play" size={22} weight={2.4} />
        <S name="forward" size={24} />
      </Glass>
      <div class="flex items-center gap-3">
        <Glass mode={m} width={290} height={62} radius={31} class="flex items-center px-1">
          {TABS.map((t, i) => (
            <div class="flex h-[54px] flex-1 flex-col items-center justify-center gap-[2px] rounded-full" style={`color:${i === 0 ? "#ff2d55" : label(m)};${i === 0 ? `background:${sel}` : ""}`}>
              <S name={t.icon} size={22} weight={1.8} /><span style="font-size:10px;line-height:12px;font-weight:590">{t.text}</span>
            </div>
          ))}
        </Glass>
        <Round mode={m} icon="search" size={54} iconSize={22} />
      </div>
    </div>
  );
}

export function NowPlaying(props: { mode: Mode }): Markup {
  const m = props.mode;
  const base = m === "light" ? "linear-gradient(180deg,#c86a9e,#6e3a8c 60%,#3b2160)" : "linear-gradient(180deg,#5a2346,#2a1240 60%,#120820)";
  const dimW = "rgb(255 255 255 / 0.6)";
  return (
    <Screen height={640}>
      <div class="absolute inset-0" style={`background:${base}`} />
      <Status mode="dark" />
      <div class="absolute left-[176px] top-[70px] h-[5px] w-[50px] rounded-full" style="background:rgb(255 255 255 / .4)" />
      <div class="absolute left-[56px] top-[96px]" style="box-shadow:0 20px 50px rgb(0 0 0 / .35);border-radius:14px"><Photo width={290} height={290} radius={14} hue={280} /></div>
      <div class="absolute inset-x-[41px] top-[410px] text-white">
        <div class="flex items-center justify-between">
          <div><div style="font-size:21px;line-height:26px;font-weight:700">Golden Hour</div><div style={`font-size:19px;line-height:24px;color:${dimW}`}>JVKE</div></div>
          <Glass mode="dark" width={30} height={30} radius={15} class="grid place-items-center" tint="rgb(255 255 255 / 0.18)"><S name="ellipsis" size={18} /></Glass>
        </div>
        <div class="mt-4 h-[6px] rounded-full" style="background:rgb(255 255 255 / .25)"><div class="h-full w-[44%] rounded-full" style="background:rgb(255 255 255 / .85)" /></div>
        <div class="mt-[6px] flex justify-between" style={`font-size:12px;color:${dimW};font-variant-numeric:tabular-nums`}><span>1:32</span><span>-1:57</span></div>
        <div class="mt-2 flex items-center justify-center gap-14"><S name="backward" size={34} /><S name="pause" size={40} weight={3.4} /><S name="forward" size={34} /></div>
      </div>
      <div class="absolute inset-x-[58px] bottom-[22px] flex justify-between">
        {(["quote", "airplay", "list"] as Sym[]).map((i) => <Round mode="dark" icon={i} size={44} iconSize={21} color="#fff" />)}
      </div>
    </Screen>
  );
}

// ---------------------------------------------------------------- 输入

export function WheelPicker(props: { mode: Mode }): Markup {
  const m = props.mode;
  const col = (vals: string[], sel: number, w: number, align: string) => (
    <div class="relative flex flex-col items-center" style={`width:${w}px`}>
      {vals.map((v, i) => {
        const d = Math.abs(i - sel);
        return <div class="h-8" style={`font-size:${d === 0 ? 22 : 20}px;line-height:32px;opacity:${[1, 0.55, 0.3, 0.14][d]};transform:perspective(200px) rotateX(${(sel - i) * 20}deg) scale(${1 - d * 0.04});text-align:${align};width:100%;color:${label(m)}`}>{v}</div>;
      })}
    </div>
  );
  return (
    <Glass mode={m} width={340} height={230} radius={34} class="flex flex-col items-center px-4 pt-[14px]">
      <div class="flex w-full items-center justify-between px-1" style={`${BODY};color:${label(m)}`}>
        <span style={`color:${secondary(m)}`}><S name="xmark" size={18} weight={2.4} /></span>
        <span style="font-weight:600">提醒时间</span>
        <span style={`color:${BLUE}`}><S name="checkmark" size={20} weight={2.6} /></span>
      </div>
      <div class="relative mt-3 flex justify-center">
        <div class="absolute inset-x-0 top-[64px] h-8 rounded-[8px]" style={`background:${quiet(m)}`} />
        {col(["", "上午", "下午", "", ""], 2, 70, "right")}
        {col(["7", "8", "9", "10", "11"], 2, 60, "right")}
        {col(["28", "29", "30", "31", "32"], 2, 70, "center")}
      </div>
    </Glass>
  );
}

export function CalendarPicker(props: { mode: Mode }): Markup {
  const m = props.mode;
  const days: (number | null)[] = [...Array.from({ length: 30 }, (_, i) => i + 1), null, null, null, null, null]; // 1 Nov 2026 is a Sunday
  return (
    <Glass mode={m} width={370} height={392} radius={34} class="flex flex-col px-4 pt-4" style={`color:${label(m)}`}>
      <div class="flex h-10 items-center justify-between px-2">
        <span style={`${BODY};font-weight:600`}>2026年11月 <span style={`color:${BLUE}`}>›</span></span>
        <span class="flex gap-6" style={`color:${BLUE}`}><S name="chevron-left" size={20} weight={2.6} /><S name="chevron-right" size={20} weight={2.6} /></span>
      </div>
      <div class="grid grid-cols-7 text-center" style={`font-size:13px;line-height:18px;font-weight:600;color:${secondary(m)}`}>{["日", "一", "二", "三", "四", "五", "六"].map((d) => <span>{d}</span>)}</div>
      <div class="mt-1 grid grid-cols-7 text-center">
        {days.map((d) => (
          <div class="grid h-[46px] place-items-center">
            {d && (
              <div class="grid size-[42px] place-items-center rounded-full" style={`font-size:20px;${d === 20 ? `background:${BLUE};color:#fff;font-weight:600` : d === 14 ? `color:${BLUE};font-weight:600` : ""}`}>{d}</div>
            )}
          </div>
        ))}
      </div>
      <div class="mt-auto flex h-[52px] items-center justify-between px-2" style={`border-top:1px solid ${divider(m)};${BODY}`}>
        时间
        <span class="rounded-full px-3" style={`background:${quiet(m)};line-height:34px`}>上午 9:30</span>
      </div>
    </Glass>
  );
}

function Stepper(props: { mode: Mode; minusOff?: boolean }): Markup {
  const m = props.mode;
  return (
    <div class="flex h-8 w-[92px] items-center rounded-full" style={`background:${quiet(m)};color:${label(m)}`}>
      <div class="grid h-8 flex-1 place-items-center" style={props.minusOff ? "opacity:.3" : ""}><S name="minus" size={18} weight={2.4} /></div>
      <div class="h-6 w-px" style={`background:${m === "light" ? "rgb(60 60 67 / .3)" : "rgb(235 235 245 / .3)"}`} />
      <div class="grid h-8 flex-1 place-items-center"><S name="plus" size={18} weight={2.4} /></div>
    </div>
  );
}

export function Steppers(props: { mode: Mode }): Markup {
  const m = props.mode;
  const rows: [string, string, boolean][] = [["份数", "3", false], ["每页张数", "1", true], ["字号", "17 pt", false]];
  return (
    <div class="w-[360px] overflow-hidden rounded-[26px]" style={`background:${m === "light" ? "#f2f2f7" : "#1c1c1e"}`}>
      {rows.map(([t, v, off], i) => (
        <div class="mx-4 flex h-[52px] items-center justify-between" style={`${BODY};color:${label(m)};${i ? `border-top:1px solid ${divider(m)}` : ""}`}>
          <span>{t}<span class="ml-2" style={`color:${secondary(m)}`}>{v}</span></span>
          <Stepper mode={m} minusOff={off} />
        </div>
      ))}
    </div>
  );
}

const KEYS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

export function KeyboardAccessory(props: { mode: Mode }): Markup {
  const m = props.mode;
  const key = m === "light" ? "rgb(255 255 255 / 0.85)" : "rgb(237 237 237 / 0.2)";
  const kc = label(m);
  return (
    <div class="flex flex-col items-center gap-[8px]">
      <div class="flex w-[390px] items-center justify-between">
        <Group mode={m} icons={["photo", "camera", "sparkles", "list"]} />
        <Glass mode={m} width={73} height={44} radius={22} tint="rgb(0 136 255 / 0.92)" class="grid place-items-center" style="color:#fff;font-size:17px;font-weight:590">完成</Glass>
      </div>
      <Glass mode={m} width={402} height={250} radius={32} class="flex flex-col gap-[11px] px-[6.67px] pt-[12px]">
        {KEYS.map((row, r) => (
          <div class="flex justify-center gap-[6px]">
            {r === 2 && <div class="grid h-[43px] w-[44px] place-items-center rounded-[8.5px]" style={`background:${quiet(m)};color:${kc}`}><S name="arrow-up" size={18} weight={2.2} /></div>}
            {[...row].map((k) => <div class="grid h-[43px] w-[33.5px] place-items-center rounded-[8.5px]" style={`background:${key};color:${kc};font-size:22px;box-shadow:0 1px 0 rgb(0 0 0 / .12)`}>{k}</div>)}
            {r === 2 && <div class="grid h-[43px] w-[44px] place-items-center rounded-[8.5px]" style={`background:${quiet(m)};color:${kc}`}><S name="chevron-left" size={18} weight={2.2} /></div>}
          </div>
        ))}
        <div class="flex gap-[6px]">
          <div class="grid h-[43px] w-[88px] place-items-center rounded-[8.5px]" style={`background:${quiet(m)};color:${kc};font-size:16px`}>123</div>
          <div class="grid h-[43px] flex-1 place-items-center rounded-[8.5px]" style={`background:${key};color:${kc};font-size:16px`}>空格</div>
          <div class="grid h-[43px] w-[88px] place-items-center rounded-[8.5px]" style={`background:${BLUE};color:#fff;font-size:16px`}>发送</div>
        </div>
      </Glass>
    </div>
  );
}

export function SearchTokens(props: { mode: Mode }): Markup {
  const m = props.mode;
  const rows: [Sym, string, string][] = [["search", "金门大桥", ""], ["search", "金门公园", ""], ["photo", "金门大桥日落", "照片 · 上周末"], ["location", "金门大桥观景台", "地点 · 2.4 公里"]];
  return (
    <div class="flex flex-col items-center gap-3">
      <Glass mode={m} width={340} height={260} radius={30} class="flex flex-col px-5 py-2" style={`color:${label(m)}`}>
        {rows.map(([i, t, d], k) => (
          <div class="flex h-[52px] items-center gap-3" style={k ? `border-top:1px solid ${divider(m)}` : ""}>
            <span style={`color:${secondary(m)}`}><S name={i} size={18} weight={2.2} /></span>
            <div class="flex-1" style={`${BODY}`}><b style="font-weight:600">金门</b>{t.slice(2)}{d && <div style={`font-size:13px;line-height:16px;color:${secondary(m)}`}>{d}</div>}</div>
            <span style={`color:${secondary(m)}`}><S name="arrow-up" size={16} weight={2} /></span>
          </div>
        ))}
      </Glass>
      <div class="flex items-center gap-2">
        <Glass mode={m} width={300} height={48} radius={24} class="flex items-center gap-2 pl-4 pr-3" style={`color:${label(m)};${BODY}`}>
          <span style={`color:${secondary(m)}`}><S name="search" size={19} weight={2.2} /></span>
          <span class="flex h-[30px] items-center gap-1 rounded-full px-[10px]" style={`background:${BLUE};color:#fff;font-size:15px;font-weight:590`}><S name="photo" size={14} weight={2.4} />照片</span>
          <span>金门</span><span class="-ml-1 h-[22px] w-[2px]" style={`background:${BLUE}`} />
          <span class="ml-auto" style={`color:${secondary(m)}`}><S name="xmark" size={14} weight={2.8} /></span>
        </Glass>
        <SymbolButton mode={m} icon="xmark" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- 列表

export function GroupedSheet(props: { mode: Mode }): Markup {
  const m = props.mode;
  const row = (icon: Sym, color: string, t: string, v: string, last: boolean, sw?: boolean) => (
    <div class="flex h-[52px] items-center gap-3 pl-4">
      <AppGlyph size={30} color={color} icon={icon} radius={8} />
      <div class="flex h-full flex-1 items-center justify-between pr-4" style={`${BODY};${last ? "" : `border-bottom:1px solid ${divider(m)}`}`}>
        {t}
        {sw
          ? <div class="relative h-7 w-16 rounded-full" style="background:#34c759"><div class="absolute left-6 top-[2px] h-6 w-[38px] rounded-full bg-white" /></div>
          : <span class="flex items-center gap-1" style={`color:${secondary(m)}`}>{v}<S name="chevron-right" size={15} weight={2.4} /></span>}
      </div>
    </div>
  );
  return (
    <div class="absolute inset-x-[6px] bottom-[6px]">
      <Glass mode={m} width={408} height={428} radius={38} class="flex flex-col px-4" style={`color:${label(m)}`}>
        <div class="flex items-center justify-between pt-[14px]">
          <SymbolButton mode={m} icon="xmark" />
          <span style={`${BODY};font-weight:600`}>共享相簿</span>
          <Glass mode={m} width={44} height={44} radius={22} tint="rgb(0 136 255 / 0.92)" class="grid place-items-center" style="color:#fff"><S name="checkmark" size={20} weight={2.6} /></Glass>
        </div>
        <div class="mt-4 px-4 pb-[6px]" style={`font-size:13px;line-height:18px;color:${secondary(m)}`}>成员</div>
        <div class="overflow-hidden rounded-[26px]" style={`background:${cell(m)}`}>
          {row("person-fill", "#0a84ff", "小林", "可编辑", false)}
          {row("person-fill", "#ff9f0a", "妈妈", "仅查看", true)}
        </div>
        <div class="mt-5 px-4 pb-[6px]" style={`font-size:13px;line-height:18px;color:${secondary(m)}`}>选项</div>
        <div class="overflow-hidden rounded-[26px]" style={`background:${cell(m)}`}>
          {row("bell", "#ff3b30", "通知", "", false, true)}
          {row("globe", "#34c759", "公开网站", "关", false)}
          {row("lock", "#8e8e93", "隐私", "", true)}
        </div>
      </Glass>
    </div>
  );
}

export function SwipeRows(props: { mode: Mode }): Markup {
  const m = props.mode;
  const bg = m === "light" ? "#fff" : "#1c1c1e";
  const mail = (from: string, sub: string, t: string, unread?: boolean) => (
    <div class="flex h-[76px] w-[402px] shrink-0 items-start gap-3 px-4 pt-3" style={`background:${bg};color:${label(m)}`}>
      <div class="mt-[6px] size-[10px] rounded-full" style={`background:${unread ? BLUE : "transparent"}`} />
      <div class="min-w-0 flex-1">
        <div class="flex justify-between" style={`${BODY};font-weight:600`}>{from}<span style={`font-size:15px;font-weight:400;color:${secondary(m)}`}>{t}</span></div>
        <div class="truncate" style={`font-size:15px;line-height:20px;color:${secondary(m)}`}>{sub}</div>
      </div>
    </div>
  );
  const act = (icon: Sym, color: string, text: string) => (
    <div class="flex flex-col items-center gap-1">
      <Glass mode={m} width={56} height={44} radius={22} tint={color} class="grid place-items-center" style="color:#fff"><S name={icon} size={20} weight={2.2} /></Glass>
      <span style={`font-size:12px;line-height:14px;color:${secondary(m)}`}>{text}</span>
    </div>
  );
  const sep = <div class="ml-[42px] h-px" style={`background:${divider(m)}`} />;
  return (
    <div class="w-[402px] overflow-hidden" style={`background:${bg}`}>
      {mail("小林", "周六码头见 · 别忘了带防晒和雨衣", "9:41", true)}
      {sep}
      <div class="relative flex h-[76px] overflow-hidden">
        <div class="absolute right-[10px] top-[6px] flex gap-[8px]">{act("ellipsis", "rgb(142 142 147 / 0.95)", "更多")}{act("flag", "rgb(255 159 10 / 0.95)", "旗标")}{act("trash", "rgb(255 56 60 / 0.95)", "删除")}</div>
        <div class="absolute top-0" style="left:-206px">{mail("Apple", "你的收据 · 订单号 MX2Q8 已发货，预计周二送达", "昨天")}</div>
      </div>
      {sep}
      <div class="relative flex h-[76px] overflow-hidden">
        <div class="absolute left-[10px] top-[6px]">{act("message", "rgb(0 136 255 / 0.95)", "标为未读")}</div>
        <div class="absolute top-0" style="left:84px">{mail("团队周会", "会议纪要：Q4 计划评审，下周一前回复", "周四")}</div>
      </div>
      {sep}
      {mail("妈妈", "照片已收到，周末回家吃饭吗？", "周三")}
    </div>
  );
}

