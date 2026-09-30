import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { I18nService, Localized } from '../core/i18n';
import { SeedService } from '../core/seed';
import { DEFAULT_SEED, SEARCH_HINTS, THEME_SEEDS } from '../site-content';
import { Icon } from '../shared/icon';
import { RevealDirective } from '../shared/reveal';

interface ShapeOption {
  id: string;
  label: Localized;
}

const SHAPES: ShapeOption[] = [
  { id: 'circle', label: { zh: '圆形', en: 'Circle' } },
  { id: 'square', label: { zh: '圆角方', en: 'Rounded' } },
  { id: 'flower', label: { zh: '花瓣', en: 'Flower' } },
  { id: 'shield', label: { zh: '盾形', en: 'Shield' } },
];

const MAX_HITS = 8;

@Component({
  selector: 'app-play',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RevealDirective, MatTooltipModule],
  template: `
    <section class="st-section" id="play">
      <div class="st-container">
        <header class="st-center-head" appReveal>
          <span class="st-eyebrow">{{ i18n.t({ zh: '玩一玩', en: 'Playground' }) }}</span>
          <h2 class="st-title">{{ i18n.t({ zh: '动手点两下', en: 'Have a go' }) }}</h2>
          <p class="st-subtitle">
            {{
              i18n.t({
                zh: '两段真在浏览器里跑的演示：换一次主题色，试一把「猜你想搜」。',
                en: 'Two demos that actually run in your browser: repaint the theme, and try type-ahead search.'
              })
            }}
          </p>
        </header>

        <div class="st-card seeds" appReveal>
          <div class="seeds__head">
            <div>
              <h3>{{ i18n.t({ zh: '主题种子色', en: 'Theme seed colours' }) }}</h3>
              <p>
                {{
                  i18n.t({
                    zh: 'App 设置页里的 12 套种子色，点一下整站立刻换肤 —— 取值和手机上的完全一样。',
                    en: 'The same twelve seeds as the app settings page. Tap one and the whole site repaints.'
                  })
                }}
              </p>
            </div>
            <button class="ghost" type="button" (click)="seeds.reset()" [disabled]="isDefault()">
              <app-icon name="palette" [size]="16" />
              {{ i18n.t({ zh: '恢复默认', en: 'Reset' }) }}
            </button>
          </div>

          <div class="swatches">
            @for (seed of themeSeeds; track seed.hex) {
              <button
                class="swatch"
                type="button"
                [class.on]="seed.hex === seeds.seed()"
                [style.background]="seed.hex"
                [style.color]="seeds.inkOn(seed.hex)"
                [attr.aria-label]="i18n.t(seed.name)"
                [matTooltip]="i18n.t(seed.name)"
                (click)="seeds.set(seed.hex)"
              >
                @if (seed.hex === seeds.seed()) {
                  <app-icon name="check" [size]="17" />
                }
              </button>
            }
          </div>

          <p class="seeds__now">
            {{ i18n.t({ zh: '当前', en: 'Current' }) }} ·
            <strong>{{ i18n.t(currentSeed().name) }}</strong>
            <code>{{ seeds.seed() }}</code>
          </p>
        </div>

        <div class="grid2">
          <div class="st-card search" appReveal>
            <h3>{{ i18n.t({ zh: '猜你想搜', en: 'Type-ahead search' }) }}</h3>
            <p>
              {{
                i18n.t({
                  zh: '边打边联想，四个平台的取词一次汇总。输入「周」或「folk」试试。',
                  en: 'Suggestions from four providers in one list — try typing "jay" or "民".'
                })
              }}
            </p>

            <div class="search__input">
              <app-icon name="search" [size]="18" />
              <input
                type="text"
                [value]="query()"
                [placeholder]="i18n.t({ zh: '歌手、歌曲、标签…', en: 'Artist, song, tag…' })"
                (input)="onQuery($event)"
              />
              @if (query()) {
                <button class="search__clear" type="button" (click)="clear()" aria-label="clear">
                  <app-icon name="close" [size]="15" />
                </button>
              }
            </div>

            <div class="search__hits">
              @for (hit of hits(); track hit.zh) {
                <button class="hit" type="button" (click)="pick(hit)">
                  {{ i18n.t(hit) }}
                </button>
              } @empty {
                <span class="search__empty">
                  {{ i18n.t({ zh: '没有匹配，换个词试试', en: 'No match — try another word' }) }}
                </span>
              }
            </div>

            <p class="search__meta">
              <span class="live"></span>
              {{ i18n.t({ zh: '4 个平台并发取词 · 本地演示数据', en: '4 providers queried at once · demo data' }) }}
            </p>
          </div>

          <div class="st-card motion" appReveal [revealDelay]="90">
            <h3>{{ i18n.t({ zh: 'Material 3 Expressive 动效', en: 'Material 3 Expressive motion' }) }}</h3>
            <p>
              {{
                i18n.t({
                  zh: '形状、圆角与弹簧回弹，都是 App 里同一套 M3E 规范。',
                  en: 'Shape morphing and springy easing — the same M3E spec the app uses.'
                })
              }}
            </p>

            <div class="motion__stage">
              <div class="shape" [class]="'shape shape--' + shape()"></div>
            </div>

            <div class="motion__pills">
              @for (option of shapes; track option.id) {
                <button
                  class="pill"
                  type="button"
                  [class.on]="option.id === shape()"
                  (click)="shape.set(option.id)"
                >
                  {{ i18n.t(option.label) }}
                </button>
              }
            </div>

            <button class="spring" type="button" [class.pop]="popping()" (click)="pop()">
              <app-icon name="sparkle" [size]="16" />
              {{ i18n.t({ zh: '点我弹一下', en: 'Give it a tap' }) }}
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .seeds {
      display: flex;
      flex-direction: column;
      gap: 22px;
      padding: 30px;
      margin-bottom: 24px;
    }

    .seeds__head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }

    h3 {
      font-size: 19px;
      font-weight: 700;
    }

    .seeds h3 {
      font-size: 22px;
    }

    p {
      margin-top: 8px;
      font-size: 14px;
      line-height: 1.7;
      color: var(--st-on-surface-variant);
    }

    .ghost {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex: none;
      padding: 9px 16px;
      border: 1px solid color-mix(in srgb, var(--st-outline) 65%, transparent);
      border-radius: 999px;
      background: transparent;
      color: var(--st-primary);
      font: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition:
        border-color 0.2s ease,
        opacity 0.2s ease;
    }

    .ghost:hover:not(:disabled) {
      border-color: var(--st-primary);
    }

    .ghost:disabled {
      opacity: 0.45;
      cursor: default;
    }

    .swatches {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 10px;
    }

    .swatch {
      position: relative;
      aspect-ratio: 1;
      width: 100%;
      border: 0;
      border-radius: 30%;
      cursor: pointer;
      display: grid;
      place-items: center;
      box-shadow: var(--st-shadow-sm);
      transition:
        transform 0.28s cubic-bezier(0.2, 0.9, 0.2, 1),
        border-radius 0.4s ease,
        box-shadow 0.2s ease;
    }

    .swatch:hover {
      transform: translateY(-3px) scale(1.06);
      border-radius: 50%;
    }

    .swatch.on {
      border-radius: 50%;
      box-shadow:
        0 0 0 3px var(--st-surface),
        0 0 0 5px var(--st-primary);
    }

    /* 勾选图标画在色块自己身上，颜色由 seeds.inkOn() 按对比度给 */
    .swatch app-icon {
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
    }

    .seeds__now {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 13px;
    }

    .seeds__now code {
      padding: 2px 8px;
      border-radius: 8px;
      background: var(--st-surface-mid);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      color: var(--st-on-surface);
    }

    .grid2 {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 24px;
    }

    .search,
    .motion {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 28px;
    }

    .search__input {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 999px;
      background: var(--st-surface-low);
      border: 1px solid color-mix(in srgb, var(--st-outline) 40%, transparent);
      color: var(--st-on-surface-variant);
      transition: border-color 0.2s ease;
    }

    .search__input:focus-within {
      border-color: var(--st-primary);
    }

    .search__input input {
      flex: 1;
      min-width: 0;
      border: 0;
      background: transparent;
      color: var(--st-on-surface);
      font: inherit;
      font-size: 15px;
      outline: none;
    }

    .search__clear {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border: 0;
      border-radius: 50%;
      background: var(--st-surface-mid);
      color: var(--st-on-surface-variant);
      cursor: pointer;
    }

    .search__hits {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      min-height: 76px;
      align-content: flex-start;
    }

    .hit {
      padding: 7px 14px;
      border: 0;
      border-radius: 999px;
      background: var(--st-secondary-container);
      color: var(--st-on-secondary-container);
      font: inherit;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      transition:
        transform 0.18s cubic-bezier(0.2, 0.9, 0.2, 1),
        background-color 0.18s ease;
    }

    .hit:hover {
      transform: translateY(-2px);
      background: var(--st-primary-container);
      color: var(--st-on-primary-container);
    }

    .search__empty {
      font-size: 13.5px;
      color: var(--st-on-surface-variant);
    }

    .search__meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: auto 0 0;
      font-size: 12.5px;
    }

    .live {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--st-primary);
      animation: st-pulse 1.6s ease-in-out infinite;
    }

    .motion__stage {
      display: grid;
      place-items: center;
      padding: 18px 0 10px;
      border-radius: var(--st-radius-sm);
      background: var(--st-surface-low);
    }

    .shape {
      width: 116px;
      height: 116px;
      background: linear-gradient(140deg, var(--st-primary), var(--st-tertiary));
      box-shadow: var(--st-shadow-md);
      transition:
        border-radius 0.55s cubic-bezier(0.2, 0.9, 0.2, 1),
        transform 0.55s cubic-bezier(0.2, 0.9, 0.2, 1);
    }

    .shape--circle {
      border-radius: 50%;
    }

    .shape--square {
      border-radius: 26%;
    }

    .shape--flower {
      border-radius: 62% 38% 58% 42% / 46% 58% 42% 54%;
    }

    .shape--shield {
      border-radius: 50% 50% 46% 46% / 14% 14% 86% 86%;
    }

    .motion__pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill {
      padding: 7px 14px;
      border: 1px solid color-mix(in srgb, var(--st-outline) 60%, transparent);
      border-radius: 999px;
      background: transparent;
      color: var(--st-on-surface-variant);
      font: inherit;
      font-size: 12.5px;
      font-weight: 600;
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

    .spring {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: auto;
      padding: 13px 22px;
      border: 0;
      border-radius: 999px;
      background: var(--st-primary);
      color: var(--st-on-primary);
      font: inherit;
      font-size: 14.5px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--st-shadow-sm);
      transition: background-color 0.2s ease;
    }

    .spring:hover {
      background: var(--st-primary-hover);
    }

    .spring.pop {
      animation: st-spring-pop 0.5s cubic-bezier(0.2, 1.4, 0.3, 1);
    }

    @keyframes st-spring-pop {
      0% {
        transform: scale(1);
      }
      35% {
        transform: scale(0.92);
      }
      70% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    @media (max-width: 1080px) {
      .swatches {
        grid-template-columns: repeat(6, minmax(0, 1fr));
      }
    }

    @media (max-width: 900px) {
      .grid2 {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 520px) {
      .swatches {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .swatch,
      .hit,
      .shape {
        transition: none;
      }

      .spring.pop,
      .live {
        animation: none;
      }
    }
  `,
})
export class Play {
  protected readonly i18n = inject(I18nService);
  protected readonly seeds = inject(SeedService);
  protected readonly themeSeeds = THEME_SEEDS;
  protected readonly shapes = SHAPES;

  /** 「猜你想搜」输入框的内容 */
  protected readonly query = signal('');
  protected readonly shape = signal(SHAPES[0].id);

  /** 弹簧按钮的动画 class，播完自身清掉 */
  protected readonly popping = signal(false);

  protected readonly isDefault = computed(() => this.seeds.seed() === DEFAULT_SEED);
  protected readonly currentSeed = computed(
    () => this.themeSeeds.find((s) => s.hex === this.seeds.seed()) ?? this.themeSeeds[0],
  );

  /** 命中词：空查询先给几个热门词，输入后按中英文模糊匹配，最多 8 条 */
  protected readonly hits = computed<Localized[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return SEARCH_HINTS.slice(0, MAX_HITS);
    return SEARCH_HINTS.filter(
      (hint) => hint.zh.toLowerCase().includes(q) || hint.en.toLowerCase().includes(q),
    ).slice(0, MAX_HITS);
  });

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected clear(): void {
    this.query.set('');
  }

  protected pick(hit: Localized): void {
    this.query.set(this.i18n.isEnglish() ? hit.en : hit.zh);
  }

  protected pop(): void {
    this.popping.set(false);
    // 重新触发 CSS 动画：先摘掉 class，下一帧再挂上
    requestAnimationFrame(() => {
      this.popping.set(true);
      window.setTimeout(() => this.popping.set(false), 520);
    });
  }
}
