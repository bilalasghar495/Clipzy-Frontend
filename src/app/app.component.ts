import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { VideoDownloaderService } from './services/video-downloader.service';
import { VideoInputComponent } from './components/video-input/video-input.component';
import { VideoResultComponent } from './components/video-result/video-result.component';
import { LoaderComponent } from './components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VideoInputComponent, VideoResultComponent, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly svc = inject(VideoDownloaderService);

  readonly loading = this.svc.loading;
  readonly result = this.svc.result;
  readonly error = this.svc.error;
  readonly hasResult = computed(() => this.result() !== null);

  readonly loaderLabel = computed(() => {
    switch (this.svc.jobStatus()) {
      case 'waiting':    return 'Video queued, waiting to process...';
      case 'processing': return 'Downloading and removing watermark...';
      default:           return 'Processing video...';
    }
  });

  readonly supported = signal([
    { name: 'TikTok',    color: '#ff0050' },
    { name: 'YouTube',   color: '#ff0000' },
    { name: 'Instagram', color: '#e1306c' },
    { name: 'Snapchat',  color: '#fffc00' },
    { name: 'Pinterest', color: '#e60023' },
  ]);

  onProcess(url: string): void {
    this.svc.process(url);
  }

  onReset(): void {
    this.svc.reset();
  }
}
