import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Platform } from '../../services/video-downloader.service';

interface PlatformMeta {
  label: string;
  color: string;
}

@Component({
  selector: 'app-platform-badge',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './platform-badge.component.html',
  styleUrls: ['./platform-badge.component.scss'],
})
export class PlatformBadgeComponent {
  @Input({ required: true }) platform!: Platform;

  private readonly metas: Record<Platform, PlatformMeta> = {
    tiktok:    { label: 'TikTok',    color: '#ff0050' },
    youtube:   { label: 'YouTube',   color: '#ff0000' },
    instagram: { label: 'Instagram', color: '#e1306c' },
    snapchat:  { label: 'Snapchat',  color: '#f5c518' },
    pinterest: { label: 'Pinterest', color: '#e60023' },
    unknown:   { label: 'Unknown',   color: '#8b5cf6' },
  };

  get meta(): PlatformMeta {
    return this.metas[this.platform] ?? this.metas['unknown'];
  }
}
