import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './header.html',
  styleUrl: '../../css/header.css',
})
export class Header {
  authService = inject(AuthService);
  menuActive = signal(false);

  toggleMenu() {
    this.menuActive.update(v => !v);
  }
}
