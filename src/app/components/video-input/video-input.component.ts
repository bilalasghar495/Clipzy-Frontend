import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

interface PlatformHint {
  name: string;
  color: string;
}

const PLATFORM_MAP: Array<{ pattern: RegExp; name: string; color: string }> = [
  { pattern: /tiktok\.com|vm\.tiktok/i,   name: 'TikTok',    color: '#ff0050' },
  { pattern: /youtube\.com|youtu\.be/i,   name: 'YouTube',   color: '#ff0000' },
  { pattern: /instagram\.com/i,           name: 'Instagram', color: '#e1306c' },
  { pattern: /snapchat\.com/i,            name: 'Snapchat',  color: '#FFFC00' },
  { pattern: /pinterest\.com|pin\.it/i,   name: 'Pinterest', color: '#e60023' },
];

@Component({
  selector: 'app-video-input',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-input.component.html',
  styleUrls: ['./video-input.component.scss'],
})
export class VideoInputComponent {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() loading = false;
  @Output() process = new EventEmitter<string>();

  value = '';
  detected: PlatformHint | null = null;

  onValueChange(v: string): void {
    this.detected = this.detectPlatform(v);
    this.cdr.markForCheck();
  }

  submit(): void {
    const v = this.value.trim();
    if (!v || this.loading) return;
    this.process.emit(v);
  }

  clear(): void {
    this.value = '';
    this.detected = null;
  }

  async paste(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        this.value = text.trim();
        this.detected = this.detectPlatform(this.value);
        this.cdr.markForCheck();
      }
    } catch {
      // clipboard access denied — user can paste manually
    }
  }

  private detectPlatform(url: string): PlatformHint | null {
    if (!url.trim()) return null;
    const match = PLATFORM_MAP.find(p => p.pattern.test(url));
    return match ? { name: match.name, color: match.color } : null;
  }
}
