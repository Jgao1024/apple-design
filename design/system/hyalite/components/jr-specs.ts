// The specs shown on pages/09-json-render: one per component (JSON on the left, the glass render on
// the right), the expression demos, the multimodal extensions, and the answers of the three chat screens.
// Props names are the official ones (design/.ref/json-render/jr-shadcn.ts, jr-chat-catalog.ts).

export type El = { type: string; props?: Record<string, unknown>; children?: string[]; visible?: unknown; repeat?: unknown };
export type Spec = { root: string; elements: Record<string, El>; state?: Record<string, unknown> };

export type Demo = {
  id: string;
  title: string;
  note: string;
  spec: Spec;
  /// Draw the component on a glass panel (the panel is not in the JSON): for content that is not a container.
  frame?: boolean;
  /// Overlays (Tooltip, Popover, DropdownMenu) and the Accordion start open.
  open?: boolean;
  /// props of the extension components: [name, type, description]
  props?: string[][];
};

const el = (type: string, props: Record<string, unknown> = {}, children: string[] = [], extra: Partial<El> = {}): El => ({ type, props, children, ...extra });
const spec = (root: string, elements: Record<string, El>, state?: Record<string, unknown>): Spec => ({ root, elements, ...(state ? { state } : {}) });
const one = (type: string, props: Record<string, unknown>, state?: Record<string, unknown>, id = type.toLowerCase() + "-1"): Spec => spec(id, { [id]: el(type, props) }, state);

/// JSON for the left column: short values stay on one line, long ones break.
export function fmt(value: unknown, indent = 0): string {
  const inline = (v: unknown): string =>
    Array.isArray(v) ? (v.length ? `[ ${v.map(inline).join(", ")} ]` : "[]")
    : v && typeof v === "object" ? (Object.keys(v).length ? `{ ${Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${inline(x)}`).join(", ")} }` : "{}")
    : JSON.stringify(v);
  const flat = inline(value);
  if (flat.length + indent * 2 <= 76 || !value || typeof value !== "object") return flat;
  const pad = "  ".repeat(indent + 1);
  if (Array.isArray(value)) return `[\n${value.map((x) => pad + fmt(x, indent + 1)).join(",\n")}\n${"  ".repeat(indent)}]`;
  return `{\n${Object.entries(value).map(([k, x]) => `${pad}${JSON.stringify(k)}: ${fmt(x, indent + 1)}`).join(",\n")}\n${"  ".repeat(indent)}}`;
}

export type Section = { id: string; title: string; description: string; demos: Demo[] };

/* ───────────── official: layout ───────────── */

const LAYOUT: Demo[] = [
  {
    id: "Card", title: "Card", note: "容器卡片，玻璃。title、description、maxWidth（sm / md / lg / full）、centered。",
    spec: spec("card-1", {
      "card-1": el("Card", { title: "本月概览", description: "账户摘要", maxWidth: "md" }, ["text-1", "btn-1"]),
      "text-1": el("Text", { text: "收入 ¥12,480，支出 ¥8,306，结余 ¥4,174。" }),
      "btn-1": el("Button", { label: "查看明细", variant: "primary" }),
    }),
  },
  {
    id: "Stack", title: "Stack", note: "弹性布局。direction、gap（none–xl）、align、justify。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { direction: "horizontal", gap: "sm", align: "center", justify: "between" }, ["badge-1", "badge-2", "badge-3", "avatar-1"]),
      "badge-1": el("Badge", { text: "设计", variant: "default" }),
      "badge-2": el("Badge", { text: "前端", variant: "secondary" }),
      "badge-3": el("Badge", { text: "后端", variant: "outline" }),
      "avatar-1": el("Avatar", { name: "高杰", size: "sm" }),
    }),
  },
  {
    id: "Grid", title: "Grid", note: "网格，columns 1–6，窄屏自动减列。",
    frame: true,
    spec: spec("grid-1", {
      "grid-1": el("Grid", { columns: 3, gap: "sm" }, ["img-1", "img-2", "img-3"]),
      "img-1": el("Image", { alt: "海边", width: 120, height: 120 }),
      "img-2": el("Image", { alt: "山间", width: 120, height: 120 }),
      "img-3": el("Image", { alt: "城市", width: 120, height: 120 }),
    }),
  },
  {
    id: "Separator", title: "Separator", note: "分隔线，horizontal 或 vertical。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "sm" }, ["text-1", "sep-1", "row-1"]),
      "text-1": el("Text", { text: "上面的内容" }),
      "sep-1": el("Separator", { orientation: "horizontal" }),
      "row-1": el("Stack", { direction: "horizontal", gap: "md" }, ["text-2", "sep-2", "text-3"]),
      "text-2": el("Text", { text: "左" }),
      "sep-2": el("Separator", { orientation: "vertical" }),
      "text-3": el("Text", { text: "右" }),
    }),
  },
  {
    id: "Tabs", title: "Tabs", note: "标签页：玻璃胶囊，选中项是实色滑块。value 用 $bindState 绑定；子元素用 TabContent（也兼容“子元素个数 = 标签个数”的写法）。可以点。",
    spec: spec("card-1", {
      "card-1": el("Card", { title: "账户" }, ["tabs-1"]),
      "tabs-1": el("Tabs", { tabs: [{ label: "概览", value: "overview" }, { label: "账单", value: "billing" }, { label: "设置", value: "settings" }], value: { $bindState: "/tab" } }, ["tc-1", "tc-2", "tc-3"]),
      "tc-1": el("TabContent", { value: "overview" }, ["t-1"]),
      "tc-2": el("TabContent", { value: "billing" }, ["t-2"]),
      "tc-3": el("TabContent", { value: "settings" }, ["t-3"]),
      "t-1": el("Text", { text: { $template: "当前标签：${/tab}。本月活跃 18 天。" } }),
      "t-2": el("Text", { text: "上次账单 ¥299，11 月 1 日自动扣款。" }),
      "t-3": el("Text", { text: "通知、语言和安全设置。" }),
    }, { tab: "overview" }),
  },
  {
    id: "Accordion", title: "Accordion", note: "折叠面板，type: single（默认，同时只开一项）或 multiple。可以点。",
    open: true, frame: true,
    spec: one("Accordion", { type: "single", items: [{ title: "怎么退款？", content: "订单页点“申请退款”，7 天内原路退回。" }, { title: "支持哪些支付方式？", content: "银行卡、支付宝、微信支付和 Apple Pay。" }, { title: "能开发票吗？", content: "可以，支付完成后在订单详情里申请电子发票。" }] }),
  },
  {
    id: "Collapsible", title: "Collapsible", note: "单个折叠区，子元素放在里面。defaultOpen 控制初始状态。",
    frame: true,
    spec: spec("col-1", {
      "col-1": el("Collapsible", { title: "高级选项", defaultOpen: true }, ["sw-1", "sw-2"]),
      "sw-1": el("Switch", { label: "自动保存草稿", name: "autosave", checked: { $bindState: "/autosave" } }),
      "sw-2": el("Switch", { label: "同步到所有设备", name: "sync", checked: true }),
    }, { autosave: true }),
  },
  {
    id: "Dialog", title: "Dialog", note: "模态对话框，openPath 指向一个布尔 state。这里画成打开状态；点 × 关闭后会出现“打开”按钮。",
    spec: spec("dlg-1", {
      "dlg-1": el("Dialog", { title: "删除这个项目？", description: "删除后无法恢复。", openPath: "/dialogOpen" }, ["row-1"]),
      "row-1": el("Stack", { direction: "horizontal", gap: "sm", justify: "end" }, ["btn-1", "btn-2"]),
      "btn-1": el("Button", { label: "取消", variant: "secondary" }),
      "btn-2": el("Button", { label: "删除", variant: "danger" }),
    }, { dialogOpen: true }),
  },
  {
    id: "Drawer", title: "Drawer", note: "底部抽屉，openPath 同 Dialog。",
    spec: spec("drw-1", {
      "drw-1": el("Drawer", { title: "筛选", description: "按状态过滤任务", openPath: "/drawerOpen" }, ["radio-1", "btn-1"]),
      "radio-1": el("Radio", { label: "状态", name: "status", options: ["进行中", "已完成", "已归档"], value: { $bindState: "/status" } }),
      "btn-1": el("Button", { label: "应用", variant: "primary" }),
    }, { drawerOpen: true, status: "进行中" }),
  },
  {
    id: "Carousel", title: "Carousel", note: "横向滑动的卡片，可以左右拖。",
    frame: true,
    spec: one("Carousel", { items: [{ title: "晨间", description: "6:30 起床，拉伸 10 分钟" }, { title: "工作", description: "专注两个 90 分钟" }, { title: "午后", description: "散步，回邮件" }, { title: "夜晚", description: "阅读，23:00 前睡" }] }),
  },
];

/* ───────────── official: data display ───────────── */

const DISPLAY: Demo[] = [
  {
    id: "Table", title: "Table", note: "columns 是表头，rows 是二维字符串数组，caption 可选。表格画在实色底上。",
    frame: true,
    spec: one("Table", { columns: ["姓名", "角色", "本月工时"], rows: [["Alice", "管理员", "162"], ["Bob", "成员", "148"], ["Chen", "成员", "171"]], caption: "11 月工时统计" }),
  },
  {
    id: "Heading", title: "Heading", note: "level: h1–h4。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "sm" }, ["h-1", "h-2", "h-3", "h-4"]),
      "h-1": el("Heading", { text: "一级标题", level: "h1" }),
      "h-2": el("Heading", { text: "二级标题", level: "h2" }),
      "h-3": el("Heading", { text: "三级标题", level: "h3" }),
      "h-4": el("Heading", { text: "四级标题", level: "h4" }),
    }),
  },
  {
    id: "Text", title: "Text", note: "variant: body / caption / muted / lead / code。聊天目录的写法是 content 加 muted，也能用。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "sm" }, ["t-1", "t-2", "t-3", "t-4", "t-5", "t-6"]),
      "t-1": el("Text", { text: "正文 body", variant: "body" }),
      "t-2": el("Text", { text: "引导语 lead", variant: "lead" }),
      "t-3": el("Text", { text: "弱化 muted", variant: "muted" }),
      "t-4": el("Text", { text: "说明 caption", variant: "caption" }),
      "t-5": el("Text", { text: "npm install json-render", variant: "code" }),
      "t-6": el("Text", { content: "聊天目录写法：content + muted", muted: true }),
    }),
  },
  {
    id: "Image", title: "Image", note: "有 src 画图片，没有就画占位。width / height 决定比例。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "sm" }, ["img-1", "img-2"]),
      "img-1": el("Image", { alt: "产品头图", width: 320, height: 150 }),
      "img-2": el("Image", { alt: "缩略图", width: 120, height: 120 }),
    }),
  },
  {
    id: "Avatar", title: "Avatar", note: "size: sm / md / lg；没有 src 时用姓名首字，颜色由姓名决定。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { direction: "horizontal", gap: "md" }, ["a-1", "a-2", "a-3", "a-4"]),
      "a-1": el("Avatar", { name: "Jane Doe", size: "sm" }),
      "a-2": el("Avatar", { name: "Jane Doe", size: "md" }),
      "a-3": el("Avatar", { name: "高杰", size: "lg" }),
      "a-4": el("Avatar", { name: "Li Wei Zhang", size: "md" }),
    }),
  },
  {
    id: "Badge", title: "Badge", note: "variant: default / secondary / destructive / outline。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { direction: "horizontal", gap: "sm" }, ["b-1", "b-2", "b-3", "b-4"]),
      "b-1": el("Badge", { text: "进行中", variant: "default" }),
      "b-2": el("Badge", { text: "草稿", variant: "secondary" }),
      "b-3": el("Badge", { text: "已逾期", variant: "destructive" }),
      "b-4": el("Badge", { text: "v2.1", variant: "outline" }),
    }),
  },
  {
    id: "Alert", title: "Alert", note: "type: info / success / warning / error。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "sm" }, ["al-1", "al-2", "al-3", "al-4"]),
      "al-1": el("Alert", { title: "提示", message: "新版本将在今晚发布。", type: "info" }),
      "al-2": el("Alert", { title: "已保存", message: "你的修改已经保存。", type: "success" }),
      "al-3": el("Alert", { title: "容量不足", message: "剩余空间不到 10%。", type: "warning" }),
      "al-4": el("Alert", { title: "上传失败", message: "网络中断，请重试。", type: "error" }),
    }),
  },
  {
    id: "Progress", title: "Progress", note: "value / max，label 可选。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "md" }, ["p-1", "p-2"]),
      "p-1": el("Progress", { value: 65, max: 100, label: "上传进度" }),
      "p-2": el("Progress", { value: 3, max: 8, label: "第 3 步，共 8 步" }),
    }),
  },
  {
    id: "Skeleton", title: "Skeleton", note: "加载占位，width / height 是 CSS 长度，rounded 画成圆。",
    frame: true,
    spec: spec("row-1", {
      "row-1": el("Stack", { direction: "horizontal", gap: "md", align: "center" }, ["sk-1", "col-1"]),
      "sk-1": el("Skeleton", { width: "48px", height: "48px", rounded: true }),
      "col-1": el("Stack", { gap: "sm" }, ["sk-2", "sk-3"]),
      "sk-2": el("Skeleton", { width: "180px", height: "14px" }),
      "sk-3": el("Skeleton", { width: "120px", height: "14px" }),
    }),
  },
  {
    id: "Spinner", title: "Spinner", note: "size: sm / md / lg，label 可选。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { direction: "horizontal", gap: "lg" }, ["s-1", "s-2", "s-3"]),
      "s-1": el("Spinner", { size: "sm" }),
      "s-2": el("Spinner", { size: "md", label: "加载中…" }),
      "s-3": el("Spinner", { size: "lg" }),
    }),
  },
  {
    id: "Tooltip", title: "Tooltip", note: "text 是触发文字，content 是提示内容，玻璃气泡。网页里是悬停，这里点触发文字切换。",
    frame: true, open: true,
    spec: one("Tooltip", { text: "API 密钥", content: "在设置 → 开发者里生成" }),
  },
  {
    id: "Popover", title: "Popover", note: "trigger 是按钮文字，content 是浮层内容，玻璃。点按钮开关。",
    frame: true, open: true,
    spec: one("Popover", { trigger: "分享", content: "任何拿到链接的人都可以查看，不能编辑。" }),
  },
];

/* ───────────── official: form inputs and actions ───────────── */

const FORMS: Demo[] = [
  {
    id: "Input", title: "Input", note: "value 用 $bindState 双向绑定：在框里打字，下面的 Text 同步变。checks、validateOn 渲染时忽略。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "md" }, ["in-1", "in-2", "text-1"]),
      "in-1": el("Input", { label: "邮箱", name: "email", type: "email", placeholder: "you@example.com", value: { $bindState: "/form/email" } }),
      "in-2": el("Input", { label: "密码", name: "password", type: "password", placeholder: "至少 8 位" }),
      "text-1": el("Text", { variant: "caption", text: { $template: "将发送验证邮件到 ${/form/email}" } }),
    }, { form: { email: "" } }),
  },
  {
    id: "Textarea", title: "Textarea", note: "rows 控制高度。",
    frame: true,
    spec: one("Textarea", { label: "留言", name: "message", placeholder: "写点什么…", rows: 3, value: { $bindState: "/message" } }, { message: "" }),
  },
  {
    id: "Select", title: "Select", note: "options 是字符串数组，placeholder 在没有选中时显示。",
    frame: true,
    spec: one("Select", { label: "城市", name: "city", options: ["北京", "上海", "深圳", "成都"], placeholder: "请选择城市", value: { $bindState: "/city" } }),
  },
  {
    id: "Checkbox", title: "Checkbox", note: "checked 用 $bindState 绑定。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "sm" }, ["c-1", "c-2"]),
      "c-1": el("Checkbox", { label: "同意服务条款", name: "terms", checked: { $bindState: "/terms" } }),
      "c-2": el("Checkbox", { label: "订阅每周周报", name: "news", checked: true }),
    }, { terms: false }),
  },
  {
    id: "Radio", title: "Radio", note: "options 是字符串数组。官方聊天目录的 RadioGroup 用 { value, label } 数组，同样支持。",
    frame: true,
    spec: one("Radio", { label: "配送方式", name: "ship", options: ["快递", "同城急送", "到店自提"], value: { $bindState: "/ship" } }, { ship: "快递" }),
  },
  {
    id: "Switch", title: "Switch", note: "iOS 样式开关。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "md" }, ["sw-1", "sw-2"]),
      "sw-1": el("Switch", { label: "推送通知", name: "push", checked: { $bindState: "/push" } }),
      "sw-2": el("Switch", { label: "深色外观", name: "dark", checked: false }),
    }, { push: true }),
  },
  {
    id: "Slider", title: "Slider", note: "min / max / step / value，value 的数字显示在右上。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "md" }, ["sl-1", "sl-2"]),
      "sl-1": el("Slider", { label: "音量", min: 0, max: 100, step: 1, value: { $bindState: "/volume" } }),
      "sl-2": el("Slider", { label: "亮度", min: 0, max: 1, step: 0.05, value: 0.6 }),
    }, { volume: 40 }),
  },
  {
    id: "Button", title: "Button", note: "primary 和 danger 是带色玻璃，secondary 是中性玻璃。on.press 不执行，只画按钮。",
    spec: spec("stack-1", {
      "stack-1": el("Stack", { direction: "horizontal", gap: "sm" }, ["b-1", "b-2", "b-3", "b-4"]),
      "b-1": el("Button", { label: "提交", variant: "primary" }),
      "b-2": el("Button", { label: "取消", variant: "secondary" }),
      "b-3": el("Button", { label: "删除", variant: "danger" }),
      "b-4": el("Button", { label: "不可用", variant: "primary", disabled: true }),
    }),
  },
  {
    id: "Link", title: "Link", note: "label + href。只接受 http(s)、mailto 和 #。",
    frame: true,
    spec: one("Link", { label: "查看文档", href: "https://json-render.dev/" }),
  },
  {
    id: "DropdownMenu", title: "DropdownMenu", note: "按钮加玻璃菜单，value 记住选中项。点菜单项选中并收起。",
    frame: true, open: true,
    spec: one("DropdownMenu", { label: "排序", items: [{ label: "最近更新", value: "recent" }, { label: "名称", value: "name" }, { label: "大小", value: "size" }], value: { $bindState: "/sort" } }, { sort: "recent" }),
  },
  {
    id: "Toggle", title: "Toggle", note: "toggle 按钮，variant: default / outline，pressed 绑定。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { direction: "horizontal", gap: "sm" }, ["t-1", "t-2"]),
      "t-1": el("Toggle", { label: "粗体", variant: "outline", pressed: { $bindState: "/bold" } }),
      "t-2": el("Toggle", { label: "斜体", variant: "default", pressed: false }),
    }, { bold: true }),
  },
  {
    id: "ToggleGroup", title: "ToggleGroup", note: "type: single 或 multiple（multiple 时 value 是数组）。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "md" }, ["g-1", "g-2"]),
      "g-1": el("ToggleGroup", { type: "single", items: [{ label: "左", value: "left" }, { label: "中", value: "center" }, { label: "右", value: "right" }], value: "center" }),
      "g-2": el("ToggleGroup", { type: "multiple", items: [{ label: "B", value: "b" }, { label: "I", value: "i" }, { label: "U", value: "u" }], value: ["b", "u"] }),
    }),
  },
  {
    id: "ButtonGroup", title: "ButtonGroup", note: "分段按钮组，玻璃胶囊，selected 绑定。",
    spec: one("ButtonGroup", { buttons: [{ label: "日", value: "day" }, { label: "周", value: "week" }, { label: "月", value: "month" }], selected: { $bindState: "/range" } }, { range: "week" }),
  },
  {
    id: "Pagination", title: "Pagination", note: "totalPages 和 page；页数多时中间用省略号。",
    frame: true,
    spec: one("Pagination", { totalPages: 12, page: { $bindState: "/page" } }, { page: 5 }),
  },
];

/* ───────────── chat catalog ───────────── */

const SALES = [
  { channel: "线上商城", month: "9 月", amount: 480 }, { channel: "线上商城", month: "10 月", amount: 520 }, { channel: "线上商城", month: "11 月", amount: 610 },
  { channel: "线下门店", month: "9 月", amount: 330 }, { channel: "线下门店", month: "10 月", amount: 310 }, { channel: "线下门店", month: "11 月", amount: 340 },
  { channel: "分销", month: "9 月", amount: 190 }, { channel: "分销", month: "10 月", amount: 210 }, { channel: "分销", month: "11 月", amount: 180 },
];

const CHAT: Demo[] = [
  {
    id: "chat-Text", title: "Text（聊天目录）", note: "content + muted。",
    frame: true,
    spec: spec("stack-1", { "stack-1": el("Stack", { gap: "sm" }, ["t-1", "t-2"]), "t-1": el("Text", { content: "这是你的数据概览。" }), "t-2": el("Text", { content: "数据更新于 5 分钟前。", muted: true }) }),
  },
  {
    id: "Metric", title: "Metric", note: "label、value、detail、trend（up / down / neutral）。",
    frame: true,
    spec: spec("grid-1", {
      "grid-1": el("Grid", { columns: 3, gap: "sm" }, ["m-1", "m-2", "m-3"]),
      "m-1": el("Metric", { label: "销售额", value: "¥3.82M", detail: "+12.4%", trend: "up" }),
      "m-2": el("Metric", { label: "退款率", value: "2.1%", detail: "-0.4pt", trend: "down" }),
      "m-3": el("Metric", { label: "客单价", value: "¥298", detail: "持平", trend: "neutral" }),
    }),
  },
  {
    id: "chat-Table", title: "Table（聊天目录）", note: "data 是对象数组（这里用 $state 读），columns 是 { key, label }，没有数据时显示 emptyMessage。",
    frame: true,
    spec: spec("table-1", {
      "table-1": el("Table", { data: { $state: "/stories" }, columns: [{ key: "title", label: "标题" }, { key: "score", label: "热度" }], emptyMessage: "暂无数据" }),
    }, { stories: [{ title: "Show HN: 一个玻璃渲染器", score: 482 }, { title: "为什么 JSON 比 JSX 更适合模型", score: 355 }, { title: "WebGPU 入门", score: 201 }] }),
  },
  {
    id: "chat-Link", title: "Link（聊天目录）", note: "text + href。",
    frame: true,
    spec: one("Link", { text: "在 GitHub 上查看", href: "https://github.com" }),
  },
  {
    id: "BarChart", title: "BarChart", note: "data 对象数组，xKey / yKey；aggregate（sum / count / avg）先按 xKey 分组。图是自己画的 SVG。",
    frame: true,
    spec: spec("bar-1", { "bar-1": el("BarChart", { title: "各渠道销售额（万元）", data: { $state: "/sales" }, xKey: "channel", yKey: "amount", aggregate: "sum", height: 200 }) }, { sales: SALES }),
  },
  {
    id: "LineChart", title: "LineChart", note: "参数同 BarChart。color 可改线色。",
    frame: true,
    spec: spec("line-1", { "line-1": el("LineChart", { title: "线上商城月销售额", data: [{ m: "6 月", v: 380 }, { m: "7 月", v: 420 }, { m: "8 月", v: 410 }, { m: "9 月", v: 480 }, { m: "10 月", v: 520 }, { m: "11 月", v: 610 }], xKey: "m", yKey: "v", height: 190, color: "#ff9500" }) }),
  },
  {
    id: "PieChart", title: "PieChart", note: "nameKey / valueKey。",
    frame: true,
    spec: spec("pie-1", { "pie-1": el("PieChart", { title: "支付方式占比", data: [{ name: "微信支付", value: 46 }, { name: "支付宝", value: 34 }, { name: "银行卡", value: 14 }, { name: "其他", value: 6 }], nameKey: "name", valueKey: "value", height: 140 }) }),
  },
  {
    id: "chat-Tabs", title: "Tabs + TabContent（聊天目录）", note: "defaultValue + tabs[{ value, label }]；每个 TabContent 带一个 value。",
    spec: spec("tabs-1", {
      "tabs-1": el("Tabs", { defaultValue: "a", tabs: [{ value: "a", label: "原理" }, { value: "b", label: "例子" }] }, ["tc-a", "tc-b"]),
      "tc-a": el("TabContent", { value: "a" }, ["card-a"]),
      "tc-b": el("TabContent", { value: "b" }, ["card-b"]),
      "card-a": el("Card", { title: "折射", description: "光从一种介质进入另一种" }, ["t-a"]),
      "card-b": el("Card", { title: "例子", description: "水杯里的吸管看起来是弯的" }, ["t-b"]),
      "t-a": el("Text", { content: "光速变了，传播方向就会偏折。" }),
      "t-b": el("Text", { content: "玻璃边缘把背景往里拉，就是同一个道理。" }),
    }),
  },
  {
    id: "Callout", title: "Callout", note: "type: info / tip / warning / important，带标题。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "sm" }, ["c-1", "c-2", "c-3", "c-4"]),
      "c-1": el("Callout", { type: "info", title: "说明", content: "数据每小时更新一次。" }),
      "c-2": el("Callout", { type: "tip", title: "你知道吗？", content: "太阳离地球约 1.5 亿公里。" }),
      "c-3": el("Callout", { type: "warning", title: "注意", content: "这个操作会清空缓存。" }),
      "c-4": el("Callout", { type: "important", title: "重要", content: "请在 12 月 1 日前完成迁移。" }),
    }),
  },
  {
    id: "Timeline", title: "Timeline", note: "items[{ title, description, date, status }]，status: completed / current / upcoming。",
    frame: true,
    spec: one("Timeline", { items: [{ title: "需求评审", description: "确认范围和排期", date: "11 月 3 日", status: "completed" }, { title: "开发联调", description: "前后端接口对齐", date: "11 月 12 日", status: "current" }, { title: "灰度发布", description: "先放 5% 流量", date: "11 月 20 日", status: "upcoming" }] }),
  },
  {
    id: "RadioGroup", title: "RadioGroup", note: "options 是 { value, label }，value 用 $bindState。",
    frame: true,
    spec: one("RadioGroup", { label: "选一个", value: { $bindState: "/answer" }, options: [{ value: "a", label: "选项 A" }, { value: "b", label: "选项 B" }, { value: "c", label: "选项 C" }] }, { answer: "b" }),
  },
  {
    id: "SelectInput", title: "SelectInput", note: "下拉选择，options 是 { value, label }。",
    frame: true,
    spec: one("SelectInput", { label: "国家", value: { $bindState: "/country" }, placeholder: "选择一个国家", options: [{ value: "cn", label: "中国" }, { value: "us", label: "美国" }, { value: "jp", label: "日本" }] }),
  },
  {
    id: "TextInput", title: "TextInput", note: "文本框，type: text / email / number / password / url。",
    frame: true,
    spec: one("TextInput", { label: "你的名字", value: { $bindState: "/userName" }, placeholder: "输入名字", type: "text" }),
  },
  {
    id: "chat-Button", title: "Button（聊天目录）", note: "variant: default / secondary / destructive / outline / ghost；size: default / sm / lg。",
    spec: spec("stack-1", {
      "stack-1": el("Stack", { direction: "horizontal", gap: "sm", align: "center" }, ["b-1", "b-2", "b-3", "b-4", "b-5", "b-6"]),
      "b-1": el("Button", { label: "提交", variant: "default", size: "default" }),
      "b-2": el("Button", { label: "次要", variant: "secondary", size: "default" }),
      "b-3": el("Button", { label: "删除", variant: "destructive", size: "sm" }),
      "b-4": el("Button", { label: "描边", variant: "outline", size: "default" }),
      "b-5": el("Button", { label: "幽灵", variant: "ghost", size: "default" }),
      "b-6": el("Button", { label: "大按钮", variant: "default", size: "lg" }),
    }),
  },
];

/* ───────────── expressions ───────────── */

const EXPR: Demo[] = [
  {
    id: "x-state", title: "$state、$bindState、$template", note: "在输入框里打字：Heading 用 $template 读 /user/name，Text 用 $state 读同一路径。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "md" }, ["in-1", "h-1", "t-1"]),
      "in-1": el("Input", { label: "名字", name: "name", value: { $bindState: "/user/name" } }),
      "h-1": el("Heading", { level: "h3", text: { $template: "你好，${/user/name}！" } }),
      "t-1": el("Text", { variant: "muted", text: { $state: "/user/name" } }),
    }, { user: { name: "Jgao" } }),
  },
  {
    id: "x-visible", title: "visible", note: "元素上的 visible：{ $state } 为真才显示，not 取反，eq / neq / gt / gte / lt / lte 比较，数组是 AND，$or 是 OR。拖滑块、拨开关看变化。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "md" }, ["sw-1", "sl-1", "al-1", "al-2", "al-3"]),
      "sw-1": el("Switch", { label: "显示提示", name: "show", checked: { $bindState: "/show" } }),
      "sl-1": el("Slider", { label: "库存", min: 0, max: 100, value: { $bindState: "/stock" } }),
      "al-1": el("Alert", { title: "提示已开启", type: "info" }, [], { visible: { $state: "/show" } }),
      "al-2": el("Alert", { title: "库存紧张（< 20）", type: "warning" }, [], { visible: { $state: "/stock", lt: 20 } }),
      "al-3": el("Alert", { title: "提示已关闭，或库存充足", type: "success" }, [], { visible: { $or: [{ $state: "/show", not: true }, { $state: "/stock", gte: 80 }] } }),
    }, { show: true, stock: 12 }),
  },
  {
    id: "x-repeat", title: "repeat、$item、$index、$bindItem", note: "repeat 在元素上：{ statePath, key }，对数组每一项渲染 children。勾选 Checkbox 用 $bindItem 写回当前项。",
    frame: true,
    spec: spec("list-1", {
      "list-1": el("Stack", { gap: "sm" }, ["row-1"], { repeat: { statePath: "/todos", key: "id" } }),
      "row-1": el("Stack", { direction: "horizontal", gap: "sm", justify: "between" }, ["cb-1", "bd-1"]),
      "cb-1": el("Checkbox", { label: { $item: "title" }, name: "done", checked: { $bindItem: "done" } }),
      "bd-1": el("Badge", { text: { $index: true }, variant: "outline" }),
    }, { todos: [{ id: "1", title: "买牛奶", done: true }, { id: "2", title: "遛狗", done: false }, { id: "3", title: "回邮件", done: false }] }),
  },
  {
    id: "x-cond", title: "$cond", note: "{ $cond, $then, $else }：条件用和 visible 一样的写法。打开 VIP 开关，Badge 的文字和样式跟着变。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { direction: "horizontal", gap: "md", align: "center", justify: "between" }, ["sw-1", "bd-1"]),
      "sw-1": el("Switch", { label: "VIP", name: "vip", checked: { $bindState: "/vip" } }),
      "bd-1": el("Badge", { text: { $cond: { $state: "/vip" }, $then: "尊享会员", $else: "普通用户" }, variant: { $cond: { $state: "/vip" }, $then: "default", $else: "secondary" } }),
    }, { vip: false }),
  },
  {
    id: "x-computed", title: "$computed", note: "需要在运行时注册函数，预览里不执行，原样显示函数名。",
    frame: true,
    spec: one("Text", { text: { $computed: "fullName", args: { first: { $state: "/first" }, last: { $state: "/last" } } } }, { first: "Jane", last: "Doe" }),
  },
  {
    id: "x-unknown", title: "未知 type 和 3D 组件", note: "写错的 type 画占位卡并显示 type 名；聊天目录里的 react-three-fiber 组件（Scene3D、Sphere 等）画“3D 场景（未支持）”。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "sm" }, ["u-1", "u-2", "u-3"]),
      "u-1": el("Cardd", { title: "拼错的 type" }),
      "u-2": el("Scene3D", { height: "500px", background: "#000010" }, ["u-3"]),
      "u-3": el("Sphere", { position: [0, 0, 0], color: "#4B7BE5", args: [1, 32, 32] }),
    }),
  },
];

/* ───────────── extensions (multimodal) ───────────── */

const sampleCode = `async function fetchUser(id) {
  // 先查缓存
  const cached = cache.get(id);
  if (cached) return cached;
  const res = await fetch("/api/users/" + id);
  return res.json();
}`;

const EXT: Demo[] = [
  {
    id: "CodeBlock", title: "CodeBlock", note: "代码块：带文件名的标题栏，简单语法高亮（关键字、字符串、数字、注释）。",
    frame: true,
    spec: one("CodeBlock", { language: "javascript", filename: "user.js", code: sampleCode }),
    props: [["language", "string", "语言，决定注释写法（py / sh / yaml / sql 用 #、--，其他用 //）"], ["code", "string", "代码文本"], ["filename?", "string", "标题栏文件名，没有就显示 language"]],
  },
  {
    id: "Markdown", title: "Markdown", note: "标题、粗斜体、列表、引用、行内代码、链接、表格、代码块。只有 http(s) 和 mailto 链接会生效。",
    frame: true,
    spec: one("Markdown", { content: "## 结论\n\n**线上商城**增长最快，*线下门店*基本持平，详见 [报告](https://example.com/report)。\n\n- 复购率提升到 `34%`\n- 新客占比下降\n\n> 注意：分销渠道本月回落。\n\n| 渠道 | 销售额 | 环比 |\n|---|---|---|\n| 线上 | 610 | +17% |\n| 线下 | 340 | +10% |" }),
    props: [["content", "string", "Markdown 文本"]],
  },
  {
    id: "AreaChart", title: "AreaChart", note: "参数同 LineChart，线下面铺一层淡色。",
    frame: true,
    spec: one("AreaChart", { title: "日活跃用户", data: [{ d: "周一", v: 120 }, { d: "周二", v: 180 }, { d: "周三", v: 160 }, { d: "周四", v: 240 }, { d: "周五", v: 300 }, { d: "周六", v: 260 }, { d: "周日", v: 210 }], xKey: "d", yKey: "v", height: 190 }),
    props: [["title?", "string", "标题"], ["data", "object[]", "数据行"], ["xKey / yKey", "string", "横轴 / 数值字段"], ["aggregate?", "sum | count | avg", "按 xKey 分组聚合"], ["color?", "string", "颜色，#hex / rgb()"], ["height?", "number", "高度，默认 200"]],
  },
  {
    id: "DonutChart", title: "DonutChart", note: "参数同 PieChart，中间可放文字。",
    frame: true,
    spec: one("DonutChart", { title: "报销分类", data: [{ name: "交通", value: 2480 }, { name: "餐饮", value: 1320 }, { name: "住宿", value: 3600 }, { name: "其他", value: 410 }], nameKey: "name", valueKey: "value", centerLabel: "¥7,810" }),
    props: [["title? / data / nameKey / valueKey / height?", "同 PieChart", ""], ["centerLabel?", "string", "圆环中间的文字，没有就显示合计"]],
  },
  {
    id: "Heatmap", title: "Heatmap", note: "行 × 列的数值矩阵，颜色深浅表示大小。",
    frame: true,
    spec: one("Heatmap", { title: "每周活跃时段", rows: ["上午", "下午", "晚上"], columns: ["一", "二", "三", "四", "五", "六", "日"], values: [[8, 9, 7, 8, 6, 2, 1], [6, 7, 8, 9, 7, 4, 3], [3, 4, 4, 5, 8, 9, 7]] }),
    props: [["title?", "string", "标题"], ["rows", "string[]", "行标签"], ["columns", "string[]", "列标签"], ["values", "number[][]", "values[行][列]"]],
  },
  {
    id: "ImageGrid", title: "ImageGrid", note: "图片网格。没有 src 的格子用渐变占位，显示 alt。",
    frame: true,
    spec: one("ImageGrid", { columns: 3, images: [{ alt: "票据 1" }, { alt: "票据 2" }, { alt: "合影" }, { alt: "菜单" }, { alt: "车票" }, { alt: "路牌" }] }),
    props: [["images", "{ src?, alt }[]", "图片，src 只接受 https 和 data:image"], ["columns?", "number", "列数 1–4，默认 3"]],
  },
  {
    id: "FileCard", title: "FileCard", note: "文件卡片，kind 决定图标颜色。",
    frame: true,
    spec: spec("stack-1", {
      "stack-1": el("Stack", { gap: "sm" }, ["f-1", "f-2", "f-3", "f-4"]),
      "f-1": el("FileCard", { name: "2026 Q3 财报.pdf", size: "2.4 MB", kind: "pdf", pages: 18 }),
      "f-2": el("FileCard", { name: "报销汇总.xlsx", size: "86 KB", kind: "xls" }),
      "f-3": el("FileCard", { name: "路演.pptx", size: "12.8 MB", kind: "ppt", pages: 32 }),
      "f-4": el("FileCard", { name: "素材.zip", size: "240 MB", kind: "zip" }),
    }),
    props: [["name", "string", "文件名"], ["size?", "string", "大小，如 2.4 MB"], ["kind?", "pdf | doc | xls | ppt | zip | image | audio | video | other", "类型"], ["pages?", "number", "页数"]],
  },
  {
    id: "AudioMessage", title: "AudioMessage", note: "语音消息：播放键、波形、时长，transcript 是转写文字。",
    frame: true,
    spec: one("AudioMessage", { duration: "0:18", transcript: "帮我把明天下午三点的会议改到四点，然后通知大家。" }),
    props: [["duration", "string", "时长"], ["transcript?", "string", "转写文字"], ["waveform?", "number[]", "0–1 的波形高度，没有就生成一段"]],
  },
  {
    id: "VideoCard", title: "VideoCard", note: "视频卡片：封面、玻璃播放键、时长。",
    frame: true,
    spec: one("VideoCard", { title: "液态玻璃是怎么做出来的", duration: "12:34" }),
    props: [["title", "string", "标题"], ["duration?", "string", "时长"], ["poster?", "string", "封面，https 或 data:image；没有就画渐变"]],
  },
  {
    id: "MapCard", title: "MapCard", note: "地点卡片：示意地图、路线、距离和时间。",
    frame: true,
    spec: one("MapCard", { title: "伏见稻荷大社", address: "京都市伏见区深草薮之内町 68", distance: "4.2 km", eta: "公交 25 分钟" }),
    props: [["title", "string", "地点名"], ["address?", "string", "地址"], ["distance?", "string", "距离"], ["eta?", "string", "用时"]],
  },
  {
    id: "WeatherCard", title: "WeatherCard", note: "天气卡片，背景随天气变；hourly 画逐小时。",
    frame: true,
    spec: one("WeatherCard", { city: "京都", temp: 18, condition: "cloudy", high: 21, low: 12, hourly: [{ time: "现在", temp: 18, condition: "cloudy" }, { time: "14时", temp: 20, condition: "sunny" }, { time: "17时", temp: 17, condition: "rain" }, { time: "20时", temp: 14, condition: "rain" }, { time: "23时", temp: 12, condition: "cloudy" }] }),
    props: [["city", "string", "城市"], ["temp", "number", "当前温度"], ["condition", "sunny | cloudy | rain | snow | storm", "天气"], ["high? / low?", "number", "最高 / 最低"], ["hourly?", "{ time, temp, condition }[]", "逐小时"]],
  },
  {
    id: "Sources", title: "Sources", note: "引用来源列表。有 url 的行是链接。",
    frame: true,
    spec: one("Sources", { items: [{ title: "京都市观光协会：红叶季指南", site: "kyoto.travel", url: "https://kyoto.travel/" }, { title: "伏见稻荷大社参拜须知", site: "inari.jp" }, { title: "京都公交一日券怎么买", site: "japan-guide.com", url: "https://www.japan-guide.com/" }] }),
    props: [["items", "{ title, site, url? }[]", "来源，url 只接受 http(s)"]],
  },
  {
    id: "ToolSteps", title: "ToolSteps", note: "模型调用工具的进度：done / running / pending / error。",
    frame: true,
    spec: one("ToolSteps", { steps: [{ label: "搜索天气", status: "done", detail: "京都 · 未来 3 天" }, { label: "规划路线", status: "running", detail: "对比 3 种交通方式" }, { label: "查询门票", status: "pending" }, { label: "同步日历", status: "error", detail: "没有日历权限" }] }),
    props: [["steps", "{ label, status, detail? }[]", "status: done / running / pending / error"]],
  },
  {
    id: "FollowUps", title: "FollowUps", note: "追问建议胶囊。",
    frame: true,
    spec: one("FollowUps", { items: ["第二天能再轻松一点吗？", "推荐几家午餐", "换成雨天方案"] }),
    props: [["items", "string[]", "建议的追问"]],
  },
  {
    id: "Streaming", title: "Streaming", note: "生成中：文字后面闪烁光标，下面是骨架行。",
    frame: true,
    spec: one("Streaming", { text: "正在整理你的行程，先从清水寺开始，然后沿着二年坂", cursor: true }),
    props: [["text", "string", "已经生成的文字"], ["cursor?", "boolean", "闪烁光标，默认显示"]],
  },
];

export const SECTIONS: Section[] = [
  { id: "layout", title: "官方组件 · 布局与浮层", description: "玻璃用在容器和浮层上：Card、Dialog、Drawer、Popover、Tooltip、DropdownMenu、Tabs 的标签条、Button。右侧给非容器组件垫的那块玻璃底板不在 JSON 里，只是演示用。", demos: LAYOUT },
  { id: "display", title: "官方组件 · 数据展示", description: "文字、表格、徽标、进度都是实色，画在玻璃面板里面。", demos: DISPLAY },
  { id: "forms", title: "官方组件 · 表单与操作", description: "表单控件是实色，浮出来的菜单和按钮是玻璃。能点能拖的都能操作，状态写进预览自己的 state，不影响别的组件。", demos: FORMS },
  { id: "chat", title: "聊天目录组件", description: "来自 jr-chat-catalog.ts。同名组件（Text、Table、Link、Tabs、Button）按“有哪个字段就用哪个”同时兼容两套 props。", demos: CHAT },
  { id: "expr", title: "表达式、visible、repeat", description: "$state / $item / $index / $bindState / $bindItem / $cond / $template 都支持；$computed 只显示占位；actions 不执行。", demos: EXPR },
  { id: "ext", title: "扩展：多模态组件（15 个）", description: "官方没有，这里补的。props 写在每个组件下面，把它们加进自己的 catalog 就能让模型输出。", demos: EXT },
];

/* ───────────── three chat answers ───────────── */

const REGION_SALES = [
  { channel: "线上商城", amount: 1610 }, { channel: "线下门店", amount: 980 }, { channel: "分销", amount: 580 }, { channel: "海外", amount: 650 },
];

export const CHAT_ANALYSIS: Spec = spec("root", {
  root: el("Stack", { gap: "md" }, ["steps", "intro", "metrics", "card-bar", "card-table", "tip", "fu"]),
  steps: el("ToolSteps", { steps: [{ label: "连接数据仓库", status: "done" }, { label: "聚合 Q3 订单", status: "done", detail: "128,430 行" }, { label: "生成图表", status: "done" }] }),
  intro: el("Markdown", { content: "Q3 总销售额 **¥3.82M**，环比增长 **12.4%**。线上商城贡献了四成以上，下面是各渠道的对比。" }),
  metrics: el("Grid", { columns: 3, gap: "sm" }, ["m-1", "m-2", "m-3"]),
  "m-1": el("Metric", { label: "销售额", value: "¥3.82M", detail: "+12.4%", trend: "up" }),
  "m-2": el("Metric", { label: "订单数", value: "128k", detail: "+8.1%", trend: "up" }),
  "m-3": el("Metric", { label: "退款率", value: "2.1%", detail: "-0.4pt", trend: "down" }),
  "card-bar": el("Card", { title: "各渠道销售额", description: "单位：万元" }, ["bar"]),
  bar: el("BarChart", { data: { $state: "/regions" }, xKey: "channel", yKey: "amount", height: 170 }),
  "card-table": el("Card", { title: "Top 商品" }, ["table"]),
  table: el("Table", { columns: [{ key: "name", label: "商品" }, { key: "units", label: "销量" }, { key: "rev", label: "销售额" }], data: [{ name: "降噪耳机 Pro", units: "12,480", rev: "¥3.74M" }, { name: "智能手表 S", units: "9,210", rev: "¥2.76M" }, { name: "便携音箱", units: "7,860", rev: "¥1.57M" }] }),
  tip: el("Callout", { type: "tip", title: "建议", content: "分销渠道环比下滑 6%，可以先和华东两家大客户对一下备货节奏。" }),
  fu: el("FollowUps", { items: ["按月份拆开看", "和去年同期对比", "导出成 Excel"] }),
}, { regions: REGION_SALES });

export const CHAT_TRIP: Spec = spec("root", {
  root: el("Stack", { gap: "md" }, ["steps", "intro", "weather", "card-plan", "map", "warn", "src", "fu"]),
  steps: el("ToolSteps", { steps: [{ label: "查询天气", status: "done", detail: "京都 · 3 天" }, { label: "规划路线", status: "done" }] }),
  intro: el("Text", { content: "我按“每天一个区域、不赶路”排了 3 天，红叶季人多，热门景点都放在上午。" }),
  weather: el("WeatherCard", { city: "京都", temp: 18, condition: "cloudy", high: 21, low: 12, hourly: [{ time: "现在", temp: 18, condition: "cloudy" }, { time: "14时", temp: 20, condition: "sunny" }, { time: "17时", temp: 17, condition: "rain" }, { time: "20时", temp: 14, condition: "rain" }] }),
  "card-plan": el("Card", { title: "3 天行程" }, ["tabs"]),
  tabs: el("Tabs", { defaultValue: "d1", tabs: [{ value: "d1", label: "第 1 天" }, { value: "d2", label: "第 2 天" }, { value: "d3", label: "第 3 天" }] }, ["tc1", "tc2", "tc3"]),
  tc1: el("TabContent", { value: "d1" }, ["tl1"]),
  tc2: el("TabContent", { value: "d2" }, ["tl2"]),
  tc3: el("TabContent", { value: "d3" }, ["tl3"]),
  tl1: el("Timeline", { items: [{ title: "清水寺", description: "8:00 到，人少光线好", date: "8:00", status: "completed" }, { title: "二年坂、三年坂", description: "步行 10 分钟", date: "10:30", status: "current" }, { title: "祇园午餐", date: "12:30", status: "upcoming" }, { title: "八坂神社", date: "15:00", status: "upcoming" }] }),
  tl2: el("Timeline", { items: [{ title: "伏见稻荷大社", description: "千本鸟居，建议早去", date: "8:00", status: "upcoming" }, { title: "东福寺", description: "红叶名所", date: "11:30", status: "upcoming" }, { title: "锦市场", date: "14:00", status: "upcoming" }] }),
  tl3: el("Timeline", { items: [{ title: "岚山竹林", date: "9:00", status: "upcoming" }, { title: "渡月桥", date: "10:30", status: "upcoming" }, { title: "天龙寺", description: "庭园门票 ¥500", date: "11:30", status: "upcoming" }] }),
  map: el("MapCard", { title: "伏见稻荷大社", address: "京都市伏见区深草薮之内町 68", distance: "4.2 km", eta: "公交 25 分钟" }),
  warn: el("Alert", { type: "warning", title: "红叶季人多", message: "清水寺和岚山 10 点后排队明显变长。" }),
  src: el("Sources", { items: [{ title: "京都市观光协会：红叶季指南", site: "kyoto.travel", url: "https://kyoto.travel/" }, { title: "伏见稻荷大社参拜须知", site: "inari.jp" }] }),
  fu: el("FollowUps", { items: ["第二天能再轻松一点吗？", "推荐几家午餐", "换成雨天方案"] }),
});

export const CHAT_MULTI_USER: Spec = spec("root", {
  root: el("Stack", { gap: "sm", align: "end" }, ["grid", "file", "voice"]),
  grid: el("ImageGrid", { columns: 2, images: [{ alt: "出租车票" }, { alt: "酒店发票" }] }),
  file: el("FileCard", { name: "出差申请.pdf", size: "320 KB", kind: "pdf", pages: 2 }),
  voice: el("AudioMessage", { duration: "0:08", transcript: "这些票据能不能报销？帮我汇总一下。" }),
});

export const CHAT_MULTI: Spec = spec("root", {
  root: el("Stack", { gap: "md" }, ["steps", "md", "card-donut", "file", "stream"]),
  steps: el("ToolSteps", { steps: [{ label: "识别 2 张图片", status: "done" }, { label: "读取 PDF", status: "done", detail: "2 页" }, { label: "校验金额", status: "done" }] }),
  md: el("Markdown", { content: "识别到 **2 张票据**，对照出差申请，**都符合报销标准**：\n\n| 票据 | 金额 | 结论 |\n|---|---|---|\n| 出租车票 | 86 | 可报销 |\n| 酒店发票 | 1,240 | 可报销 |\n\n- 酒店发票抬头需改成公司全称\n- 出租车票需补充行程单" }),
  "card-donut": el("Card", { title: "本次报销分类" }, ["donut"]),
  donut: el("DonutChart", { data: [{ name: "住宿", value: 1240 }, { name: "交通", value: 86 }], nameKey: "name", valueKey: "value", centerLabel: "¥1,326" }),
  file: el("FileCard", { name: "报销汇总.xlsx", size: "42 KB", kind: "xls" }),
  stream: el("Streaming", { text: "正在生成报销单", cursor: true }),
});

/// Pre-filled examples of the live preview (§4.5).
export const SAMPLES: { name: string; text: string }[] = [
  {
    name: "官方示例",
    text: fmt({
      root: "card-1",
      elements: {
        "card-1": { type: "Card", props: { title: "Dashboard" }, children: ["text-1", "button-1"] },
        "text-1": { type: "Text", props: { text: { $state: "/user/name" } }, children: [] },
        "button-1": { type: "Button", props: { label: "Click me" }, children: [] },
      },
      state: { user: { name: "Jgao" } },
    }),
  },
  {
    name: "每个 example",
    text: fmt(spec("stack-1", {
      "stack-1": el("Stack", { direction: "vertical", gap: "md" }, ["card-1", "grid-1", "table-1", "h-1", "t-1", "av-1", "bd-1", "al-1", "pr-1", "in-1", "btn-1", "m-1", "link-1", "co-1", "tl-1", "rg-1", "sel-1", "ti-1", "btn-2"]),
      "card-1": el("Card", { title: "Overview", description: "Your account summary" }),
      "grid-1": el("Grid", { columns: 3, gap: "md" }),
      "table-1": el("Table", { columns: ["Name", "Role"], rows: [["Alice", "Admin"], ["Bob", "User"]] }),
      "h-1": el("Heading", { text: "Welcome", level: "h1" }),
      "t-1": el("Text", { text: "Hello, world!" }),
      "av-1": el("Avatar", { name: "Jane Doe", size: "md" }),
      "bd-1": el("Badge", { text: "Active", variant: "default" }),
      "al-1": el("Alert", { title: "Note", message: "Your changes have been saved.", type: "success" }),
      "pr-1": el("Progress", { value: 65, max: 100, label: "Upload progress" }),
      "in-1": el("Input", { label: "Email", name: "email", type: "email", placeholder: "you@example.com" }),
      "btn-1": el("Button", { label: "Submit", variant: "primary" }),
      "m-1": el("Metric", { label: "Temperature", value: "72F", detail: "Feels like 68F", trend: "up" }),
      "link-1": el("Link", { text: "View on GitHub", href: "https://github.com" }),
      "co-1": el("Callout", { type: "tip", title: "Did you know?", content: "The sun is about 93 million miles from Earth." }),
      "tl-1": el("Timeline", { items: [{ title: "Discovery", description: "Initial breakthrough", date: "1905", status: "completed" }] }),
      "rg-1": el("RadioGroup", { label: "Choose one", value: { $bindState: "/answer" }, options: [{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }] }),
      "sel-1": el("SelectInput", { label: "Country", value: { $bindState: "/selectedCountry" }, placeholder: "Select a country", options: [{ value: "us", label: "United States" }, { value: "uk", label: "United Kingdom" }] }),
      "ti-1": el("TextInput", { label: "Your name", value: { $bindState: "/userName" }, placeholder: "Enter your name", type: "text" }),
      "btn-2": el("Button", { label: "Submit", variant: "default", size: "default", disabled: null }),
    }, { answer: "a" })),
  },
  {
    name: "表单 + 绑定",
    text: fmt(spec("card-1", {
      "card-1": el("Card", { title: "注册", description: "输入邮箱后下面的提示会跟着变", maxWidth: "md" }, ["in-1", "hint", "sw-1", "al-1", "btn-1"]),
      "in-1": el("Input", { label: "邮箱", name: "email", type: "email", value: { $bindState: "/email" } }),
      hint: el("Text", { variant: "caption", text: { $template: "验证邮件将发送到 ${/email}" } }),
      "sw-1": el("Switch", { label: "订阅周报", name: "news", checked: { $bindState: "/news" } }),
      "al-1": el("Alert", { type: "success", title: "已订阅" }, [], { visible: { $state: "/news" } }),
      "btn-1": el("Button", { label: "注册", variant: "primary" }),
    }, { email: "", news: false })),
  },
  {
    name: "数据看板",
    text: fmt(spec("card-1", {
      "card-1": el("Card", { title: "销售看板" }, ["grid-1", "bar-1", "tl-1"]),
      "grid-1": el("Grid", { columns: 3, gap: "sm" }, ["m-1", "m-2", "m-3"]),
      "m-1": el("Metric", { label: "销售额", value: "¥3.82M", detail: "+12.4%", trend: "up" }),
      "m-2": el("Metric", { label: "订单", value: "128k", detail: "+8.1%", trend: "up" }),
      "m-3": el("Metric", { label: "退款率", value: "2.1%", detail: "-0.4pt", trend: "down" }),
      "bar-1": el("BarChart", { title: "渠道", data: [{ c: "线上", v: 161 }, { c: "线下", v: 98 }, { c: "分销", v: 58 }], xKey: "c", yKey: "v" }),
      "tl-1": el("Timeline", { items: [{ title: "Q3 复盘", date: "11 月 3 日", status: "completed" }, { title: "Q4 预算", date: "11 月 20 日", status: "current" }] }),
    })),
  },
  {
    name: "多模态回答",
    text: fmt(spec("root", {
      root: el("Stack", { gap: "md" }, ["md", "file", "audio", "map"]),
      md: el("Markdown", { content: "## 行程\n\n- 上午：**清水寺**\n- 下午：`二年坂` 散步" }),
      file: el("FileCard", { name: "行程.pdf", size: "1.2 MB", kind: "pdf", pages: 4 }),
      audio: el("AudioMessage", { duration: "0:21", transcript: "明天八点在清水寺门口集合。" }),
      map: el("MapCard", { title: "清水寺", address: "京都市东山区清水 1-294", distance: "2.1 km", eta: "步行 28 分钟" }),
    })),
  },
  {
    name: "写错的 type",
    text: fmt(spec("root", {
      root: el("Stack", { gap: "sm" }, ["a", "b"]),
      a: el("Cardd", { title: "拼错了 type" }),
      b: el("Text", { text: "这一行正常渲染" }),
    })),
  },
  { name: "写坏的 JSON", text: '{\n  "root": "a",\n  "elements": {\n    "a": { "type": "Text", "props": { "text": "缺少右括号" }, "children": [] },\n  }\n}' },
];
