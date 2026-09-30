import { Injectable, signal } from '@angular/core';

/** 主题模式：跟随系统 / 强制浅色 / 强制深色 */
export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'st-theme';

function detectMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch {
    /* 忽略 */
  }
  return 'system';
}

/**
 * 主题服务：通过在 <html> 上挂 `dark` class 切换深浅色。
 * 站点自己的一套 --st-* token 与 Material 的 --mat-sys-* 都走这个 class。
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(detectMode());
  /** 当前是否深色（供顶栏按钮显隐图标用） */
  readonly isDark = signal(false);

  private readonly media =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;

  constructor() {
    this.apply();
    this.media?.addEventListener('change', () => {
      if (this.mode() === 'system') this.apply();
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* 忽略 */
    }
    this.apply();
  }

  /** 在浅色 / 深色之间直接切换（顶栏按钮） */
  toggle(): void {
    this.setMode(this.isDark() ? 'light' : 'dark');
  }

  private apply(): void {
    if (typeof document === 'undefined') return;
    const mode = this.mode();
    const dark = mode === 'dark' || (mode === 'system' && !!this.media?.matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    this.isDark.set(dark);
  }
}
