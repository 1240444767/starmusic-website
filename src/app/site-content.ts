import { Localized } from './core/i18n';

/**
 * GitHub 账号与「官网仓库」。
 *
 * App 源码是闭源的，所以官网上所有 GitHub 入口都指向这个**公开的官网仓库**：
 * 它只放官网源码，Release 页当网盘用，专门挂 APK —— 访客下载 Release 资产不需要登录。
 * 仓库建好后只要改这里的 repo 一处，全站链接跟着变。
 */
export const GITHUB = {
  owner: '1240444767',
  repo: 'starmusic-website',
} as const;

/** 公开的官网仓库地址（官网源码 + APK Releases 都在这里） */
export const SITE_REPO_URL = `https://github.com/${GITHUB.owner}/${GITHUB.repo}`;

/** 应用与仓库的固定信息（改这里就能全站生效） */
export const APP = {
  name: { zh: '星音乐', en: 'StarMusic' } satisfies Localized,
  /** 兜底版本号：有 releases.json 时以它为准 */
  version: '1.9.0',
  packageId: 'com.starbox.starmusic',
  siteRepoUrl: SITE_REPO_URL,
  releasesUrl: `${SITE_REPO_URL}/releases`,
  latestReleaseUrl: `${SITE_REPO_URL}/releases/latest`,
  issuesUrl: `${SITE_REPO_URL}/issues`,
} as const;

/** 某个版本的 APK 直链；没写资产名时退回该版本的 Release 页面 */
export function releaseDownloadUrl(entry: { tag: string; asset?: string }): string {
  return entry.asset
    ? `${APP.releasesUrl}/download/${entry.tag}/${entry.asset}`
    : `${APP.releasesUrl}/tag/${entry.tag}`;
}

/**
 * 下载线路（多源镜像开关）。
 *
 * GitHub 的 Release 资产在国内常连不上，所以除了直连，再并列几条第三方公益加速线路供访客切换：
 * 它们只把 GitHub 链接原样转发（`前缀 + GitHub 原始链接`），不保存任何文件。
 * 线路由第三方维护、随时可能失效，因此默认永远是 GitHub 直连，某条不通就换一条或换回直连。
 */
export interface DownloadSource {
  id: string;
  label: Localized;
  /** 空字符串 = GitHub 直连；其它是转发前缀，直接拼在 GitHub 原始链接前面 */
  prefix: string;
}

export const DOWNLOAD_SOURCES: DownloadSource[] = [
  { id: 'github', label: { zh: 'GitHub 直连', en: 'GitHub' }, prefix: '' },
  { id: 'gh-proxy', label: { zh: 'gh-proxy', en: 'gh-proxy' }, prefix: 'https://gh-proxy.com/' },
  { id: 'llkk', label: { zh: 'llkk', en: 'llkk' }, prefix: 'https://gh.llkk.cc/' },
  { id: 'ghfast', label: { zh: 'ghfast', en: 'ghfast' }, prefix: 'https://ghfast.top/' },
  { id: 'ghproxy', label: { zh: 'ghproxy', en: 'ghproxy' }, prefix: 'https://ghproxy.net/' },
];

/** 记住访客选的线路 */
export const SOURCE_STORAGE_KEY = 'st-dl-source';

/** 把某条线路的前缀套到 GitHub 原始链接上 */
export function sourceDownloadUrl(source: DownloadSource, url: string): string {
  return source.prefix ? source.prefix + url : url;
}

/** 镜像线路的说明文案 */
export const MIRROR_NOTE: Localized = {
  zh: '镜像为第三方公益加速线路，只转发 GitHub 链接、不保存文件；某条线路不通时换一条或换回直连即可。',
  en: 'Mirrors are community-run GitHub proxies: they only forward the link and store nothing. If a route fails, pick another or switch back to GitHub.',
};

export interface NavItem {
  /** 锚点 id，同时也是滚动定位目标 */
  id: string;
  label: Localized;
}

export const NAV: NavItem[] = [
  { id: 'features', label: { zh: '功能', en: 'Features' } },
  { id: 'preview', label: { zh: '界面预览', en: 'Screenshots' } },
  { id: 'play', label: { zh: '玩一玩', en: 'Playground' } },
  { id: 'platforms', label: { zh: '音乐平台', en: 'Platforms' } },
  { id: 'changelog', label: { zh: '更新日志', en: 'Changelog' } },
  { id: 'download', label: { zh: '下载', en: 'Download' } },
];

// -----------------------------------------------------------------------------
// 「玩一玩」区块：主题种子色 + 猜你想搜，两段纯前端演示
// -----------------------------------------------------------------------------

export interface ThemeSeedPreset {
  name: Localized;
  hex: string;
}

/** App 设置页的 12 套主题种子色，取值与 `ThemeSeed.kt` 的 presets 一一对应 */
export const THEME_SEEDS: ThemeSeedPreset[] = [
  { name: { zh: '默认蓝', en: 'Default blue' }, hex: '#2f6fed' },
  { name: { zh: '靛蓝', en: 'Indigo' }, hex: '#4f46e5' },
  { name: { zh: '青蓝', en: 'Cyan blue' }, hex: '#0097a7' },
  { name: { zh: '翠绿', en: 'Emerald' }, hex: '#2e9e5b' },
  { name: { zh: '墨绿', en: 'Deep green' }, hex: '#2f6f5e' },
  { name: { zh: '柠檬', en: 'Lime' }, hex: '#8fbf2e' },
  { name: { zh: '橙', en: 'Orange' }, hex: '#f28c28' },
  { name: { zh: '珊瑚红', en: 'Coral' }, hex: '#e5534b' },
  { name: { zh: '玫红', en: 'Rose' }, hex: '#e0489b' },
  { name: { zh: '紫', en: 'Violet' }, hex: '#8b5cf6' },
  { name: { zh: '棕', en: 'Brown' }, hex: '#8d6e63' },
  { name: { zh: '灰蓝', en: 'Slate blue' }, hex: '#5a6b8c' },
];

/** App 的默认种子色（ThemeSeed.DEFAULT） */
export const DEFAULT_SEED = THEME_SEEDS[0].hex;

/** 访客选过的种子色存这里 */
export const SEED_STORAGE_KEY = 'st-seed';

/** 「猜你想搜」演示用的联想词池（真实 App 是四个平台接口并发返回） */
export const SEARCH_HINTS: Localized[] = [
  { zh: '周杰伦', en: 'Jay Chou' },
  { zh: '林俊杰', en: 'JJ Lin' },
  { zh: '陈奕迅', en: 'Eason Chan' },
  { zh: '邓紫棋', en: 'G.E.M.' },
  { zh: '五月天', en: 'Mayday' },
  { zh: '李荣浩', en: 'Li Ronghao' },
  { zh: '毛不易', en: 'Mao Buyi' },
  { zh: '薛之谦', en: 'Joker Xue' },
  { zh: '张韶涵', en: 'Angela Chang' },
  { zh: '王菲', en: 'Faye Wong' },
  { zh: '民谣', en: 'Folk' },
  { zh: '摇滚', en: 'Rock' },
  { zh: '粤语', en: 'Cantopop' },
  { zh: '古风', en: 'Guofeng' },
  { zh: '电子', en: 'Electronic' },
  { zh: '钢琴', en: 'Piano' },
  { zh: '爵士', en: 'Jazz' },
  { zh: '纯音乐', en: 'Instrumental' },
  { zh: '轻音乐', en: 'Easy listening' },
  { zh: '华语', en: 'Mandopop' },
  { zh: '欧美', en: 'Western pop' },
  { zh: '日系', en: 'J-pop' },
  { zh: '深夜', en: 'Late night' },
  { zh: '通勤', en: 'Commute' },
  { zh: '学习', en: 'Study' },
  { zh: '助眠', en: 'Sleep' },
  { zh: '运动', en: 'Workout' },
  { zh: '怀旧', en: 'Nostalgic' },
];

export interface Stat {
  value: string;
  label: Localized;
}

export const STATS: Stat[] = [
  { value: '4', label: { zh: '个音乐平台聚合', en: 'music platforms' } },
  { value: '12', label: { zh: '套主题种子色', en: 'theme seed colors' } },
  { value: '30', label: { zh: '首每日推荐', en: 'daily picks' } },
  { value: 'M3E', label: { zh: 'Material 3 Expressive', en: 'Material 3 Expressive' } },
];

export interface Feature {
  icon: string;
  title: Localized;
  desc: Localized;
}

export const FEATURES: Feature[] = [
  {
    icon: 'layers',
    title: { zh: '四平台聚合', en: 'Four platforms, one app' },
    desc: {
      zh: '搜索、歌单、榜单与歌手一次汇总，覆盖酷我、酷狗、QQ 音乐与网易云音乐，切换平台不用换应用。',
      en: 'Search, playlists, charts and artists from Kuwo, Kugou, QQ Music and NetEase Cloud Music in a single client.',
    },
  },
  {
    icon: 'search',
    title: { zh: '猜你想搜', en: 'Search suggestions' },
    desc: {
      zh: '边打字边联想：四个平台并发取词、轮流混排再去重，点一下关键词直接开搜。',
      en: 'Type-ahead suggestions fetched from all four providers in parallel, interleaved, de-duplicated and one tap away from a search.',
    },
  },
  {
    icon: 'sparkle',
    title: { zh: '每日推荐 · 新歌速递', en: 'Daily picks & new songs' },
    desc: {
      zh: '每天固定一份 30 首推荐并缓存在本地，与「新歌速递」跨区块自动去重，素材不足时用榜单补位。',
      en: 'A stable 30-track daily mix cached on device, de-duplicated against the new-release row and topped up from charts when needed.',
    },
  },
  {
    icon: 'palette',
    title: { zh: '主题种子色', en: 'Theme seed colors' },
    desc: {
      zh: '内置 12 套预设配色（默认蓝 #2F6FED 起），选中一个种子色即可全应用即时换肤。',
      en: 'Twelve built-in palettes starting from the default blue #2F6FED — pick a seed colour and the whole app re-themes instantly.',
    },
  },
  {
    icon: 'star',
    title: { zh: 'Material 3 Expressive', en: 'Material 3 Expressive' },
    desc: {
      zh: '大圆角形状、胶囊按钮、形状化图标与动态配色，界面全部按 M3E 规范实现。',
      en: 'Expressive shapes, pill-shaped controls, shape morphing and dynamic colour, all built to the Material 3 Expressive spec.',
    },
  },
  {
    icon: 'music',
    title: { zh: '标签歌单', en: 'Tag playlists' },
    desc: {
      zh: '民谣、摇滚、经典、古风等 12 个标签，一键进入跨平台聚合歌单。',
      en: 'Twelve moods and genres — folk, rock, classics, guofeng and more — one tap into an aggregated playlist.',
    },
  },
  {
    icon: 'cloud-download',
    title: { zh: '离线下载', en: 'Offline download' },
    desc: {
      zh: '支持批量下载，保存目录与文件名规则自动跟随应用名称生成。',
      en: 'Batch downloads with a save folder and naming rule derived from the app name.',
    },
  },
  {
    icon: 'lyrics',
    title: { zh: '歌词与播放器', en: 'Lyrics & player' },
    desc: {
      zh: '全屏播放器、歌词随曲滚动，并从封面提取主色生成渐变背景。',
      en: 'A full-screen player with scrolling lyrics and a gradient backdrop extracted from the cover art.',
    },
  },
  {
    icon: 'heart',
    title: { zh: '我的音乐', en: 'Your library' },
    desc: {
      zh: '我喜欢、最近播放、本地歌单与下载管理集中在一处。',
      en: 'Liked songs, recently played, local playlists and download management in one place.',
    },
  },
];

export interface Shot {
  /** public/screenshots/<file> —— 把截图按这个名字丢进去即可自动显示 */
  file: string;
  label: Localized;
  desc: Localized;
}

export const SHOTS: Shot[] = [
  {
    file: 'home',
    label: { zh: '首页', en: 'Home' },
    desc: { zh: '随心榜单 · 每日推荐 · 新歌速递', en: 'Charts, daily picks, new songs' },
  },
  {
    file: 'player',
    label: { zh: '播放器', en: 'Player' },
    desc: { zh: '封面取色与滚动歌词', en: 'Cover colours and lyrics' },
  },
  {
    file: 'search',
    label: { zh: '搜索', en: 'Search' },
    desc: { zh: '四平台聚合与猜你想搜', en: 'Four-platform search' },
  },
  {
    file: 'playlist',
    label: { zh: '歌单', en: 'Playlists' },
    desc: { zh: '标签歌单与歌单详情', en: 'Tag playlists and details' },
  },
];

export interface Platform {
  name: Localized;
  color: string;
  tags: Localized;
}

export const PLATFORMS: Platform[] = [
  {
    name: { zh: '酷我音乐', en: 'Kuwo Music' },
    color: '#ffd200',
    tags: { zh: '搜索 · 歌单 · 榜单', en: 'Search · Playlists · Charts' },
  },
  {
    name: { zh: '酷狗音乐', en: 'Kugou Music' },
    color: '#22b8ff',
    tags: { zh: '搜索 · 歌单 · 歌手', en: 'Search · Playlists · Artists' },
  },
  {
    name: { zh: 'QQ 音乐', en: 'QQ Music' },
    color: '#31c27c',
    tags: { zh: '搜索 · 歌单 · 分类', en: 'Search · Playlists · Categories' },
  },
  {
    name: { zh: '网易云音乐', en: 'NetEase Cloud Music' },
    color: '#e60026',
    tags: { zh: '搜索 · 歌单 · 榜单', en: 'Search · Playlists · Charts' },
  },
];

export interface ChangelogEntry {
  version: string;
  badge: Localized;
  items: Localized[];
}

/**
 * 内置的更新日志，同时是 `public/releases.json` 读取失败时的兜底数据。
 * 正常发版只需要改 `website/public/releases.json`，不用碰这个文件。
 */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.9.0',
    badge: { zh: '最新', en: 'Latest' },
    items: [
      { zh: '首页新增「每日推荐」「新歌速递」与标签歌单入口', en: 'New daily picks, new-release row and tag-playlist entry on the home page' },
      { zh: '搜索页新增「猜你想搜」，四平台聚合取词并去重', en: 'Type-ahead search suggestions aggregated and de-duplicated across four providers' },
      { zh: '搜索页与关于页按 Material 3 Expressive 重新实现', en: 'Search and About screens rebuilt with Material 3 Expressive' },
      { zh: '主题种子色支持 12 套预设配色，切换即时生效', en: 'Twelve seed colours with instant app-wide re-theming' },
      { zh: '下载目录自动跟随应用名称生成，不再写死路径', en: 'Download folder now derives from the app name instead of a hard-coded path' },
      { zh: '启动页、首页与播放器细节优化，切换更顺滑', en: 'Splash, home and player polish for smoother transitions' },
    ],
  },
];

export interface Requirement {
  label: Localized;
  value: Localized;
  /** 该行由 releases.json 的最新版本填值（version / size），没有时用 value 兜底 */
  from?: 'version' | 'size';
}

export const REQUIREMENTS: Requirement[] = [
  { label: { zh: '版本', en: 'Version' }, value: { zh: APP.version, en: APP.version }, from: 'version' },
  {
    label: { zh: '系统要求', en: 'Requires' },
    value: { zh: 'Android 7.0 (API 24) 及以上', en: 'Android 7.0 (API 24) or newer' },
  },
  {
    label: { zh: '包名', en: 'Package' },
    value: { zh: APP.packageId, en: APP.packageId },
  },
  {
    label: { zh: '体积', en: 'Size' },
    value: { zh: '以 GitHub Release 为准', en: 'As listed on GitHub Releases' },
    from: 'size',
  },
];

export interface Step {
  title: Localized;
  desc: Localized;
}

export const INSTALL_STEPS: Step[] = [
  {
    title: { zh: '下载 APK', en: 'Download the APK' },
    desc: {
      zh: '从 GitHub Releases 页面下载最新版本的 APK 安装包。',
      en: 'Grab the newest APK from the GitHub Releases page.',
    },
  },
  {
    title: { zh: '允许安装未知应用', en: 'Allow unknown sources' },
    desc: {
      zh: '首次安装时，系统会提示授权「安装未知应用」，允许当前浏览器即可。',
      en: 'On first install Android asks you to allow installing unknown apps — approve it for your browser.',
    },
  },
  {
    title: { zh: '安装并打开', en: 'Install and enjoy' },
    desc: {
      zh: '安装完成后打开星音乐，选一个主题种子色就可以开始听了。',
      en: 'Open StarMusic, pick a theme seed colour and start listening.',
    },
  },
];
