import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { VideoData } from '../../services/video-downloader.service';
import { DownloadService } from '../../services/download.service';
import { PlatformBadgeComponent } from '../platform-badge/platform-badge.component';

@Component({
  selector: 'app-video-result',
  standalone: true,
  imports: [PlatformBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-result.component.html',
  styleUrls: ['./video-result.component.scss'],
})
export class VideoResultComponent {
  private readonly dl = inject(DownloadService);

  @Input() data: VideoData | null = null;
  @Input() processed = false;
  @Output() reset = new EventEmitter<void>();

  get platformLabel(): string {
    const p = this.data?.platform ?? '';
    return p.charAt(0).toUpperCase() + p.slice(1);
  }

  onDownload(): void {
    if (!this.data || !this.processed) return;
    this.dl.triggerBrowserDownload(this.data.jobId);
  }
}
