import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { I18nService } from '../core/i18n';
import { ThemeService } from '../core/theme';
import { APP, NAV } from '../site-content';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatTooltipModule, Icon],
  template: `
    <mat-toolbar class="bar" [class.scrolled]="scrolled()">
      <div class="st-container inner">
        <a class="brand" href="#top">
          <img src="icon/app-icon.webp" width="34" height="34" alt="" />
          <span>{{ i18n.t(app.name) }}</span>
        </a>

        <nav class="nav">
          @for (item of nav; track item.id) {
            <a [href]="'#' + item.id">{{ i18n.t(item.label) }}</a>
          }
        </nav>

        <div class="actions">
          <button
            class="pill"
            type="button"
            (click)="i18n.toggle()"
            [matTooltip]="i18n.t({ zh: 'Switch to English', en: '切换到中文' })"
          >
            <app-icon name="globe" [size]="17" />
            <span>{{ i18n.isEnglish() ? '中文' : 'EN' }}</span>
          </button>

          <button
            matIconButton
            type="button"
            (click)="theme.toggle()"
            [matTooltip]="
              theme.isDark()
                ? i18n.t({ zh: '切换到浅色', en: 'Switch to light' })
                : i18n.t({ zh: '切换到深色', en: 'Switch to dark' })
            "
            [attr.aria-label]="i18n.t({ zh: '切换主题', en: 'Toggle theme' })"
          >
            <app-icon [name]="theme.isDark() ? 'sun' : 'moon'" [size]="20" />
          </button>

          <a
            class="icon-btn"
            [href]="app.releasesUrl"
            target="_blank"
            rel="noopener"
            matTooltip="GitHub Releases"
            aria-label="GitHub Releases"
          >
            <app-icon name="github" [size]="20" />
          </a>

          <a class="cta" href="#download">
            <app-icon name="download" [size]="17" />
            {{ i18n.t({ zh: '下载', en: 'Download' }) }}
          </a>

          <button
            class="menu-btn"
            matIconButton
            type="button"
            [matMenuTriggerFor]="mobileMenu"
            [attr.aria-label]="i18n.t({ zh: '菜单', en: 'Menu' })"
          >
            <app-icon name="menu" [size]="22" />
          </button>
        </div>
      </div>
    </mat-toolbar>

    <mat-menu #mobileMenu="matMenu" xPosition="before">
      @for (item of nav; track item.id) {
        <a mat-menu-item [href]="'#' + item.id">{{ i18n.t(item.label) }}</a>
      }
      <a mat-menu-item [href]="app.latestReleaseUrl" target="_blank" rel="noopener">
        {{ i18n.t({ zh: '下载 APK', en: 'Download APK' }) }}
      </a>
    </mat-menu>
  `,
  styles: `
    .bar {
      position: sticky;
      top: 0;
      z-index: 50;
      height: 68px;
      padding: 0;
      background: transparent;
      --mat-toolbar-container-background-color: transparent;
      --mat-toolbar-container-text-color: var(--st-on-surface);
      transition:
        background-color 0.25s ease,
        box-shadow 0.25s ease,
        backdrop-filter 0.25s ease;
    }

    .bar.scrolled {
      background: var(--st-header-bg);
      backdrop-filter: blur(16px) saturate(1.4);
      box-shadow: 0 1px 0 color-mix(in srgb, var(--st-outline) 45%, transparent);
    }

    .inner {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }

    .brand img {
      border-radius: 9px;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 18px;
      flex: 1;
    }

    .nav a {
      padding: 9px 14px;
      border-radius: 999px;
      font-size: 14.5px;
      font-weight: 500;
      color: var(--st-on-surface-variant);
      transition:
        background-color 0.2s ease,
        color 0.2s ease;
    }

    .nav a:hover {
      background: var(--st-surface-mid);
      color: var(--st-on-surface);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }

    .pill,
    .icon-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      height: 40px;
      padding: 0 14px;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: var(--st-on-surface);
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .icon-btn {
      padding: 0;
      width: 40px;
      justify-content: center;
      color: var(--st-on-surface-variant);
    }

    .pill:hover,
    .icon-btn:hover {
      background: var(--st-surface-mid);
    }

    .cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 42px;
      padding: 0 20px;
      border-radius: 999px;
      background: var(--st-primary);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      box-shadow: var(--st-shadow-sm);
      transition:
        transform 0.2s cubic-bezier(0.2, 0, 0, 1),
        background-color 0.2s ease;
    }

    .cta:hover {
      transform: translateY(-1px);
      background: var(--st-primary-hover);
    }

    .menu-btn {
      display: none;
    }

    @media (max-width: 1024px) {
      .nav {
        display: none;
      }

      .menu-btn {
        display: inline-flex;
      }
    }

    @media (max-width: 640px) {
      .icon-btn,
      .cta {
        display: none;
      }
    }
  `,
})
export class SiteHeader {
  protected readonly i18n = inject(I18nService);
  protected readonly theme = inject(ThemeService);
  protected readonly app = APP;
  protected readonly nav = NAV;
  protected readonly scrolled = signal(false);

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }
}
