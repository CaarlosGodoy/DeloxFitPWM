import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css', './cancelSub.css'],
})
export class AccountComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);

  showCancelModal = signal(false);
  selectedReservaName = signal<string>('');

  ngOnInit() {
    // The AuthService handles listening to Firebase Auth and fetching the Firestore doc in real time
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']); // Redirigir al login al salir
  }

  async cancelSubscription() {
    if (confirm("¿Estás seguro de que quieres cancelar tu suscripción?")) {
      await this.authService.cancelSubscription();
      alert("¡Tu suscripción ha sido cancelada con éxito!");
    }
  }

  openCancelReservation(name: string) {
    this.selectedReservaName.set(name);
  }

  async cancelReservation() {
    await this.authService.cancelReservation(this.selectedReservaName());
    alert("Reserva cancelada correctamente.");
  }
}
