import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n';
import { ReleasesService } from '../core/releases';
import { APP } from '../site-content';
import { Icon } from '../shared/icon';
import { RevealDirective } from '../shared/reveal';

@Component({
  selector: 'app-changelog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RevealDirective],
  template: `
    <section class="st-section" id="changelog">
      <div class="st-container">
        <header class="st-center-head" appReveal>
          <span class="st-eyebrow">{{ i18n.t({ zh: '更新日志', en: 'Changelog' }) }}</span>
          <h2 class="st-title">{{ i18n.t({ zh: '最近更新了什么', en: 'What’s new' }) }}</h2>
        </header>

        @for (entry of releases(); track entry.version) {
          <article class="st-card entry" appReveal>
            <div class="head">
              <h3>v{{ entry.version }}</h3>
              @if ($index === 0) {
                <span class="badge">{{ i18n.t({ zh: '最新', en: 'Latest' }) }}</span>
              }
              @if (entry.date) {
                <span class="date">{{ entry.date }}</span>
              }
            </div>

            <ul>
              @for (item of entry.notes ?? []; track item.zh) {
                <li>
                  <app-icon name="check" [size]="17" />
                  <span>{{ i18n.t(item) }}</span>
                </li>
              }
            </ul>
          </article>
        }

        <div class="more" appReveal>
          <a class="link" [href]="app.releasesUrl" target="_blank" rel="noopener">
            {{ i18n.t({ zh: '在 GitHub 上查看全部版本', en: 'See every release on GitHub' }) }}
            <app-icon name="arrow-right" [size]="17" />
          </a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .entry {
      max-width: 820px;
      margin: 48px auto 0;
    }

    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .head h3 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .badge {
      padding: 5px 12px;
      border-radius: 999px;
      background: var(--st-primary-container);
      color: var(--st-on-primary-container);
      font-size: 12px;
      font-weight: 600;
    }

    .date {
      font-size: 13px;
      color: var(--st-on-surface-variant);
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 13px;
    }

    li {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      font-size: 14.5px;
      line-height: 1.65;
      color: var(--st-on-surface-variant);
    }

    li app-icon {
      margin-top: 3px;
      color: var(--st-primary);
    }

    .more {
      margin-top: 30px;
      text-align: center;
    }

    .link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14.5px;
      font-weight: 600;
      color: var(--st-primary);
    }

    .link:hover {
      text-decoration: underline;
    }
  `,
})
export class Changelog {
  protected readonly i18n = inject(I18nService);
  protected readonly app = APP;
  protected readonly releases = inject(ReleasesService).releases;
}
