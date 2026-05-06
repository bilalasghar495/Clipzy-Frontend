import { Injectable, signal } from '@angular/core';
import { Platform, VideoData } from './video-downloader.service';

const STORAGE_KEY = 'clipzy_recent';
const MAX_ITEMS = 15;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Only store what the UI actually renders — no captions, tags, or download URLs
export interface RecentItem {
  jobId: string;
  platform: Platform;
  title: string;
  thumbnail: string;
  downloadedAt: number;
}

@Injectable({ providedIn: 'root' })
export class RecentDownloadsService {
  private readonly _items = signal<RecentItem[]>(this.load());

  readonly items = this._items.asReadonly();

  add(video: VideoData): void {
    const entry: RecentItem = {
      jobId: video.jobId,
      platform: video.platform,
      title: video.title,
      thumbnail: video.thumbnail,
      downloadedAt: Date.now(),
    };
    const next = [
      entry,
      // Deduplicate by jobId AND thumbnail URL (same video re-downloaded)
      ...this._items().filter(
        i => i.jobId !== video.jobId && i.thumbnail !== video.thumbnail
      ),
    ].slice(0, MAX_ITEMS);
    this._items.set(next);
    this.save(next);
  }

  clear(): void {
    this._items.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private load(): RecentItem[] {
    try {
      const all: RecentItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      const cutoff = Date.now() - ONE_DAY_MS;
      const fresh = all.filter(i => i.downloadedAt > cutoff);
      if (fresh.length !== all.length) {
        // Prune expired entries and persist
        if (fresh.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      return fresh;
    } catch {
      return [];
    }
  }

  private save(items: RecentItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}
