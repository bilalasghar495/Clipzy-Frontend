import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface QueueResponse {
  jobId: string;
  status: string;
}

export interface StatusResponse {
  jobId: string;
  status: string;
}

export interface ResultResponse {
  title: string;
  thumbnail: string;
  downloadUrl: string;
  platform?: string;
  duration?: string;
  caption?: string;
  tags?: string[];
}

@Injectable({ providedIn: 'root' })
export class DownloadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  startDownload(url: string): Observable<QueueResponse> {
    return this.http.post<QueueResponse>(`${this.apiUrl}/download`, { url });
  }

  pollStatus(jobId: string): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.apiUrl}/status/${jobId}`);
  }

  getResult(jobId: string): Observable<ResultResponse> {
    return this.http.get<ResultResponse>(`${this.apiUrl}/result/${jobId}`);
  }

  triggerBrowserDownload(jobId: string): void {
    window.open(`${this.apiUrl}/file/${jobId}`, '_blank');
  }
}
