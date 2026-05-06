import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VideoDownloaderService } from '../../services/video-downloader.service';
import { VideoInputComponent } from '../../components/video-input/video-input.component';
import { VideoResultComponent } from '../../components/video-result/video-result.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { RecentDownloadsComponent } from '../../components/recent-downloads/recent-downloads.component';
import { RecentDownloadsService } from '../../services/recent-downloads.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule, VideoInputComponent, VideoResultComponent, LoaderComponent, RecentDownloadsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private readonly svc = inject(VideoDownloaderService);
  private readonly recentSvc = inject(RecentDownloadsService);

  readonly recentItems = this.recentSvc.items;

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

  onProcess(url: string): void {
    this.svc.process(url);
  }

  onReset(): void {
    this.svc.reset();
  }
}
