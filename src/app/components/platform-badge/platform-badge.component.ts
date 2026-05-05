import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Platform } from '../../services/video-downloader.service';
import { PLATFORM_CONFIG, PlatformConfig } from '../../config/platform.config';

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

  get meta(): PlatformConfig {
    return PLATFORM_CONFIG[this.platform] ?? PLATFORM_CONFIG['unknown'];
  }
}
