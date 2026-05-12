import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(AuthService);

  constructor(private router: Router) {}

  goToSection(section: string) {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const el = document.getElementById(section);

        if (el) {
          const offset = 90;

          const y =
            el.getBoundingClientRect().top +
            window.pageYOffset -
            offset;

          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }, 100);
    });
  }
}
