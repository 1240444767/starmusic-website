import { Injectable, signal } from '@angular/core';
import { DEFAULT_SEED, SEED_STORAGE_KEY } from '../site-content';

/** 深色墨色：浅色底上用它当文字色（纯黑，保证浅色种子也能过 4.5:1） */
const DARK_INK = '#000000';

/**
 * 主题种子色服务。
 *
 * 「玩一玩」区块里点一个色块，就把 `--st-seed` 写到 `:root` 上；styles.scss 里
 * 品牌主色、容器色、发光、网格线全部由这个种子色用 color-mix 派生，所以整站立刻换肤。
 * 访客的选择记在 localStorage，下次打开还是那个颜色。
 *
 * 另外顺手算好「主色上的文字色」：种子色有深有浅（靛蓝 vs 柠檬），白字在浅色种子上
 * 只有 2.2:1，所以按对比度挑白字或深墨色，把它们写成 `--st-on-primary-light` /
 * `--st-on-primary-dark` 两个变量交给 CSS 分深浅模式取用。
 */
@Injectable({ providedIn: 'root' })
export class SeedService {
  readonly seed = signal<string>(readStoredSeed());

  constructor() {
    this.apply(this.seed());
  }

  set(hex: string): void {
    this.seed.set(hex);
    this.apply(hex);
    try {
      localStorage.setItem(SEED_STORAGE_KEY, hex);
    } catch {
      /* 隐私模式写不了，忽略 */
    }
  }

  /** 回到 App 的默认蓝 */
  reset(): void {
    this.set(DEFAULT_SEED);
  }

  /** 给定底色，返回在这上面最清楚的字色（色块上的勾、按钮上的字都用它） */
  inkOn(hex: string): string {
    return readableInk(hex);
  }

  private apply(hex: string): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement.style;
    root.setProperty('--st-seed', hex);
    // 浅色模式下按钮底色就是种子色本身；深色模式下主色被提亮成 72% 种子 + 28% 白
    // （和 styles.scss 的 html.dark 保持一致），两套各自挑一个读得清的字色。
    root.setProperty('--st-on-primary-light', readableInk(hex));
    root.setProperty('--st-on-primary-dark', readableInk(mixWithWhite(hex, 0.28)));
  }
}

function parseHex(hex: string): [number, number, number] {
  const raw = hex.replace('#', '').trim();
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  return [
    Number.parseInt(full.slice(0, 2), 16) || 0,
    Number.parseInt(full.slice(2, 4), 16) || 0,
    Number.parseInt(full.slice(4, 6), 16) || 0,
  ];
}

function mixWithWhite(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex);
  const to = (v: number) =>
    Math.round(v + (255 - v) * amount)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** WCAG 相对亮度 */
function luminance([r, g, b]: [number, number, number]): number {
  const channel = (value: number) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: number, b: number): number {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

function readableInk(hex: string): string {
  const bg = luminance(parseHex(hex));
  const onWhite = contrast(1, bg);
  const onInk = contrast(luminance(parseHex(DARK_INK)), bg);
  return onWhite >= onInk ? '#ffffff' : DARK_INK;
}

function readStoredSeed(): string {
  try {
    return localStorage.getItem(SEED_STORAGE_KEY) ?? DEFAULT_SEED;
  } catch {
    return DEFAULT_SEED;
  }
}
