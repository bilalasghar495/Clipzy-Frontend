import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  readonly submitted = signal(false);

  name    = '';
  email   = '';
  message = '';

  submit(): void {
    this.submitted.set(true);
  }

  reset(): void {
    this.name    = '';
    this.email   = '';
    this.message = '';
    this.submitted.set(false);
  }
}
