import { Injectable, computed, signal } from '@angular/core';

/** 站点支持的语言 */
export type Lang = 'zh' | 'en';

/** 一段双语文案 */
export interface Localized {
  zh: string;
  en: string;
}

const STORAGE_KEY = 'st-lang';

/** 读取初始语言：优先本地记忆，其次跟随浏览器，兜底中文 */
function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
  } catch {
    /* 隐私模式下 localStorage 可能不可用 */
  }
  const nav = typeof navigator !== 'undefined' ? (navigator.language || '') : '';
  return nav.toLowerCase().startsWith('zh') || nav === '' ? 'zh' : 'en';
}

/**
 * 极简双语服务：站点文案全部写成 `{ zh, en }`，模板里用 `i18n.t(...)` 取值。
 * lang 是 signal，切换后所有读到它的模板会自动重新渲染。
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(detectLang());
  readonly isEnglish = computed(() => this.lang() === 'en');

  constructor() {
    this.applyHtmlLang(this.lang());
  }

  /** 取一段双语文本 */
  t(text: Localized): string {
    return this.lang() === 'en' ? text.en : text.zh;
  }

  setLang(lang: Lang): void {
    if (this.lang() === lang) return;
    this.lang.set(lang);
    this.applyHtmlLang(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* 忽略写入失败 */
    }
  }

  toggle(): void {
    this.setLang(this.lang() === 'zh' ? 'en' : 'zh');
  }

  private applyHtmlLang(lang: Lang): void {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  }
}
