import { Component, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/database.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  templateUrl: './classes.html'
})
export class ClassesComponent implements OnInit {
  authService = inject(AuthService);
  dataService = inject(DataService);

  showPopup = signal(false);
  selectedClass = signal<string>('');
  selectedDay = signal<string>('');
  selectedTime = signal<string>('');

  schedule = signal<any[]>([]);

  ngOnInit() {
    this.dataService.getSiteData().subscribe({
      next: (data) => {
        if (data && data.schedule) {
          this.schedule.set(data.schedule);
        }
      },
      error: (err) => console.error('Error loading schedule:', err)
    });
  }

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

  async bookClass() {
    const reservaNombre = `${this.selectedClass()} - ${this.selectedDay()} ${this.selectedTime()}h`;
    const result = await this.authService.bookClass(reservaNombre);
    alert(result.message);
    if (result.success) {
      this.closePopup();
    }
  }
}
