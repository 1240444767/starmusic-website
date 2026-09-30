import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';

/**
 * 滚动入场动画的开关。用法：
 *   `<div appReveal>` 或 `<div appReveal [revealDelay]="120">`
 *
 * 动画本身是**纯 CSS** 的（见 styles.scss 的 `.reveal` / `@keyframes st-reveal-in`）：
 * 支持滚动驱动动画的浏览器滚入视口时才播放，不支持的浏览器退化成载入动画。
 * 所以本指令只做一件事——把错峰延迟写进 `--reveal-delay`；
 * 即使指令完全没有执行，内容也照常可见（只是没有入场动画）。
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class RevealDirective implements OnInit {
  /** 错峰延迟（毫秒），用于同一行卡片依次出现 */
  readonly revealDelay = input(0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  ngOnInit(): void {
    const delay = this.revealDelay();
    if (delay > 0) this.host.nativeElement.style.setProperty('--reveal-delay', `${delay}ms`);
  }
}
