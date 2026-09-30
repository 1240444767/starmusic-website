import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** 一条 SVG 路径；solid = true 时用填充画（品牌图、实心图标） */
interface IconPath {
  d: string;
  solid?: boolean;
}

interface IconDef {
  paths: IconPath[];
}

/** 用两段圆弧拼一个圆，省得写 <circle> */
const circle = (cx: number, cy: number, r: number): string =>
  `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;

const ring = (cx: number, cy: number, r: number): IconPath => ({ d: circle(cx, cy, r) });
const dot = (cx: number, cy: number, r: number): IconPath => ({ d: circle(cx, cy, r), solid: true });
const line = (d: string): IconPath => ({ d });
const solid = (d: string): IconPath => ({ d, solid: true });

/**
 * 站点图标表：全部是 24×24 手写的线性/实心路径，不依赖任何图标字体，
 * 所以断网、墙内环境也一定能显示。
 */
export const ICONS: Record<string, IconDef> = {
  search: {
    paths: [ring(11, 11, 7), line('M16.2 16.2 L21 21')],
  },
  layers: {
    paths: [line('M12 3 L21 8 L12 13 L3 8 Z'), line('M3 12.5 L12 17.5 L21 12.5'), line('M3 17 L12 22 L21 17')],
  },
  sparkle: {
    paths: [
      solid('M11 3.2l1.7 4.6 4.6 1.7-4.6 1.7L11 15.8 9.3 11.2 4.7 9.5l4.6-1.7z'),
      line('M18.4 14.6l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z'),
    ],
  },
  palette: {
    paths: [
      line(
        'M12 3.2a8.8 8.8 0 1 0 0 17.6c1.2 0 2.1-.9 2.1-2.1 0-.55-.2-1-.55-1.4-.3-.35-.5-.8-.5-1.3 0-1.2.95-2.1 2.1-2.1h2.05a4.3 4.3 0 0 0 4.3-4.3c0-4-4-7.4-9.5-7.4z',
      ),
      dot(8.1, 11.4, 1.15),
      dot(11.4, 7.6, 1.15),
      dot(15.6, 8.4, 1.15),
      dot(17.2, 12.2, 1.15),
    ],
  },
  music: {
    paths: [line('M9 18.2 V5.6 L19.4 3.4 V16.2'), dot(6.4, 18.2, 2.6), dot(16.8, 16.2, 2.6)],
  },
  download: {
    paths: [line('M12 3.6 V14.6'), line('M7.4 10.4 L12 15 L16.6 10.4'), line('M4.4 20.4 H19.6')],
  },
  'cloud-download': {
    paths: [
      line('M7.2 18.6h9.3a3.6 3.6 0 0 0 .5-7.1A5.1 5.1 0 0 0 7.3 9.7 3.8 3.8 0 0 0 7.2 18.6z'),
      line('M12 11.4 V16.6'),
      line('M9.9 14.6 L12 16.7 L14.1 14.6'),
    ],
  },
  heart: {
    paths: [
      line(
        'M12 20.2l-1.25-1.14C6.1 14.86 3.6 12.6 3.6 9.7A4.3 4.3 0 0 1 7.9 5.4c1.4 0 2.75.62 3.6 1.7l.5.62.5-.62a4.6 4.6 0 0 1 3.6-1.7 4.3 4.3 0 0 1 4.3 4.3c0 2.9-2.5 5.16-7.15 9.36z',
      ),
    ],
  },
  lyrics: {
    paths: [
      line('M12 3.4a3 3 0 0 1 3 3v4.9a3 3 0 0 1-6 0V6.4a3 3 0 0 1 3-3z'),
      line('M5.6 11.4a6.4 6.4 0 0 0 12.8 0'),
      line('M12 17.8 V20.6'),
      line('M8.8 20.6 H15.2'),
    ],
  },
  list: {
    paths: [line('M4.2 6.2 H19.8'), line('M4.2 12 H19.8'), line('M4.2 17.8 H13.6')],
  },
  equalizer: {
    paths: [line('M6 20 V10.4'), line('M12 20 V4.4'), line('M18 20 V13.2')],
  },
  bolt: {
    paths: [line('M13.6 2.6 L5.4 13.4 H11.2 L10.4 21.4 L18.6 10.6 H12.8 Z')],
  },
  shield: {
    paths: [line('M12 3l7.2 3v6c0 4.3-3 7.8-7.2 9.2C7.8 19.8 4.8 16.3 4.8 12V6z'), line('M9 12.2l2.2 2.2 4-4.2')],
  },
  devices: {
    paths: [
      line('M3.2 5.4h12.6v8.4H3.2z'),
      line('M7 17.4h5'),
      line('M17.4 8.4h3.4v10.2h-3.4z'),
    ],
  },
  code: {
    paths: [line('M9 8 L5 12 L9 16'), line('M15 8 L19 12 L15 16'), line('M13.2 5.6 L10.8 18.4')],
  },
  book: {
    paths: [line('M4.6 5.6a2 2 0 0 1 2-2h12.8v14.6H6.6a2 2 0 0 0-2 2z'), line('M4.6 18.2v0'), line('M8 7.6h7.4')],
  },
  bug: {
    paths: [
      line('M9 6.6h6'),
      line('M12 3.4v3.2'),
      line('M7.2 10.4h9.6v3.4a4.8 4.8 0 0 1-9.6 0z'),
      line('M7.2 12.4 H4.6'),
      line('M16.8 12.4 H19.4'),
      line('M8 17.6 L6.4 19.8'),
      line('M16 17.6 L17.6 19.8'),
    ],
  },
  check: {
    paths: [line('M5 12.8 L9.6 17.4 L19 7.6')],
  },
  'arrow-right': {
    paths: [line('M4.4 12 H19.4'), line('M13.4 6.6 L19.4 12 L13.4 17.4')],
  },
  'external-link': {
    paths: [
      line('M14 4.6h5.4v5.4'),
      line('M19.4 4.6 L11.2 12.8'),
      line('M17.4 14.4v4.2a1.6 1.6 0 0 1-1.6 1.6H6.2a1.6 1.6 0 0 1-1.6-1.6V8.2a1.6 1.6 0 0 1 1.6-1.6h4.2'),
    ],
  },
  menu: {
    paths: [line('M4 7 H20'), line('M4 12 H20'), line('M4 17 H20')],
  },
  close: {
    paths: [line('M6.4 6.4 L17.6 17.6'), line('M17.6 6.4 L6.4 17.6')],
  },
  moon: {
    paths: [line('M20.4 14.8A8.8 8.8 0 0 1 9.2 3.6a8.8 8.8 0 1 0 11.2 11.2z')],
  },
  sun: {
    paths: [
      ring(12, 12, 4.1),
      line('M12 2.6 V4.8'),
      line('M12 19.2 V21.4'),
      line('M2.6 12 H4.8'),
      line('M19.2 12 H21.4'),
      line('M5.4 5.4 L7 7'),
      line('M17 17 L18.6 18.6'),
      line('M18.6 5.4 L17 7'),
      line('M7 17 L5.4 18.6'),
    ],
  },
  globe: {
    paths: [ring(12, 12, 8.8), line('M3.2 12 H20.8'), line('M12 3.2c2.4 2.5 3.7 5.5 3.7 8.8s-1.3 6.3-3.7 8.8c-2.4-2.5-3.7-5.5-3.7-8.8S9.6 5.7 12 3.2z')],
  },
  play: {
    paths: [solid('M8 5.1v13.8c0 .8.9 1.3 1.55.85l10.6-6.9c.6-.4.6-1.3 0-1.7L9.55 4.25C8.9 3.8 8 4.3 8 5.1z')],
  },
  star: {
    paths: [
      solid('M12 3.4l2.65 5.4 5.95.85-4.3 4.2 1.02 5.93L12 17.06 6.68 19.78 7.7 13.85 3.4 9.65l5.95-.85z'),
    ],
  },
  android: {
    paths: [
      solid('M6.5 9.6h11v6.1a1.7 1.7 0 0 1-1.7 1.7H8.2a1.7 1.7 0 0 1-1.7-1.7z'),
      solid('M3.5 10.6a1.05 1.05 0 0 1 2.1 0v4.2a1.05 1.05 0 0 1-2.1 0z'),
      solid('M18.4 10.6a1.05 1.05 0 0 1 2.1 0v4.2a1.05 1.05 0 0 1-2.1 0z'),
      solid('M9.1 18.2h2.1v1.9a1.05 1.05 0 0 1-2.1 0z'),
      solid('M12.8 18.2h2.1v1.9a1.05 1.05 0 0 1-2.1 0z'),
      solid('M6.6 8.9a5.6 5.6 0 0 1 10.8 0z'),
      line('M8.3 3.4 L9.7 6.1'),
      line('M15.7 3.4 L14.3 6.1'),
      dot(9.6, 7.5, 0.75),
      dot(14.4, 7.5, 0.75),
    ],
  },
  github: {
    paths: [
      solid(
        'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
      ),
    ],
  },
  phone: {
    paths: [
      line('M7.4 2.8h9.2a1.6 1.6 0 0 1 1.6 1.6v15.2a1.6 1.6 0 0 1-1.6 1.6H7.4a1.6 1.6 0 0 1-1.6-1.6V4.4a1.6 1.6 0 0 1 1.6-1.6z'),
      line('M10.6 18.4h2.8'),
    ],
  },
  image: {
    paths: [
      line('M4.4 4.6h15.2v14.8H4.4z'),
      ring(9, 9.4, 1.6),
      line('M4.4 16.2 L9.6 11.4 L13.4 15 L16 12.6 L19.6 16.2'),
    ],
  },
  refresh: {
    paths: [line('M20 12a8 8 0 1 1-2.4-5.7'), line('M20.2 3.8 V8.4 H15.6')],
  },
  'arrow-up': {
    paths: [line('M12 19.4 V5.2'), line('M6.6 10.6 L12 5.2 L17.4 10.6')],
  },
};

/**
 * 内联 SVG 图标。用法：`<app-icon name="download" [size]="20" />`
 * 颜色继承 currentColor，所以直接改父级 color 就行。
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      @for (path of def().paths; track $index) {
        <path [attr.d]="path.d" [class.st-solid]="path.solid" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
      line-height: 0;
    }

    svg {
      display: block;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .st-solid {
      fill: currentColor;
      stroke: none;
    }
  `,
})
export class Icon {
  /** 图标名（见 ICONS） */
  readonly name = input.required<string>();
  /** 像素尺寸 */
  readonly size = input(24);

  private readonly fallback: IconDef = { paths: [ring(12, 12, 8.6)] };

  protected readonly def = computed<IconDef>(() => ICONS[this.name()] ?? this.fallback);
}
