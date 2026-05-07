import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface AppStats {
  totalDownloads: number;
  totalUsers: number;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  readonly stats = signal<AppStats>({ totalDownloads: 0, totalUsers: 0 });

  private intervalId?: ReturnType<typeof setInterval>;

  startPolling(intervalMs = 5000): void {
    this.fetch();
    this.intervalId = setInterval(() => this.fetch(), intervalMs);
  }

  stopPolling(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private fetch(): void {
    this.http.get<AppStats>(`${this.apiUrl}/stats`).subscribe({
      next: (data) => this.stats.set(data),
      error: () => {},
    });
  }
}
