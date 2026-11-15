# apple-design

Apple 原生界面的网页原型：用 TSX 画 iOS 27 / macOS 27 的组件与页面，构建成**自包含的单文件 HTML** —— CSS、脚本、壁纸全部内联，一个文件就能发给别人或直接在手机上打开。

玻璃是 [hyalite](https://github.com/VII-Cae/hyalite--liquid-glass) 引擎的实时折射（MIT），参数取自 Figma 里的实测值，不是估算出来的近似。

## 在线看

| 页面 | 链接 |
|---|---|
| **首页（全部原型）** | **https://jgao1024.github.io/apple-design/** |
| 标准页 · iOS + macOS | https://jgao1024.github.io/apple-design/hyalite/standard/ios-macos.html |
| 标准页 · macOS | https://jgao1024.github.io/apple-design/hyalite/standard/macos.html |
| iOS 实验台（参数面板） | https://jgao1024.github.io/apple-design/hyalite/lab/ios.html |
| macOS 实验台（参数面板） | https://jgao1024.github.io/apple-design/hyalite/lab/macos.html |
| iOS 组件补充 | https://jgao1024.github.io/apple-design/hyalite/showcase/ios.html |
| macOS 组件补充 | https://jgao1024.github.io/apple-design/hyalite/showcase/macos.html |
| json-render 玻璃版 | https://jgao1024.github.io/apple-design/hyalite/json-render/index.html |

首页是卡片索引，同样由构建生成；`design/pages/` 就是站点根目录，`.github/workflows/pages.yml` 在每次推送后约 20 秒发布。

## 四类页面

- **标准页** `standard/` —— 组件定稿长什么样。标准玻璃参数、无调节面板，发到手机给同事看的就是这两页。
- **实验台** `lab/` —— 16 个滑杆实时调玻璃参数，5 个预设、9 种底图、帧率测试；调好的档位可以复制成标准参数。
- **组件补充** `showcase/` —— 标准页之外的第二批组件，同样用标准玻璃。
- **JSON 渲染** `json-render/` —— 每个组件左边是 JSON、右边是渲染结果，另有三屏 AI 对话和粘贴 JSON 预览。

## 目录

```
design/
  build.sh           构建入口（自带 Deno 到 design/.bin/，缓存 design/.deno/）
  shot.sh            headless Chrome 截图 → design/shots/
  deno.json          JSX → @design/jsx，tailwindcss 4.1.18
  system/
    build.ts         把 system/<kit>/pages/**/*.tsx 渲染成 pages/<kit>/**/*.html，并生成首页卡片
    theme.ts         页面底色与字体
    styles.css       Liquid Glass 的公共层
    jsx/             极简 JSX runtime（只在构建时跑）
    hyalite/
      presets.ts     玻璃参数预设（STANDARD 是标准档，参数真源）
      components/    glass / ios / macos / lab / standard / hud / script / gallery / ios-more / macos-more / jr-specs
      pages/         lab/  standard/  showcase/  json-render/
      client/        各页面的浏览器端驱动（构建时内联）
      vendor/        hyalite 引擎，原样引入（MIT）
    ios27/ macos27/ doubao/   图标、交通灯、chrome、theme 等共用零件
  pages/             构建产物（已入库，`index.html` 是首页卡片）
  .ref/wallpapers/   两张壁纸底图（已入库，构建时内联）
.dsh/skills/         ui-design / general-rules：画原型时的工作方法
docs/                Liquid Glass 标准与参数表
```

## 构建

```bash
./design/build.sh                  # 全部页面，约 10 秒
./design/build.sh hyalite          # 显式指定 kit
./design/shot.sh hyalite/lab/ios   # 截图到 design/shots/
```

改了 `design/system/**` 必须重跑构建 —— 提交的 HTML 不会自己更新。首次换机时 `build.sh` 会自动下载 Deno（经 `127.0.0.1:7897` 代理），之后离线可跑。

## 约定

- 页面目录按分类命名（`lab/ios`、`standard/ios-macos`），不再用序号；新增页面放进对应分类，首页会自动多一张卡片。
- 视觉尺寸、颜色、字号一律照 Figma 规格，不估数字；玻璃只用 `components/glass.tsx` 的 `Glass` 画。
- 提交内容 = 源码 + 构建出的 HTML。`design/.bin/`、`design/.deno/`、`design/shots/`、`design/.chrome-tmp/` 不入库。
- 参数改动走 `presets.ts`，改完重跑构建，四个页面一起更新。

## 许可

页面里的 Apple 组件造型仅用于设计参考，不构成可再分发的组件库；hyalite 引擎是 MIT。
