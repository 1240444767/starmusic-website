import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Changelog } from './sections/changelog';
import { Download } from './sections/download';
import { Features } from './sections/features';
import { Hero } from './sections/hero';
import { Platforms } from './sections/platforms';
import { Play } from './sections/play';
import { Preview } from './sections/preview';
import { SiteFooter } from './sections/site-footer';
import { SiteHeader } from './sections/site-header';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeader, Hero, Features, Preview, Play, Platforms, Changelog, Download, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
