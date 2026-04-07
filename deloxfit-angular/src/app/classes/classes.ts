import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  templateUrl: './classes.html',
  styleUrls: ['../../css/classesPage.css', '../../css/class.css'],
})
export class ClassesComponent {
  authService = inject(AuthService);

  showPopup = signal(false);
  selectedClass = signal<string>('');
  selectedDay = signal<string>('');
  selectedTime = signal<string>('');

  get popupImage(): string {
    const images: Record<string, string> = { 'Spinning': 'spinning.png', 'Zumba': 'zumba.png', 'Boxeo': 'box.png' };
    return `assets/classes/${images[this.selectedClass()] || 'default.jpg'}`;
  }

  get popupInfo(): string {
    return `${this.selectedDay()} a las ${this.selectedTime()}h`;
  }

  openClassInfo(className: string, day: string, time: string) {
    this.selectedClass.set(className);
    this.selectedDay.set(day);
    this.selectedTime.set(time);
    this.showPopup.set(true);
  }

  closePopup() {
    this.showPopup.set(false);
  }

  bookClass() {
    const reservaNombre = `${this.selectedClass()} - ${this.selectedDay()} ${this.selectedTime()}h`;
    const result = this.authService.bookClass(reservaNombre);
    alert(result.message);
    if (result.success) {
      this.closePopup();
    }
  }
}
