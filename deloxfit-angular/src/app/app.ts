import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';

import { DataService } from './services/database.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'deloxfit-angular';
  private dataService = inject(DataService);

  constructor() {
    // this.dataService.seedData(); // Eliminado: los datos ya están en Firebase
  }
}
