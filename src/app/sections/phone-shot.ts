import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { Icon } from '../shared/icon';

/**
 * 手机外框 + 截图位。
 * 图片放在 `public/screenshots/<file>`，存在就显示，不存在显示占位提示，
 * 所以截图随时丢进去都能自动出现。
 */
@Component({
  selector: 'app-phone-shot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <figure class="phone">
      <div class="frame">
        <span class="notch"></span>
        <div class="screen">
          @if (!missing()) {
            <img
              [src]="src()"
              [alt]="label()"
              loading="lazy"
              decoding="async"
              (error)="missing.set(true)"
            />
          } @else {
            <div class="placeholder">
              <app-icon name="image" [size]="30" />
              <p class="hint">{{ label() }}</p>
              <code>screenshots/{{ file() }}</code>
            </div>
          }
        </div>
      </div>
      @if (caption()) {
        <figcaption>{{ caption() }}</figcaption>
      }
    </figure>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .phone {
      margin: 0 auto;
      width: 100%;
      max-width: 268px;
    }

    .frame {
      position: relative;
      aspect-ratio: 9 / 19.2;
      padding: 9px;
      border-radius: 42px;
      background: linear-gradient(160deg, #3b4152, #14171f 60%);
      box-shadow:
        var(--st-shadow-lg),
        inset 0 0 0 1px rgba(255, 255, 255, 0.09);
    }

    .notch {
      position: absolute;
      top: 18px;
      left: 50%;
      transform: translateX(-50%);
      width: 74px;
      height: 7px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      z-index: 2;
    }

    .screen {
      width: 100%;
      height: 100%;
      border-radius: 34px;
      overflow: hidden;
      background: var(--st-surface-mid);
      display: grid;
      place-items: center;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
    }

    .placeholder {
      display: grid;
      justify-items: center;
      gap: 8px;
      padding: 24px 18px;
      text-align: center;
      color: var(--st-on-surface-variant);
    }

    .hint {
      font-size: 13px;
      font-weight: 500;
      color: var(--st-on-surface);
    }

    code {
      font-size: 11px;
      opacity: 0.75;
      word-break: break-all;
    }

    figcaption {
      margin-top: 14px;
      text-align: center;
      font-size: 13px;
      color: var(--st-on-surface-variant);
    }
  `,
})
export class PhoneShot {
  /** public/screenshots 下的文件名，例如 home.png */
  readonly file = input.required<string>();
  readonly label = input('');
  readonly caption = input('');

  protected readonly missing = signal(false);
  protected readonly src = computed(() => `screenshots/${this.file()}`);
}
