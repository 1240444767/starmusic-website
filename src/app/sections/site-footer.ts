import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n';
import { ReleasesService } from '../core/releases';
import { APP, NAV } from '../site-content';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <footer class="footer">
      <div class="st-container inner">
        <div class="brand">
          <img src="icon/app-icon.webp" width="40" height="40" alt="" />
          <div>
            <p class="name">{{ i18n.t(app.name) }}</p>
            <p class="ver">v{{ releases.latestVersion() }} · {{ app.packageId }}</p>
          </div>
        </div>

        <nav class="links">
          @for (item of nav; track item.id) {
            <a [href]="'#' + item.id">{{ i18n.t(item.label) }}</a>
          }
        </nav>

        <nav class="links">
          <a [href]="app.releasesUrl" target="_blank" rel="noopener">
            <app-icon name="download" [size]="15" />
            {{ i18n.t({ zh: '所有版本', en: 'Releases' }) }}
          </a>
          <a [href]="app.issuesUrl" target="_blank" rel="noopener">
            <app-icon name="bug" [size]="15" />
            {{ i18n.t({ zh: '问题反馈', en: 'Feedback' }) }}
          </a>
          <a [href]="app.siteRepoUrl" target="_blank" rel="noopener">
            <app-icon name="github" [size]="15" />
            {{ i18n.t({ zh: '官网源码', en: 'Site source' }) }}
          </a>
        </nav>

        <a class="top" href="#top">
          {{ i18n.t({ zh: '回到顶部', en: 'Back to top' }) }}
          <app-icon name="arrow-up" [size]="16" />
        </a>
      </div>

      <div class="st-container bottom">
        <p>
          © {{ year }} {{ i18n.t(app.name) }} ·
          {{ i18n.t({ zh: '仅供个人学习与技术交流', en: 'For personal study only' }) }}
        </p>
        <p>Built with Angular {{ angularVersion }} &amp; Material 3</p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      margin-top: 40px;
      padding: 56px 0 32px;
      background: var(--st-surface-low);
      border-top: 1px solid color-mix(in srgb, var(--st-outline) 40%, transparent);
    }

    .inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 28px 40px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand img {
      border-radius: 12px;
    }

    .name {
      font-size: 16px;
      font-weight: 700;
    }

    .ver {
      margin-top: 2px;
      font-size: 12.5px;
      color: var(--st-on-surface-variant);
    }

    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 20px;
      font-size: 14px;
      color: var(--st-on-surface-variant);
    }

    .links a {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      transition: color 0.2s ease;
    }

    .links a:hover {
      color: var(--st-primary);
    }

    .top {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      padding: 10px 18px;
      border-radius: 999px;
      background: var(--st-card);
      border: 1px solid color-mix(in srgb, var(--st-outline) 40%, transparent);
      font-size: 13.5px;
      font-weight: 600;
    }

    .top:hover {
      color: var(--st-primary);
    }

    .bottom {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 8px 24px;
      margin-top: 40px;
      padding-top: 22px;
      border-top: 1px solid color-mix(in srgb, var(--st-outline) 40%, transparent);
      font-size: 12.5px;
      color: var(--st-on-surface-variant);
    }
  `,
})
export class SiteFooter {
  protected readonly i18n = inject(I18nService);
  protected readonly app = APP;
  protected readonly nav = NAV;
  protected readonly year = new Date().getFullYear();
  protected readonly angularVersion = '22';
  protected readonly releases = inject(ReleasesService);
}
