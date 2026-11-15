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
      components/    glass / ios / macos / standard / lab / hud / script / gallery / ios-more / macos-more / jr-specs
      pages/03..09   每个页面一个 tsx
    ios27/ macos27/ doubao/   只保留 hyalite 引用到的图标、交通灯、chrome、theme
  pages/hyalite/     构建产物（已入库，可直接打开看）
  .ref/wallpapers/   两张壁纸底图（已入库，构建时内联进 HTML）
  .ref/wallpapers/   两张壁纸底图（不入库，本机才有）
.dsh/skills/         ui-design + general-rules（从源仓库 .agent/skills 复刻）
docs/                hyalite 玻璃标准（参数真源）
```

## 构建

```bash
./design/build.sh             # 建 hyalite 全部 7 页，约 10 秒
./design/build.sh hyalite     # 同上（显式指定 kit）
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
| `07-ios-more/ios-more.html` | iOS 27 补充组件（标准玻璃，无面板） |
| `08-macos-more/macos-more.html` | macOS 27 补充组件（标准玻璃，无面板） |
| `09-json-render/json-render.html` | json-render 玻璃版：每个组件左边 JSON 右边渲染，外加三屏 AI 对话和粘贴 JSON 预览 |

## 在线访问（GitHub Pages）

`design/pages/` 就是站点根目录，由 [`.github/workflows/pages.yml`](.github/workflows/pages.yml) 发布，推到 `main` 后约 30 秒生效：

| 页面 | 链接 |
|---|---|
| 索引 | https://jgao1024.github.io/apple-design/ |
| 标准页 iOS + macOS | https://jgao1024.github.io/apple-design/hyalite/05-standard/standard.html |
| 标准页 macOS | https://jgao1024.github.io/apple-design/hyalite/06-standard-macos/standard-macos.html |
| iOS 实验台 | https://jgao1024.github.io/apple-design/hyalite/03-ios/components.html |
| macOS 实验台 | https://jgao1024.github.io/apple-design/hyalite/04-macos/components.html |
| iOS 补充 | https://jgao1024.github.io/apple-design/hyalite/07-ios-more/ios-more.html |
| macOS 补充 | https://jgao1024.github.io/apple-design/hyalite/08-macos-more/macos-more.html |
| json-render | https://jgao1024.github.io/apple-design/hyalite/09-json-render/json-render.html |

单文件 HTML 的 CSS/JS/壁纸全内联，所以 Pages 上不需要任何额外资源；手机也能直接打开。

## 已验证

```bash
./design/build.sh
shasum -a 256 -c <(来源仓库的 hash)   # 03–09 七页逐字节一致
```

`deno` 二进制和 tailwindcss 缓存都已复制过来，构建**离线**可跑（首次换机则 build.sh 会经 127.0.0.1:7897 代理下载）。

## 与源仓库的差异

- 只搬了 `design/`、`docs/hyalite-glass.md`、两个 skill；`figma/`（离线 Figma 参数层，约 300 MB）、`apps/`、`native/`、`macos-shots/` 没有搬。
- 页面保留做好的 03-ios / 04-macos / 05-standard / 06-standard-macos / 07-ios-more / 08-macos-more / 09-json-render；`01-edge-lab`、`02-home` 是测试页，没有搬。
- `system/` 只留 hyalite 用得到的文件；ios27 / macos27 / doubao 的页面源（178 个文件）已删，`build.ts` 的 `KITS` 也只剩 `hyalite`。
- 因此 `ui-design` skill 里指向 `figma/reference/` 的查数步骤在本仓库不可用：参数看 `design/system/hyalite/presets.ts`（`STANDARD`）、`components/*.tsx` 里的注释和 `docs/hyalite-glass.md`。
- 需要恢复某个 kit 时，从来源仓库连 `system/<kit>/` 一起搬，并把 kit 名加回 `build.ts` 的 `KITS`。
