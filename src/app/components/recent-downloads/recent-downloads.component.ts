import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RecentDownloadsService, RecentItem } from '../../services/recent-downloads.service';
import { DownloadService } from '../../services/download.service';
import { Platform } from '../../services/video-downloader.service';
import { PlatformBadgeComponent } from '../platform-badge/platform-badge.component';

const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: '#FF0000', tiktok: '#010101', instagram: '#E1306C',
  pinterest: '#E60023', snapchat: '#FFFC00', unknown: '#6366F1',
};

const PLATFORM_INITIALS: Record<Platform, string> = {
  youtube: 'YT', tiktok: 'TK', instagram: 'IG',
  pinterest: 'PT', snapchat: 'SC', unknown: 'DL',
};

@Component({
  selector: 'app-recent-downloads',
  standalone: true,
  imports: [TranslateModule, PlatformBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recent-downloads.component.html',
  styleUrls: ['./recent-downloads.component.scss'],
})
export class RecentDownloadsComponent {
  private readonly recentSvc = inject(RecentDownloadsService);
  private readonly dl = inject(DownloadService);

  readonly items = this.recentSvc.items;

  thumbnailSrc(item: RecentItem): string {
    if (/fbcdn\.net|cdninstagram\.com/.test(item.thumbnail)) {
      return this.dl.thumbnailProxyUrl(item.thumbnail);
    }
    return item.thumbnail;
  }

  onDownloadAgain(item: RecentItem): void {
    this.dl.triggerBrowserDownload(item.jobId);
  }

  onClear(): void {
    this.recentSvc.clear();
  }

  timeAgo(ts: number): string {
    const mins = Math.floor((Date.now() - ts) / 60_000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  platformInitials(p: Platform): string {
    return PLATFORM_INITIALS[p] ?? 'DL';
  }

  platformColor(p: Platform): string {
    return PLATFORM_COLORS[p] ?? '#6366F1';
  }
}
