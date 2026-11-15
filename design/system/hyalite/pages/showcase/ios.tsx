import type { Markup } from "@design/jsx/jsx-runtime";
import { GalleryPage, type GallerySection } from "../../components/gallery.tsx";
import * as c from "../../components/ios-more.tsx";

// The iOS 27 components that the standard page (05) does not have, with the standard glass.
// One self-contained file; see docs/glass-gallery-next.md §5.

const SECTIONS: GallerySection[] = [
  {
    title: "导航",
    items: [
      { title: "大标题导航栏 · 滚动前", note: "34 pt 大标题在工具栏下面，左右是 44 pt 玻璃按钮。", width: 402, height: 300, bg: "plain", render: (m) => <c.LargeTitleBar mode={m} scrolled={false} /> },
      { title: "大标题导航栏 · 滚动后", note: "标题缩成 17 pt 放进工具栏中间，内容从玻璃按钮下面滚过，顶部渐隐。", width: 402, height: 300, bg: "plain", render: (m) => <c.LargeTitleBar mode={m} scrolled /> },
      { title: "底部工具栏", note: "84 pt 高，48 pt 按钮，左右各 28 pt；中间按钮组，右边 Prominent。", width: 402, height: 150, render: (m) => <c.BottomToolbar mode={m} /> },
      { title: "页面指示器", note: "8 pt 圆点间隔 8 pt，放在 24 pt 玻璃胶囊里；页数多时两端缩成 6 和 4；主屏带搜索和加号。", width: 402, height: 170, render: (m) => <c.PageIndicator mode={m} /> },
    ],
  },
  {
    title: "浮层",
    items: [
      { title: "上下文菜单", note: "长按：背景压暗模糊，预览放大，下面是 238 宽的玻璃菜单。", width: 402, height: 460, render: (m) => <c.ContextMenu mode={m} /> },
      { title: "操作表 Action Sheet", note: "300 宽，圆角 34，272 x 48 的动作胶囊；破坏性动作红字。", width: 402, height: 340, render: (m) => <c.ActionSheet mode={m} /> },
      { title: "编辑菜单", note: "选中文字上方的玻璃胶囊，44 高；文字和选区是实色。", width: 402, height: 220, render: (m) => <c.EditMenu mode={m} /> },
      { title: "Popover（iPad）", note: "从工具栏按钮弹出，300 宽，圆角 26；触发按钮带选中描边。", width: 402, height: 300, render: (m) => <c.IpadPopover mode={m} /> },
      { title: "分享面板", note: "Sheet 四边内缩 6 pt：内容预览、AirDrop 联系人、App、操作列表。", width: 420, height: 470, render: (m) => <c.ShareSheet mode={m} /> },
    ],
  },
  {
    title: "系统",
    items: [
      { title: "通知横幅", note: "386 宽，圆角 24，图标 38；叠放时下面一条露出 8 pt。", width: 420, height: 200, render: (m) => <c.Notifications mode={m} /> },
      { title: "展开通知", note: "长按展开到 370 宽，圆角 26，带图片；下面是 250 宽的操作菜单。", width: 420, height: 450, render: (m) => <c.NotificationExpanded mode={m} /> },
      { title: "锁屏", note: "日期、104 pt 时间、圆形 72 和矩形 162 x 72 的小组件、通知、手电筒和相机按钮。", width: 402, height: 640, render: (m) => <c.LockScreen mode={m} /> },
      { title: "主屏小组件", note: "小 164.67 见方，中 349.67 x 164.33，圆角 28；下面一排 64 pt App 图标做对照。", width: 402, height: 470, render: (m) => <c.HomeWidgets mode={m} /> },
      { title: "控制中心模块", note: "72 pt 一格、间隔 14 pt：连接、正在播放、亮度和音量、专注、单格按钮。", width: 402, height: 520, render: (m) => <c.ControlCenter mode={m} /> },
      { title: "灵动岛", note: "紧凑（计时器）、两段式（音乐 + 通话）、展开（370 宽）。灵动岛是实黑色，不是玻璃。", width: 402, height: 330, render: (m) => <c.DynamicIsland mode={m} /> },
      { title: "Toast / HUD", note: "顶部 44 高的玻璃胶囊提示，和 150 见方的音量 HUD。", width: 420, height: 220, render: (m) => <c.Toasts mode={m} /> },
    ],
  },
  {
    title: "媒体",
    items: [
      { title: "迷你播放器", note: "Tab Bar 上方的 48 高玻璃配件栏：封面、标题、播放、下一首。", width: 402, height: 180, render: (m) => <c.MiniPlayer mode={m} /> },
      { title: "全屏播放器", note: "封面取色做底，控件是白色实色，底部歌词 / 隔空播放 / 队列是玻璃圆钮。", width: 402, height: 640, bg: "plain", render: (m) => <c.NowPlaying mode={m} /> },
    ],
  },
  {
    title: "输入",
    items: [
      { title: "滚轮选择器", note: "在玻璃面板里，选中行是 32 高的灰色圆角条，上下行逐级变淡、倾斜。", width: 402, height: 260, render: (m) => <c.WheelPicker mode={m} /> },
      { title: "日期选择（日历）", note: "370 宽：月份标题、星期行、5 周；今天蓝字，选中蓝底；底部 52 pt 时间行。", width: 402, height: 420, render: (m) => <c.CalendarPicker mode={m} /> },
      { title: "Stepper", note: "92 x 32，两半各 46，#767680 12 % 填充，中间 1 x 24 分隔；到下限时减号变淡。实色。", width: 402, height: 200, bg: "plain", render: (m) => <c.Steppers mode={m} /> },
      { title: "键盘配件栏", note: "键盘上方的玻璃按钮组和完成按钮；键盘本身也是一块玻璃，按键 43 高、圆角 8.5。", width: 420, height: 330, render: (m) => <c.KeyboardAccessory mode={m} /> },
      { title: "搜索建议与 Token", note: "搜索框里的蓝色 Token 和光标；上方玻璃面板列出建议，匹配部分加粗。", width: 402, height: 340, render: (m) => <c.SearchTokens mode={m} /> },
    ],
  },
  {
    title: "列表",
    items: [
      { title: "Inset Grouped 列表在玻璃 Sheet 里", note: "Sheet 内缩 6 pt，圆角 38；分组单元格是半透明实色，圆角 26，行高 52。", width: 420, height: 450, render: (m) => <c.GroupedSheet mode={m} /> },
      { title: "滑动操作行", note: "左滑露出更多 / 旗标 / 删除，右滑露出标为未读；操作按钮是有色玻璃。", width: 402, height: 320, bg: "plain", render: (m) => <c.SwipeRows mode={m} /> },
    ],
  },
];

export default function IosMore(): Markup {
  return (
    <GalleryPage
      title="Liquid Glass 标准参数 · iOS 27 其余组件"
      subtitle="标准页（05）之外的 iOS 27 组件：导航、浮层、系统、媒体、输入、列表。玻璃用 hyalite 实时折射，参数是标准档（design/system/hyalite/presets.ts）；尺寸取自 ios27 kit 记录的 Figma 规格。单文件，不依赖任何外部资源。"
      sections={SECTIONS}
    />
  );
}
