import { Injectable, computed, signal } from '@angular/core';
import { APP, CHANGELOG } from '../site-content';
import { Localized } from './i18n';

/** `public/releases.json` 里的一条版本记录 */
export interface ReleaseEntry {
  /** 版本号，不带 v，例如 `1.9.0` */
  version: string;
  /** Release 的 tag，例如 `v1.9.0` */
  tag: string;
  /** 可选的发布日期，填写后显示在版本号旁边，例如 `2026-09-30` */
  date?: string;
  /** Release 里 APK 资产的文件名；留空则下载按钮退回该版本的 Release 页面 */
  asset?: string;
  /** 可选：展示用的体积文案，例如 `8.4 MB` */
  size?: string;
  /** 可选：该版本单独的蓝奏云分享链接，填了就在「网盘备用」里多出一个本版直链 */
  lanzou?: string;
  /** 该版本的更新条目（中英各一份） */
  notes?: Localized[];
}

/** releases.json 读不到时的兜底：至少让页面有一份真实数据 */
const FALLBACK: ReleaseEntry[] = [
  {
    version: APP.version,
    tag: `v${APP.version}`,
    notes: CHANGELOG[0]?.items ?? [],
  },
];

/**
 * 版本列表。
 *
 * 启动时读一次 `releases.json`（放在 `public/` 下，与站点同源，无需任何接口与令牌），
 * 读不到或字段为空就退回内置兜底数据 —— 页面永远不会空着。
 */
@Injectable({ providedIn: 'root' })
export class ReleasesService {
  private readonly list = signal<ReleaseEntry[]>(FALLBACK);

  /** 全部版本，第一条即最新版 */
  readonly releases = this.list.asReadonly();

  /** 最新版本 */
  readonly latest = computed(() => this.list()[0] ?? FALLBACK[0]);

  /** 最新版本号 */
  readonly latestVersion = computed(() => this.latest().version);

  constructor() {
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      const res = await fetch('releases.json', { cache: 'no-cache' });
      if (!res.ok) {
        return;
      }
      const data: unknown = await res.json();
      const entries = (data as { releases?: ReleaseEntry[] } | null)?.releases;
      if (Array.isArray(entries) && entries.length > 0) {
        this.list.set(entries);
      }
    } catch {
      // 离线打开或文件还没建好：保持内置兜底数据
    }
  }
}
