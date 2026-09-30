import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

// 官网是单页滚动站点（导航靠锚点），不需要路由。
// 去掉 provideRouter 后部署到子路径（如 GitHub Pages 项目页 /starmusic-website/）也不再受绝对 <base href> 约束。
export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners()],
};
