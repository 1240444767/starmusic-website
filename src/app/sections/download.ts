import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../core/i18n';
import { ReleasesService } from '../core/releases';
import { APP, INSTALL_STEPS, REQUIREMENTS, releaseDownloadUrl } from '../site-content';
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

            <a class="btn" [href]="downloadHref()" target="_blank" rel="noopener">
              <app-icon name="download" [size]="19" />
              @if (hasAsset()) {
                {{ i18n.t({ zh: '下载 APK', en: 'Download APK' }) }} v{{ latest().version }}
              } @else {
                {{ i18n.t({ zh: '前往 GitHub Releases 下载', en: 'Download from GitHub Releases' }) }}
              }
            </a>

            <a class="ghost" [href]="app.releasesUrl" target="_blank" rel="noopener">
              <app-icon name="github" [size]="16" />
              {{ i18n.t({ zh: '查看所有版本', en: 'All releases' }) }}
            </a>
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
      color: #fff;
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

    .ghost {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 13.5px;
      font-weight: 600;
      color: var(--st-primary);
    }

    .ghost:hover {
      text-decoration: underline;
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
      color: #fff;
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
  protected readonly downloadHref = computed(() => releaseDownloadUrl(this.latest()));

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
