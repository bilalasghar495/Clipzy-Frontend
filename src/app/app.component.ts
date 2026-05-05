import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { VideoDownloaderService } from './services/video-downloader.service';
import { LanguageService } from './services/language.service';
import { VideoInputComponent } from './components/video-input/video-input.component';
import { VideoResultComponent } from './components/video-result/video-result.component';
import { LoaderComponent } from './components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranslateModule, VideoInputComponent, VideoResultComponent, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly svc = inject(VideoDownloaderService);
  protected readonly langSvc = inject(LanguageService);

  readonly languages = toSignal(this.langSvc.getLanguages(), { initialValue: [] });

  readonly loading = this.svc.loading;
  readonly result = this.svc.result;
  readonly error = this.svc.error;
  readonly hasResult = computed(() => this.result() !== null);

  readonly loaderLabel = computed(() => {
    switch (this.svc.jobStatus()) {
      case 'waiting':    return 'loader.waiting';
      case 'processing': return 'loader.processing';
      default:           return 'loader.default';
    }
  });

  readonly supported = signal([
    { name: 'TikTok',    color: '#ff0050' },
    { name: 'YouTube',   color: '#ff0000' },
    { name: 'Instagram', color: '#e1306c' },
    { name: 'Pinterest', color: '#e60023' },
  ]);

  isActiveLang(code: string): boolean {
    return this.langSvc.currentLang() === code;
  }

  selectLanguage(code: string): void {
    this.langSvc.setLanguage(code);
  }

  onProcess(url: string): void {
    this.svc.process(url);
  }

  onReset(): void {
    this.svc.reset();
  }
}
