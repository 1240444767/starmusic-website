import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n';
import { SHOTS } from '../site-content';
import { RevealDirective } from '../shared/reveal';
import { PhoneShot } from './phone-shot';

@Component({
  selector: 'app-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhoneShot, RevealDirective],
  template: `
    <section class="st-section preview" id="preview">
      <div class="st-container">
        <header class="st-center-head" appReveal>
          <span class="st-eyebrow">{{ i18n.t({ zh: '界面预览', en: 'Screenshots' }) }}</span>
          <h2 class="st-title">{{ i18n.t({ zh: '看看它长什么样', en: 'Take a look' }) }}</h2>
          <p class="st-subtitle">
            {{
              i18n.t({
                zh: '四个主要界面的实机截图：首页、播放器、搜索、歌单。',
                en: 'Real screenshots of the four main screens: home, player, search and playlists.'
              })
            }}
          </p>
        </header>

        <div class="shots">
          @for (shot of shots; track shot.file; let i = $index) {
            <div appReveal [revealDelay]="i * 90">
              <app-phone-shot
                [file]="shot.file"
                [label]="i18n.t(shot.label)"
                [caption]="i18n.t(shot.label) + ' · ' + i18n.t(shot.desc)"
              />
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .preview {
      background: linear-gradient(
        180deg,
        transparent,
        color-mix(in srgb, var(--st-primary) 5%, transparent) 45%,
        transparent
      );
    }

    .shots {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(228px, 1fr));
      justify-items: stretch;
      gap: 40px 28px;
      margin-top: 56px;
    }

    .shots > div {
      width: 100%;
    }

    @media (max-width: 720px) {
      .shots {
        gap: 32px;
      }
    }
  `,
})
export class Preview {
  protected readonly i18n = inject(I18nService);
  protected readonly shots = SHOTS;
}
