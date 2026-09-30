import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n';
import { FEATURES } from '../site-content';
import { Icon } from '../shared/icon';
import { RevealDirective } from '../shared/reveal';

@Component({
  selector: 'app-features',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RevealDirective],
  template: `
    <section class="st-section" id="features">
      <div class="st-container">
        <header class="st-center-head" appReveal>
          <span class="st-eyebrow">{{ i18n.t({ zh: '功能', en: 'Features' }) }}</span>
          <h2 class="st-title">
            {{ i18n.t({ zh: '为听歌这件事做的九件事', en: 'Nine things built for listening' }) }}
          </h2>
          <p class="st-subtitle">
            {{
              i18n.t({
                zh: '从跨平台搜索到主题换肤，星音乐把日常听歌会用到的功能都做进了同一个界面。',
                en: 'From cross-platform search to instant re-theming, everything you reach for while listening lives in one interface.'
              })
            }}
          </p>
        </header>

        <div class="grid">
          @for (feature of features; track feature.title.zh; let i = $index) {
            <article class="st-card item" appReveal [revealDelay]="(i % 3) * 90">
              <span class="icon">
                <app-icon [name]="feature.icon" [size]="22" />
              </span>
              <h3>{{ i18n.t(feature.title) }}</h3>
              <p>{{ i18n.t(feature.desc) }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(288px, 1fr));
      gap: 20px;
      margin-top: 56px;
    }

    .item {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 26px;
    }

    .item:hover {
      transform: translateY(-4px);
      box-shadow: var(--st-shadow-md);
    }

    .icon {
      display: grid;
      place-items: center;
      width: 46px;
      height: 46px;
      border-radius: 15px;
      background: var(--st-primary-container);
      color: var(--st-on-primary-container);
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
    }

    p {
      font-size: 14.5px;
      line-height: 1.7;
      color: var(--st-on-surface-variant);
    }

    .item:nth-child(3n + 2) .icon {
      background: var(--st-secondary-container);
      color: var(--st-on-secondary-container);
    }

    .item:nth-child(3n + 3) .icon {
      background: var(--st-tertiary-container);
      color: var(--st-on-tertiary-container);
    }
  `,
})
export class Features {
  protected readonly i18n = inject(I18nService);
  protected readonly features = FEATURES;
}
