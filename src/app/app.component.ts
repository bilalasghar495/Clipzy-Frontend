import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected readonly langSvc = inject(LanguageService);
  readonly languages = toSignal(this.langSvc.getLanguages(), { initialValue: [] });

  isActiveLang(code: string): boolean {
    return this.langSvc.currentLang() === code;
  }

  selectLanguage(code: string): void {
    this.langSvc.setLanguage(code);
  }
}
