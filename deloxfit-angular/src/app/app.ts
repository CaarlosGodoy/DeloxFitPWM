import { Component, signal } from '@angular/core';
import { LoginComponent } from './login/login';

@Component({
  selector: 'app-root',
  imports: [LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('deloxfit-angular');
}
