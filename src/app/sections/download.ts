import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { I18nService } from '../core/i18n';
import { ReleasesService } from '../core/releases';
import {
  APP,
  CLOUD_MIRRORS,
  CLOUD_NOTE,
  DOWNLOAD_SOURCES,
  DownloadSource,
  INSTALL_STEPS,
  MIRROR_NOTE,
  REQUIREMENTS,
  SOURCE_STORAGE_KEY,
  releaseDownloadUrl,
  sourceDownloadUrl,
} from '../site-content';
import { Icon } from '../shared/icon';
import { RevealDirective } from '../shared/reveal';

@Component({
  selector: 'app-download',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RevealDirective],
  template: `
    <section class="st-section" id="download">
      <div class="st-container">
        <header class="st-center-head" appReveal>
          <span class="st-eyebrow">{{ i18n.t({ zh: '下载', en: 'Download' }) }}</span>
          <h2 class="st-title">
            {{ i18n.t({ zh: '下载星音乐', en: 'Get StarMusic' }) }}
          </h2>
          <p class="st-subtitle">
            {{
              i18n.t({
                zh: 'APK 直接托管在 GitHub Releases 上，免费下载，不经过任何第三方应用商店。',
                en: 'The APK is hosted on GitHub Releases — a direct download with no third-party store in between.'
              })
            }}
          </p>
        </header>

        <div class="layout">
          <div class="st-card panel" appReveal>
            <div class="brand">
              <img src="icon/app-icon.webp" width="72" height="72" alt="StarMusic icon" />
              <div>
                <h3>{{ i18n.t(app.name) }}</h3>
                <p>
                  v{{ latest().version }} · {{ i18n.t({ zh: '通用 APK', en: 'Universal APK' }) }}
                  @if (latest().size) {
                    · {{ latest().size }}
                  }
                </p>
              </div>
            </div>

            <dl class="req">
              @for (item of requirements(); track item.label.zh) {
                <div>
                  <dt>{{ i18n.t(item.label) }}</dt>
                  <dd>{{ i18n.t(item.value) }}</dd>
                </div>
              }
            </dl>

            @if (hasAsset()) {
              <div class="sources">
                <span class="src-label">{{ i18n.t({ zh: '下载线路', en: 'Source' }) }}</span>
                <div class="pills">
                  @for (s of sources; track s.id) {
                    <button
                      type="button"
                      class="pill"
                      [class.on]="s.id === source().id"
                      (click)="pickSource(s)"
                    >
                      {{ i18n.t(s.label) }}
                    </button>
                  }
                </div>
              </div>
              <p class="src-note">{{ i18n.t(mirrorNote) }}</p>
            }

            @if (clouds.length) {
              <div class="sources">
                <span class="src-label">{{ i18n.t({ zh: '网盘备用', en: 'Cloud drives' }) }}</span>
                <div class="pills">
                  @for (c of clouds; track c.id) {
                    <a class="pill cloud" [href]="c.url" target="_blank" rel="noopener">
                      <app-icon name="cloud-download" [size]="15" />
                      {{ i18n.t(c.label) }}
                    </a>
                  }
                </div>
              </div>
              <p class="src-note">{{ i18n.t(cloudNote) }}</p>
            }

            <a class="btn" [href]="downloadHref()" target="_blank" rel="noopener">
              <app-icon name="download" [size]="19" />
              @if (hasAsset()) {
                {{ i18n.t({ zh: '下载 APK', en: 'Download APK' }) }} v{{ latest().version }}
              } @else {
                {{ i18n.t({ zh: '前往 GitHub Releases 下载', en: 'Download from GitHub Releases' }) }}
              }
            </a>

            <div class="links">
              <a class="ghost" [href]="app.releasesUrl" target="_blank" rel="noopener">
                <app-icon name="github" [size]="16" />
                {{ i18n.t({ zh: '查看所有版本', en: 'All releases' }) }}
              </a>

              <button class="ghost" type="button" [disabled]="!hasAsset()" (click)="copyLink()">
                <app-icon [name]="copied() ? 'check' : 'link'" [size]="16" />
                {{
                  copied()
                    ? i18n.t({ zh: '已复制', en: 'Copied' })
                    : i18n.t({ zh: '复制直链', en: 'Copy link' })
                }}
              </button>
            </div>
          </div>

          <ol class="steps" appReveal [revealDelay]="120">
            @for (step of steps; track step.title.zh; let i = $index) {
              <li>
                <span class="num">{{ i + 1 }}</span>
                <div>
                  <h4>{{ i18n.t(step.title) }}</h4>
                  <p>{{ i18n.t(step.desc) }}</p>
                </div>
              </li>
            }
          </ol>
        </div>

        <p class="disclaimer" appReveal>
          <app-icon name="shield" [size]="16" />
          <span>
            {{
              i18n.t({
                zh: '星音乐是第三方聚合播放器，音乐内容均来自各平台公开接口，仅供个人学习与技术交流使用，请支持正版音乐。',
                en: 'StarMusic is a third-party aggregator. All music content comes from public provider interfaces and is intended for personal study and technical exchange — please support the official releases.'
              })
            }}
          </span>
        </p>
      </div>
    </section>
  `,
  styles: `
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 24px;
      margin-top: 56px;
      align-items: start;
    }

    .panel {
      display: flex;
      flex-direction: column;
      gap: 22px;
      padding: 30px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .brand img {
      border-radius: 20px;
      box-shadow: var(--st-shadow-md);
    }

    .brand h3 {
      font-size: 22px;
      font-weight: 700;
    }

    .brand p {
      margin-top: 4px;
      font-size: 14px;
      color: var(--st-on-surface-variant);
    }

    .req {
      margin: 0;
      display: grid;
      gap: 1px;
      border-radius: var(--st-radius-sm);
      overflow: hidden;
      background: color-mix(in srgb, var(--st-outline) 35%, transparent);
    }

    .req > div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 16px;
      background: var(--st-surface-low);
      font-size: 13.5px;
    }

    .req dt {
      color: var(--st-on-surface-variant);
    }

    .req dd {
      margin: 0;
      font-weight: 600;
      text-align: right;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 15px 24px;
      border-radius: 999px;
      background: var(--st-primary);
      color: var(--st-on-primary);
      font-size: 15px;
      font-weight: 600;
      box-shadow: var(--st-shadow-md);
      transition:
        transform 0.2s cubic-bezier(0.2, 0, 0, 1),
        background-color 0.2s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
      background: var(--st-primary-hover);
    }

    .sources {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .src-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--st-on-surface-variant);
    }

    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill {
      padding: 6px 13px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--st-outline) 60%, transparent);
      background: transparent;
      color: var(--st-on-surface-variant);
      font: inherit;
      font-size: 12.5px;
      font-weight: 600;
      line-height: 1.5;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        border-color 0.18s ease;
    }

    .pill:hover {
      border-color: var(--st-primary);
      color: var(--st-primary);
    }

    .pill.on {
      background: var(--st-primary);
      border-color: var(--st-primary);
      color: var(--st-on-primary);
    }

    .pill.cloud {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      border-color: var(--st-primary);
      color: var(--st-primary);
      background: color-mix(in srgb, var(--st-primary) 10%, transparent);
    }

    .pill.cloud:hover {
      background: var(--st-primary);
      color: var(--st-on-primary);
    }

    .src-note {
      margin: -8px 0 0;
      font-size: 12.5px;
      line-height: 1.7;
      color: var(--st-on-surface-variant);
    }

    .ghost {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 0;
      border: 0;
      background: transparent;
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 600;
      color: var(--st-primary);
      cursor: pointer;
    }

    .ghost:hover {
      text-decoration: underline;
    }

    .ghost:disabled {
      opacity: 0.5;
      cursor: default;
      text-decoration: none;
    }

    .links {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 22px;
      flex-wrap: wrap;
    }

    .steps {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 18px;
      counter-reset: step;
    }

    .steps li {
      display: flex;
      gap: 16px;
      padding: 22px 24px;
      border-radius: var(--st-radius-md);
      background: var(--st-surface-low);
      border: 1px solid color-mix(in srgb, var(--st-outline) 32%, transparent);
    }

    .num {
      flex: none;
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 12px;
      background: var(--st-primary);
      color: var(--st-on-primary);
      font-size: 15px;
      font-weight: 700;
    }

    .steps h4 {
      font-size: 16px;
      font-weight: 600;
    }

    .steps p {
      margin-top: 6px;
      font-size: 14px;
      line-height: 1.65;
      color: var(--st-on-surface-variant);
    }

    .disclaimer {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      max-width: 780px;
      margin: 44px auto 0;
      font-size: 13px;
      line-height: 1.7;
      color: var(--st-on-surface-variant);
      text-align: left;
    }

    .disclaimer app-icon {
      margin-top: 3px;
      color: var(--st-primary);
    }

    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Download {
  protected readonly i18n = inject(I18nService);
  protected readonly app = APP;
  protected readonly steps = INSTALL_STEPS;

  /** 最新版本；releases.json 里写了 asset 就直链到 APK，否则退回该版本的 Release 页面 */
  protected readonly latest = inject(ReleasesService).latest;
  protected readonly hasAsset = computed(() => !!this.latest().asset);

  /** 多源镜像：线路清单 + 访客当前选择（记在 localStorage 里，下次打开还是这条） */
  protected readonly sources = DOWNLOAD_SOURCES;
  protected readonly mirrorNote = MIRROR_NOTE;
  protected readonly clouds = CLOUD_MIRRORS;
  protected readonly cloudNote = CLOUD_NOTE;
  private readonly sourceId = signal<string>(readStoredSource());
  protected readonly source = computed(
    () => this.sources.find((s) => s.id === this.sourceId()) ?? this.sources[0],
  );

  /** 当前线路下的下载地址；没有资产时退回 Release 页面，镜像前缀不参与 */
  protected readonly downloadHref = computed(() => {
    const href = releaseDownloadUrl(this.latest());
    return sourceDownloadUrl(this.hasAsset() ? this.source() : this.sources[0], href);
  });

  protected pickSource(source: DownloadSource): void {
    this.sourceId.set(source.id);
    try {
      localStorage.setItem(SOURCE_STORAGE_KEY, source.id);
    } catch {
      /* 隐私模式下写不了，忽略 */
    }
  }

  /** 「已复制」提示的短暂时态 */
  protected readonly copied = signal(false);

  /** 复制当前线路的直链（发群、发帖时可以直接贴） */
  protected async copyLink(): Promise<void> {
    const url = this.downloadHref();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // 非安全上下文或旧浏览器没有 clipboard API，退回 execCommand
      const scratch = document.createElement('textarea');
      scratch.value = url;
      scratch.setAttribute('readonly', '');
      scratch.style.position = 'fixed';
      scratch.style.opacity = '0';
      document.body.appendChild(scratch);
      scratch.select();
      try {
        document.execCommand('copy');
      } catch {
        /* 复制不了就算了，别打断浏览 */
      }
      scratch.remove();
    }
    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1600);
  }

  /** 版本/体积两行由 releases.json 的最新版本填值，缺值就退回静态文案 */
  protected readonly requirements = computed(() => {
    const r = this.latest();
    return REQUIREMENTS.map((item) => {
      if (item.from === 'version') return { ...item, value: { zh: r.version, en: r.version } };
      if (item.from === 'size' && r.size) return { ...item, value: { zh: r.size, en: r.size } };
      return item;
    });
  });
}

/** 读上次选的下载线路；localStorage 不可用时一律回到 GitHub 直连 */
function readStoredSource(): string {
  try {
    return localStorage.getItem(SOURCE_STORAGE_KEY) ?? DOWNLOAD_SOURCES[0].id;
  } catch {
    return DOWNLOAD_SOURCES[0].id;
  }
}
