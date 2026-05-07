import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { StatsService } from '../../services/stats.service';

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M+';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K+';
  return n.toLocaleString();
}

@Component({
  selector: 'app-stats-counter',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stats-counter.component.html',
  styleUrls: ['./stats-counter.component.scss'],
})
export class StatsCounterComponent implements OnInit {
  private readonly statsSvc = inject(StatsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly displayDownloads = signal('—');
  readonly displayUsers = signal('—');
  readonly loaded = signal(false);

  private prevDownloads = 0;
  private prevUsers = 0;

  constructor() {
    effect(() => {
      const s = this.statsSvc.stats();
      if (s.totalDownloads > 0 || s.totalUsers > 0) {
        this.loaded.set(true);
        this.animateTo(this.prevDownloads, s.totalDownloads, (v) =>
          this.displayDownloads.set(formatNum(v))
        );
        this.animateTo(this.prevUsers, s.totalUsers, (v) =>
          this.displayUsers.set(formatNum(v))
        );
        this.prevDownloads = s.totalDownloads;
        this.prevUsers = s.totalUsers;
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.statsSvc.startPolling(5000);
    this.destroyRef.onDestroy(() => this.statsSvc.stopPolling());
  }

  private animateTo(from: number, to: number, setter: (v: number) => void): void {
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setter(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
