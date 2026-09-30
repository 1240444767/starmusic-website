import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n';
import { ReleasesService } from '../core/releases';
import { APP, PLATFORMS, STATS } from '../site-content';
import { Icon } from '../shared/icon';
import { PhoneShot } from './phone-shot';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PhoneShot],
  template: `
    <section class="hero" id="top">
      <div class="st-container hero__inner">
        <div class="hero__copy">
          <span class="badge">
            <app-icon name="sparkle" [size]="15" />
            v{{ releases.latestVersion() }} · Material 3 Expressive
          </span>

          <h1>
            <span class="st-gradient-text">{{ i18n.t(app.name) }}</span>
          </h1>

          <p class="tagline">
            {{
              i18n.t({
                zh: '把四大音乐平台，装进一个 Material 3 播放器',
                en: 'Four music platforms in one Material 3 player'
              })
            }}
          </p>

          <p class="lead">
            {{
              i18n.t({
                zh: '星音乐是一款 Android 平台的音乐播放器：聚合酷我、酷狗、QQ 音乐与网易云音乐的搜索、歌单与榜单，内置 12 套主题种子色，还有每日推荐、猜你想搜与离线下载。',
                en: 'StarMusic is an Android music player that aggregates search, playlists and charts from Kuwo, Kugou, QQ Music and NetEase Cloud Music — with twelve theme seed colours, daily picks, type-ahead search and offline downloads.'
              })
            }}
          </p>

          <div class="cta">
            <a class="btn btn--filled" href="#download">
              <app-icon name="download" [size]="19" />
              {{ i18n.t({ zh: '下载 APK', en: 'Download APK' }) }}
            </a>
            <a class="btn btn--outlined" [href]="app.releasesUrl" target="_blank" rel="noopener">
              <app-icon name="github" [size]="18" />
              {{ i18n.t({ zh: '所有版本', en: 'All releases' }) }}
            </a>
          </div>

          <p class="req">
            <app-icon name="android" [size]="16" />
            {{ i18n.t({ zh: '支持 Android 7.0 及以上', en: 'Android 7.0 and above' }) }}
            <span class="dot">·</span>
            {{ app.packageId }}
          </p>

          <dl class="stats">
            @for (stat of stats; track stat.value) {
              <div>
                <dt>{{ stat.value }}</dt>
                <dd>{{ i18n.t(stat.label) }}</dd>
              </div>
            }
          </dl>
        </div>

        <div class="hero__visual">
          <div class="glow"></div>
          <app-phone-shot file="home.png" [label]="i18n.t({ zh: '首页预览', en: 'Home preview' })" />

          <ul class="chips">
            @for (p of platforms; track p.name.zh; let i = $index) {
              <li [style.animation-delay.ms]="i * 320">
                <span class="dot" [style.background]="p.color"></span>
                {{ i18n.t(p.name) }}
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      overflow: hidden;
      padding: 132px 0 88px;
    }

    .hero::before {
      content: '';
      position: absolute;
      inset: -30% -10% auto -10%;
      height: 900px;
      background:
        radial-gradient(46% 46% at 22% 34%, var(--st-glow-1) 0%, transparent 70%),
        radial-gradient(40% 40% at 78% 12%, var(--st-glow-2) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(var(--st-grid) 1px, transparent 1px),
        linear-gradient(90deg, var(--st-grid) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: radial-gradient(70% 60% at 50% 22%, #000 0%, transparent 78%);
      -webkit-mask-image: radial-gradient(70% 60% at 50% 22%, #000 0%, transparent 78%);
      pointer-events: none;
      z-index: 0;
    }

    .hero__inner {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
      gap: 56px;
      align-items: center;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 15px 7px 12px;
      border-radius: 999px;
      background: var(--st-primary-container);
      color: var(--st-on-primary-container);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    h1 {
      margin-top: 22px;
      font-size: clamp(46px, 7vw, 76px);
      font-weight: 700;
      letter-spacing: -0.03em;
    }

    .tagline {
      margin-top: 16px;
      font-size: clamp(19px, 2.4vw, 25px);
      font-weight: 500;
      line-height: 1.45;
      max-width: 560px;
    }

    .lead {
      margin-top: 18px;
      max-width: 560px;
      font-size: 16px;
      line-height: 1.75;
      color: var(--st-on-surface-variant);
    }

    .cta {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 30px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 26px;
      border-radius: 999px;
      font-size: 15px;
      font-weight: 600;
      transition:
        transform 0.2s cubic-bezier(0.2, 0, 0, 1),
        box-shadow 0.2s ease,
        background-color 0.2s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .btn--filled {
      background: var(--st-primary);
      color: var(--st-on-primary);
      box-shadow: var(--st-shadow-md);
    }

    .btn--filled:hover {
      background: var(--st-primary-hover);
    }

    .btn--outlined {
      border: 1px solid var(--st-outline);
      color: var(--st-on-surface);
      background: var(--st-card);
    }

    .req {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 22px;
      font-size: 13px;
      color: var(--st-on-surface-variant);
    }

    .req .dot {
      opacity: 0.5;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 18px;
      margin: 40px 0 0;
      padding-top: 26px;
      border-top: 1px solid color-mix(in srgb, var(--st-outline) 45%, transparent);
    }

    .stats dt {
      font-size: 24px;
      font-weight: 700;
      color: var(--st-primary);
      letter-spacing: -0.02em;
    }

    .stats dd {
      margin: 4px 0 0;
      font-size: 13px;
      color: var(--st-on-surface-variant);
    }

    .hero__visual {
      position: relative;
      display: grid;
      justify-items: center;
    }

    .glow {
      position: absolute;
      width: 340px;
      height: 340px;
      top: 6%;
      border-radius: 50%;
      background: radial-gradient(circle, var(--st-glow-1) 0%, transparent 68%);
      filter: blur(6px);
      animation: st-pulse 7s ease-in-out infinite;
    }

    .chips {
      display: none;
    }

    @media (min-width: 1000px) {
      .chips {
        display: block;
        position: absolute;
        inset: 0;
        margin: 0;
        padding: 0;
        list-style: none;
        pointer-events: none;
      }

      .chips li {
        position: absolute;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 15px;
        border-radius: 999px;
        background: var(--st-card);
        color: var(--st-on-surface);
        font-size: 13px;
        font-weight: 600;
        box-shadow: var(--st-shadow-md);
        border: 1px solid color-mix(in srgb, var(--st-outline) 40%, transparent);
        animation: st-float 6.5s ease-in-out infinite;
      }

      .chips li:nth-child(1) {
        top: 12%;
        left: -6%;
      }

      .chips li:nth-child(2) {
        top: 34%;
        right: -8%;
      }

      .chips li:nth-child(3) {
        bottom: 24%;
        left: -10%;
      }

      .chips li:nth-child(4) {
        bottom: 6%;
        right: -4%;
      }
    }

    @media (max-width: 980px) {
      .hero {
        padding-top: 112px;
      }

      .hero__inner {
        grid-template-columns: 1fr;
        gap: 44px;
      }
    }
  `,
})
export class Hero {
  protected readonly i18n = inject(I18nService);
  protected readonly app = APP;
  protected readonly stats = STATS;
  protected readonly platforms = PLATFORMS;
  protected readonly releases = inject(ReleasesService);
}
