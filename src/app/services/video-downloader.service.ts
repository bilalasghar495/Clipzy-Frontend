import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { Subscription, race, throwError, timer } from 'rxjs';
import { last, switchMap, takeWhile, tap } from 'rxjs/operators';
import { DownloadService } from './download.service';

export type JobStatus = 'idle' | 'waiting' | 'processing' | 'completed' | 'failed';

export type Platform =
  | 'tiktok'
  | 'youtube'
  | 'instagram'
  | 'snapchat'
  | 'pinterest'
  | 'unknown';

export interface VideoData {
  jobId: string;
  platform: Platform;
  title: string;
  thumbnail: string;
  downloadUrl: string;
}

@Injectable({ providedIn: 'root' })
export class VideoDownloaderService {
  private readonly dl = inject(DownloadService);
  private readonly destroyRef = inject(DestroyRef);

  private pollSub?: Subscription;
  private pendingPlatform: Platform = 'unknown';
  private pendingJobId = '';

  readonly loading = signal(false);
  readonly result = signal<VideoData | null>(null);
  readonly error = signal<string | null>(null);
  readonly jobStatus = signal<JobStatus>('idle');

  constructor() {
    this.destroyRef.onDestroy(() => this.cancelPoll());
  }

  detectPlatform(url: string): Platform {
    const u = url.trim().toLowerCase();
    if (!u) return 'unknown';
    if (/tiktok\.com|vm\.tiktok/.test(u)) return 'tiktok';
    if (/youtube\.com|youtu\.be/.test(u)) return 'youtube';
    if (/instagram\.com/.test(u)) return 'instagram';
    if (/snapchat\.com/.test(u)) return 'snapchat';
    if (/pinterest\.com|pin\.it/.test(u)) return 'pinterest';
    return 'unknown';
  }

  isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  process(url: string): void {
    if (!this.isValidUrl(url)) {
      this.error.set('Please enter a valid video URL.');
      return;
    }

    const platform = this.detectPlatform(url);
    if (platform === 'unknown') {
      this.error.set(
        'Unsupported platform. Try TikTok, YouTube, Instagram, Snapchat, or Pinterest.'
      );
      return;
    }

    this.cancelPoll();
    this.error.set(null);
    this.result.set(null);
    this.loading.set(true);
    this.jobStatus.set('waiting');
    this.pendingPlatform = platform;

    // Errors after 60 s if the job hasn't completed
    const timeout$ = timer(60_000).pipe(
      switchMap(() => throwError(() => new Error('Processing timed out. Please try again.')))
    );

    const job$ = this.dl.startDownload(url).pipe(
      tap(({ jobId }) => (this.pendingJobId = jobId)),
      switchMap(({ jobId }) =>
        // Poll every 2 s starting immediately; stop once terminal status is received
        timer(0, 2000).pipe(
          switchMap(() => this.dl.pollStatus(jobId)),
          tap(s => this.jobStatus.set(s.status as JobStatus)),
          takeWhile(s => s.status !== 'completed' && s.status !== 'failed', true),
          last(),
        )
      ),
      switchMap(finalStatus => {
        if (finalStatus.status === 'failed') {
          return throwError(() => new Error('Processing failed. Please try again.'));
        }
        return this.dl.getResult(finalStatus.jobId);
      }),
    );

    this.pollSub = race(job$, timeout$).subscribe({
      next: result => {
        this.result.set({
          jobId: this.pendingJobId,
          platform: this.pendingPlatform,
          title: result.title,
          thumbnail: result.thumbnail,
          downloadUrl: result.downloadUrl,
        });
        this.loading.set(false);
        this.jobStatus.set('completed');
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Failed to process video. Please try again.');
        this.loading.set(false);
        this.jobStatus.set('failed');
      },
    });
  }

  reset(): void {
    this.cancelPoll();
    this.result.set(null);
    this.error.set(null);
    this.loading.set(false);
    this.jobStatus.set('idle');
    this.pendingJobId = '';
  }

  private cancelPoll(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = undefined;
  }
}
