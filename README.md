# 星音乐官网 / StarMusic website

星音乐（StarMusic）产品官网，用 **Angular 22 + Angular Material 3** 写成，纯静态、可直接挂 GitHub Pages。
中英双语可切换（顶栏地球按钮），浅色 / 深色主题跟随系统并可手动切换。

## 本地开发

```bash
npm install          # 首次
npm start            # http://localhost:4200
npm run build        # 产物在 dist/website/browser
```

## 目录结构

```
src/
  index.html                  站点外壳（标题 / meta / 主题与语言的首屏预处理）
  styles.scss                 全局主题：品牌 token、--mat-sys-* 覆盖、工具类、动画
  app/
    app.ts|app.html|app.scss  页面骨架：顶栏 + 各区块 + 页脚
    site-content.ts           ★ 文案与固定信息（品牌、GitHub 仓库、功能、截图清单、兜底更新日志）
    core/i18n.ts              中英双语服务（lang signal + localStorage）
    core/theme.ts             浅色/深色主题服务（<html class="dark">）
    core/releases.ts          版本列表服务：读取 public/releases.json，失败回退内置数据
    shared/icon.ts            内联 SVG 图标集（不依赖任何图标字体）
    shared/reveal.ts          滚动入场动画指令 [appReveal]
    sections/                 顶栏、Hero、功能、预览、平台、更新日志、下载、页脚
public/
  releases.json               ★ 版本列表（发版只改这个文件）
  icon/app-icon.webp          App 图标（从 Android 工程复制）
  screenshots/                界面预览截图位，见其中的 README.md
```

改文案/仓库地址动 `src/app/site-content.ts`；**发新版本动 `public/releases.json`**，两处都不需要改组件代码。

## 界面预览截图

把 App 截图按 `home.png` / `player.png` / `search.png` / `playlist.png` 放进 `public/screenshots/`，
页面会自动显示；文件不存在时显示占位提示。细节见 `public/screenshots/README.md`。

## 发布新版本（App 闭源也能让访客下载）

App 源码是闭源的，而**私有仓库的 Release 访客打不开**，所以 APK 挂在**公开的官网仓库**的 Release 里
（只放官网源码，不会泄露 Kotlin 代码；GitHub Pages 免费版也只能从公开仓库发布）。发一个版本：

1. 在这个公开仓库里 **Releases → Draft a new release**：
   - Tag 填 `v1.9.1`（**要和 `releases.json` 里的 `tag` 完全一致**），标题、说明随便写；
   - 把打好的 `StarMusic-1.9.1.apk` 拖进 **Assets** 上传，发布。
2. 编辑 `public/releases.json`，在 `releases` 数组**最前面**加一条：

   ```json
   {
     "version": "1.9.1",
     "tag": "v1.9.1",
     "date": "2026-10-01",
     "asset": "StarMusic-1.9.1.apk",
     "size": "8.4 MB",
     "notes": [
       { "zh": "播放器新增歌词分享", "en": "Lyric sharing in the player" }
     ]
   }
   ```

3. `git add . && git commit -m "release v1.9.1" && git push` —— 云端 Actions 会自动重新构建发布。

数组第一条即为「最新版」，页面上的版本徽标、下载按钮、页脚版本号、更新日志全部跟着它走。
`asset` 留空则按钮退回该版本的 Release 页面（**不会 404**）；`date` / `size` 留空就不显示。
`releases.json` 读不到时页面会退回 `site-content.ts` 里的内置数据，永远不会空白。

如果以后换了仓库名，只改 `src/app/site-content.ts` 里的 `GITHUB.repo` 一处，全站链接跟着变。

## 部署到 GitHub Pages（独立仓库）

这个目录可以整个作为站点仓库的根目录：

```bash
cd website
git init -b main
git add .
git commit -m "星音乐官网"
git remote add origin https://github.com/<你的账号>/<站点仓库名>.git
git push -u origin main
```

然后在 GitHub 仓库里 **Settings → Pages → Build and deployment → Source 选 `GitHub Actions`**。
仓库里已经带好 `.github/workflows/deploy.yml`，push 后会自动构建并发布，地址形如
`https://<你的账号>.github.io/<站点仓库名>/`。

> 仓库必须是 **Public**（免费账号的 Pages 仅支持公开仓库；私有仓库要 Pro/Team）。
> 站点用的是**相对基址**（`angular.json` 生产配置里的 `"baseHref": "./"`，构建出的
> `index.html` 是 `<base href="./">` + 相对资源路径），所以仓库名/子路径/自定义域名怎么变都不用改配置。

>
> 想让官网源码也私有：改用 Cloudflare Pages / Vercel 从私有仓库构建，APK Releases 仍需另找公开位置。

## 技术要点

- Angular 22 独立组件 + signals + **zoneless**（无 zone.js）。
- **不使用路由**：整站是单页锚点导航，`app.config.ts` 里没有 `provideRouter`，生产包因此小约 70 KB。
- Angular Material 3：`mat.theme()` 生成系统变量，再用 App 的默认种子色 `#2F6FED` 覆盖 `--mat-sys-*`。
- 顶栏用 `mat-toolbar` + `mat-icon-button` + `mat-menu`（窄屏汉堡菜单）+ `mat-tooltip`。
- 图标全部内联 SVG，不引用 Material Symbols 字体，离线/墙内也不会出现方框。
- 字体用 Google Fonts 的 Roboto + Noto Sans SC，加载失败时回退系统字体。
