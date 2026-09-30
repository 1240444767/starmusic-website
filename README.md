# 星音乐 · 官方网站

星音乐（StarMusic）的官方站点：**https://1240444767.github.io/starmusic-website/**

一个用 Angular 22 + Angular Material 3 手写的纯静态站点，用来介绍产品、展示界面、发布 APK 与更新日志。
中英双语（顶栏地球按钮切换），浅色 / 深色主题跟随系统并可手动切换，桌面与移动端自适应。

## 站点内容

| 区块 | 说明 |
| --- | --- |
| 首屏 | 版本徽标、产品定位、下载入口、数据概览、真机预览 |
| 功能 | 九项核心能力（四平台聚合、猜你想搜、每日推荐、主题种子色等） |
| 界面预览 | 四个主要界面的截图位 |
| 音乐平台 | 已聚合的四个平台与免责说明 |
| 更新日志 | 由版本数据驱动，第一条即最新版 |
| 下载 | 版本 / 系统要求 / 包名 / 体积、多线路下载、安装步骤、免责声明 |

## 技术栈

- **Angular 22** 独立组件 + signals + zoneless（不引入 zone.js）。
- **Angular Material 3**：`mat.theme()` 生成设计令牌，再用 App 的默认种子色 `#2F6FED` 覆盖 `--mat-sys-*`。
- 图标全部内联 SVG，不依赖图标字体；字体使用系统字体栈与 Google Fonts 回退。
- 单页锚点导航，**不使用路由**（生产包因此小约 70 KB）。
- 构建产物为相对基址（`"baseHref": "./"`），部署在任意子路径或自定义域名下都无需改配置。

## 目录结构

```
src/
  index.html                  站点外壳：标题、meta、主题与语言的首屏预处理
  styles.scss                 全局主题：品牌令牌、--mat-sys-* 覆盖、工具类、滚动动画
  app/
    app.ts | app.html | app.scss    页面骨架：顶栏 + 各区块 + 页脚
    site-content.ts           ★ 全站文案与固定信息（仓库地址、功能、平台、下载线路）
    core/i18n.ts              中英双语服务
    core/theme.ts             浅色 / 深色主题服务
    core/releases.ts          版本数据服务：读取 public/releases.json，读取失败回退内置数据
    shared/icon.ts            内联 SVG 图标集
    shared/reveal.ts          滚动入场动画指令 [appReveal]
    sections/                 顶栏、首屏、功能、预览、平台、更新日志、下载、页脚
public/
  releases.json               版本数据（发新版只改这里）
  icon/app-icon.webp          应用图标
  screenshots/                界面预览截图位
```

## 本地开发

```bash
npm install     # 首次
npm start       # 开发服务器 http://localhost:4200
npm run build   # 生产构建，产物在 dist/website/browser
```

## 内容维护

### 版本数据 `public/releases.json`

数组**第一条即最新版**，页面上的版本徽标、下载按钮、页脚版本号、更新日志全部跟着它走：

```json
{
  "releases": [
    {
      "version": "1.9.0",
      "tag": "v1.9.0",
      "date": "2026-10-01",
      "asset": "starmusic1.9.0.apk",
      "size": "15.7 MB",
      "notes": [{ "zh": "首页新增每日推荐", "en": "Daily picks on the home screen" }]
    }
  ]
}
```

- `tag` 与 `asset` 要和 Release 里的标签、资产文件名**完全一致**，否则下载链接会 404。
- `asset` 留空则按钮退回该版本的 Release 页面；`date` / `size` 留空则不显示。
- 读取失败（离线、文件缺失）时页面自动退回 `site-content.ts` 里的内置数据，永不空白。

### 下载线路

`src/app/site-content.ts` 的 `DOWNLOAD_SOURCES` 定义下载面板里的多线路开关：
第一条是 GitHub 直连，其余为第三方公益加速线路（只把 GitHub 链接原样转发，不保存文件）。
访客的选择记在浏览器本地；线路由第三方维护，失效时在数组中增删即可。

### 网盘备用下载

同一个文件里的 `CLOUD_MIRRORS` 定义「网盘备用」那一行，目前一条：

- **蓝奏云**：<https://wwbsh.lanzout.com/b00zyrcnud>（公开文件夹，无提取码，含 1.0.0 起全部版本）

和下载线路不是一回事：线路只是给 GitHub 直链套加速前缀，网盘是点进去自己挑版本的独立页面。
蓝奏云域名偶尔会变（`lanzout` / `lanzoui` / `lanzoup` / `lanzouw`），失效时改 `url` 即可；
要再加一个网盘，往数组里加一条 `{ id, label, url }`。

### 站内文案

`src/app/site-content.ts` 集中存放品牌信息、导航、功能、平台、安装步骤等文案，
每条中文都带对应英文（`{ zh, en }`），改一处全站生效。

### 界面预览截图

把 App 截图按 `home` / `player` / `search` / `playlist` 命名放进 `public/screenshots/`（推荐 `.jpg`，宽 600px 左右），
页面自动显示；`.jpg` 找不到会退回 `.png`，都没有才显示占位提示，不会报错。

## 说明

站点仅用于产品介绍与技术交流，音乐内容均来自各平台公开接口，不存储任何音乐文件。
