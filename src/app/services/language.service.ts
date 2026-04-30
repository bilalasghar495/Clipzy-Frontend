import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Language, LanguageApiResponse } from '../models/language.model';

const STORAGE_KEY = 'clipzy_lang';
const DEFAULT_LANG = 'en';
const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur']);

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);

  readonly currentLang = signal(DEFAULT_LANG);

  init(): Observable<unknown> {
    const saved = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_LANG;
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.currentLang.set(saved);
    this.applyDir(saved);
    return this.translate.use(saved);
  }

  setLanguage(code: string): void {
    localStorage.setItem(STORAGE_KEY, code);
    this.currentLang.set(code);
    this.applyDir(code);
    this.translate.use(code);
  }

  private applyDir(code: string): void {
    document.documentElement.dir = RTL_LANGS.has(code) ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
  }

  getLanguages(): Observable<Language[]> {
    return this.http
      .get<LanguageApiResponse>(`${environment.apiUrl}/languages`)
      .pipe(
        map(res => res.data),
        catchError(() => of([] as Language[]))
      );
  }
}
