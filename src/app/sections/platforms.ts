import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n';
import { PLATFORMS } from '../site-content';
import { RevealDirective } from '../shared/reveal';

@Component({
  selector: 'app-platforms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="st-section" id="platforms">
      <div class="st-container">
        <header class="st-center-head" appReveal>
          <span class="st-eyebrow">{{ i18n.t({ zh: '音乐平台', en: 'Platforms' }) }}</span>
          <h2 class="st-title">
            {{ i18n.t({ zh: '一个 App，四个曲库', en: 'One app, four catalogues' }) }}
          </h2>
          <p class="st-subtitle">
            {{
              i18n.t({
                zh: '同一首歌在不同平台可能有不同的版本与音源，星音乐把它们汇总在同一个搜索与播放流程里。',
                en: 'The same track can differ between providers — StarMusic pulls them together into one search and playback flow.'
              })
            }}
          </p>
        </header>

        <div class="grid">
          @for (platform of platforms; track platform.name.zh; let i = $index) {
            <article class="st-card card" appReveal [revealDelay]="i * 80">
              <span class="mark" [style.background]="platform.color"></span>
              <h3>{{ i18n.t(platform.name) }}</h3>
              <p>{{ i18n.t(platform.tags) }}</p>
            </article>
          }
        </div>

        <p class="note" appReveal>
          {{
            i18n.t({
              zh: '所有内容均通过各平台公开接口获取，星音乐只做聚合与展示，不存储任何音乐文件。',
              en: 'All content is retrieved through the providers’ public interfaces. StarMusic aggregates and displays it only, and stores no music files.'
            })
          }}
        </p>
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 20px;
      margin-top: 56px;
    }

    .card {
      padding: 26px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: var(--st-shadow-md);
    }

    .mark {
      width: 40px;
      height: 6px;
      border-radius: 999px;
      margin-bottom: 6px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06) inset;
    }

    h3 {
      font-size: 17px;
      font-weight: 600;
    }

    p {
      font-size: 14px;
      color: var(--st-on-surface-variant);
    }

    .note {
      margin-top: 30px;
      text-align: center;
      font-size: 13px;
      color: var(--st-on-surface-variant);
    }
  `,
})
export class Platforms {
  protected readonly i18n = inject(I18nService);
  protected readonly platforms = PLATFORMS;
}
