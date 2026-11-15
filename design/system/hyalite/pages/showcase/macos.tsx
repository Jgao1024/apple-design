import type { Markup } from "@design/jsx/jsx-runtime";
import { GalleryPage, type GallerySection } from "../../components/gallery.tsx";
import * as c from "../../components/macos-more.tsx";

// The macOS 27 components that the standard pages (05, 06) do not have, with the standard glass.
// One self-contained file; see docs/glass-gallery-next.md §6.

const SECTIONS: GallerySection[] = [
  {
    title: "系统",
    items: [
      { title: "菜单栏与状态项", note: "45 高，部件 24 高、距顶 10 px；选中的 Wi-Fi 状态项是玻璃胶囊，下面弹出 Wi-Fi 菜单。", width: 490, height: 280, render: (m) => <c.MenuBar mode={m} /> },
      { title: "Dock", note: "55 高、圆角 15，图标 36、间隔 9；鼠标下方的图标放大，运行中的 App 下面有 4 px 圆点，上方是名称提示。", width: 490, height: 190, render: (m) => <c.DockBar mode={m} /> },
      { title: "控制中心", note: "320 宽玻璃面板，里面的模块是半透明实色：网络、专注、屏幕镜像、显示器、声音、正在播放。", width: 490, height: 400, render: (m) => <c.ControlCenterPanel mode={m} /> },
      { title: "通知横幅与通知中心", note: "横幅 344 x 77 圆角 20（这里缩窄），叠放时露出 8 px；右边是通知中心的小组件和通知列表。", width: 490, height: 400, render: (m) => <c.Notifications mode={m} /> },
      { title: "Spotlight", note: "52 高的玻璃搜索胶囊，右边是 App / 文件 / 快捷指令三个过滤按钮；结果面板里选中行是强调蓝。", width: 490, height: 300, render: (m) => <c.Spotlight mode={m} /> },
      { title: "音量 / 亮度 HUD", note: "屏幕右上角的玻璃提示，290 x 64：名称、百分比、实色进度条。", width: 490, height: 260, render: (m) => <c.Huds mode={m} /> },
      { title: "桌面小组件", note: "小 170 见方、中 356 x 170，圆角 22：时钟、天气、提醒事项。", width: 490, height: 400, render: (m) => <c.DesktopWidgets mode={m} /> },
    ],
  },
  {
    title: "窗口",
    items: [
      { title: "完整工具栏", note: "侧边栏、前进后退组、标题、显示方式分段、弹出按钮、共享、更多、搜索；内容从玻璃胶囊下面滚过。", width: 700, height: 270, render: (m) => <c.FullToolbar mode={m} /> },
      { title: "窗口标签页", note: "工具栏下面一条 32 高的玻璃胶囊，选中的标签有底色，悬停的标签显示关闭按钮；右边是新建标签页。", width: 490, height: 270, render: (m) => <c.WindowTabs mode={m} /> },
      { title: "检查器面板", note: "浮在窗口右侧的玻璃面板，内缩 8 px、圆角 16；里面的分段、弹出菜单、文本框和色板是实色。", width: 490, height: 360, render: (m) => <c.Inspector mode={m} /> },
      { title: "Sheet（从标题栏落下）", note: "300 宽、圆角 16，白 / #1E1E1E 实色；窗口变成非活跃（红绿灯变灰），内容压暗。", width: 490, height: 350, render: (m) => <c.SheetFromTitlebar mode={m} /> },
      { title: "工具面板", note: "300 x 300，圆角 15；65 高的标题区放 10 px 红绿灯和五个 44 x 30 的标签。", width: 490, height: 330, render: (m) => <c.UtilityPanel mode={m} /> },
    ],
  },
  {
    title: "菜单",
    items: [
      { title: "右键菜单与子菜单", note: "244 宽规格（这里 200），24 pt 一行；悬停“共享”时子菜单贴着右边弹出。", width: 490, height: 340, render: (m) => <c.ContextMenu mode={m} /> },
      { title: "Tooltip", note: "11 pt，#ECECEC 88 % 底，左右 6、上下 3 内边距，出现在指针右下方。", width: 490, height: 150, render: (m) => <c.Tooltips mode={m} /> },
    ],
  },
  {
    title: "数据",
    items: [
      { title: "表格", note: "列头 28 高、11 pt，排序列加粗带箭头；斑马纹黑 5 %；选中行 #0165E2，左右内缩 10、圆角 8。", width: 580, height: 320, render: (m) => <c.DataTable mode={m} /> },
      { title: "日期选择器（日历）", note: "日期字段带 Stepper，下面弹出玻璃日历：今天红字，选中蓝底，相邻月份灰字。", width: 490, height: 300, bg: "plain", render: (m) => <c.DatePicker mode={m} /> },
      { title: "Stepper 与日期字段", note: "Stepper 20 x 24、圆角 6，上下两半各 12；日期和时间字段可以逐段选中。实色。", width: 490, height: 200, bg: "plain", render: (m) => <c.SteppersAndFields mode={m} /> },
      { title: "进度条 / 圆形进度 / Spinner", note: "左：线性 6 和 10 高、不确定进度、16 / 32 的圆环、小 / 大 Spinner（实色）。右：玻璃下载列表。", width: 580, height: 220, render: (m) => <c.Progress mode={m} /> },
    ],
  },
];

export default function MacosMore(): Markup {
  return (
    <GalleryPage
      title="Liquid Glass 标准参数 · macOS 27 其余组件"
      subtitle="标准页（05、06）之外的 macOS 27 组件：系统、窗口、菜单、数据。玻璃用 hyalite 实时折射，参数是标准档（design/system/hyalite/presets.ts）；尺寸取自 macos27 kit 记录的 Figma 规格。单文件，不依赖任何外部资源。"
      sections={SECTIONS}
    />
  );
}
