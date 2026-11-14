# apple-design

Apple 原生设计语言的网页原型仓库。TSX 写组件 → 构建成**自包含单文件 HTML**（Liquid Glass 引擎和壁纸都内联，可以直接发给别人或传到手机）。

来源：从 `/Users/jgao/Git/ui-design` 的 `design/` 复刻而来，产物与源仓库 **hash 一致**（见下）。

## 目录

```
design/
  build.sh           构建入口（自带 Deno 到 design/.bin/，缓存 design/.deno/）
  shot.sh            headless Chrome 截图 → design/shots/
  deno.json          JSX → @design/jsx，tailwindcss 4.1.18
  system/
    build.ts         把 system/<kit>/pages/**/*.tsx 渲染成 pages/<kit>/**/*.html
    theme.ts         页面底色与字体
    styles.css       Liquid Glass 的公共层
    jsx/             极简 JSX runtime（只在构建时跑）
    hyalite/         本项目主体：组件、页面、client 驱动、vendor/hyalite.js 引擎
      presets.ts     玻璃参数预设（STANDARD 就是标准档）
      components/    glass / ios / macos / standard / lab / hud / home / gallery
      pages/01..07   每个页面一个 tsx
    ios27/ macos27/ doubao/   被 hyalite 复用的工具与图标
  pages/hyalite/     构建产物（可随时重生成）
  .ref/wallpapers/   两张壁纸底图（不入库，本机才有）
.dsh/skills/         ui-design + general-rules（从源仓库 .agent/skills 复刻）
docs/                hyalite 玻璃标准、后续计划
```

## 构建

```bash
./design/build.sh hyalite     # 只建 hyalite，约 5 秒
./design/build.sh             # 建全部 kit（ios27 / macos27 / doubao / hyalite）
./design/shot.sh hyalite/05-standard/standard    # 截图
```

产物在 `design/pages/hyalite/`，用 Chrome 打开；`design/pages/index.html` 是全站索引。
改了 `system/hyalite/**` 必须重跑构建，HTML 不会自己更新。

## 页面

| 页面 | 用途 |
|---|---|
| `05-standard/standard.html` | **标准页**：iOS + macOS 全部组件，标准玻璃参数，无面板，单文件约 1.3 MB |
| `06-standard-macos/standard-macos.html` | 同上，只有 macOS 组件 |
| `03-ios/components.html` | iOS 实验台：参数面板、5 个预设、9 种底图、帧率测试 |
| `04-macos/components.html` | macOS 实验台，同上 |
| `07-ios-more/ios-more.html` | iOS 补充组件（目前是空脚手架，待填） |

## 已验证

```bash
./design/build.sh hyalite
shasum -a 256 -c <(原始仓库的 hash)   # 7/7 OK
```

`deno` 二进制和 tailwindcss 缓存都已复制过来，构建**离线**可跑（首次换机则 build.sh 会经 127.0.0.1:7897 代理下载）。

## 与源仓库的差异

- 只搬了 `design/`、`docs/hyalite-glass.md`、`docs/glass-gallery-next.md`、两个 skill；`figma/`（离线 Figma 参数层，约 300 MB）、`apps/`、`native/`、`macos-shots/` 没有搬。
- 因此 `ui-design` skill 里指向 `figma/reference/` 的查数步骤在本仓库不可用：参数看 `design/system/hyalite/presets.ts`（`STANDARD`）、`components/*.tsx` 里的注释和 `docs/hyalite-glass.md`。
- `doubao` kit 的页面依赖 `design/.ref/doubao/` 真机截图（46 MB，未搬），单独建 doubao 会缺图；`hyalite` 不受影响。
