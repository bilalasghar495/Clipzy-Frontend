import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VideoData } from '../../services/video-downloader.service';
import { DownloadService } from '../../services/download.service';
import { PlatformBadgeComponent } from '../platform-badge/platform-badge.component';

@Component({
  selector: 'app-video-result',
  standalone: true,
  imports: [PlatformBadgeComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-result.component.html',
  styleUrls: ['./video-result.component.scss'],
})
export class VideoResultComponent {
  private readonly dl = inject(DownloadService);

  @Input() data: VideoData | null = null;
  @Input() processed = false;
  @Output() reset = new EventEmitter<void>();

  readonly copiedCaption = signal(false);
  readonly copiedTags = signal(false);
  readonly thumbnailFailed = signal(false);

  effectiveThumbnail(): string {
    const url = this.data?.thumbnail;
    if (!url) return '';
    if (/fbcdn\.net|cdninstagram\.com/.test(url)) {
      return this.dl.thumbnailProxyUrl(url);
    }
    return url;
  }

  onThumbnailError(): void {
    this.thumbnailFailed.set(true);
  }

  onDownload(): void {
    if (!this.data || !this.processed) return;
    this.dl.triggerBrowserDownload(this.data.jobId);
  }

  onDownloadThumbnail(): void {
    if (!this.data?.thumbnail) return;
    window.open(this.data.thumbnail, '_blank');
  }

  async onCopyCaption(): Promise<void> {
    if (!this.data?.caption) return;
    try {
      await navigator.clipboard.writeText(this.data.caption);
      this.copiedCaption.set(true);
      setTimeout(() => this.copiedCaption.set(false), 2000);
    } catch {
      // clipboard write denied — user can copy manually
    }
  }

  async onCopyTags(): Promise<void> {
    if (!this.data?.tags?.length) return;
    try {
      await navigator.clipboard.writeText(this.data.tags.join(' '));
      this.copiedTags.set(true);
      setTimeout(() => this.copiedTags.set(false), 2000);
    } catch {
      // clipboard write denied — user can copy manually
    }
  }
}
