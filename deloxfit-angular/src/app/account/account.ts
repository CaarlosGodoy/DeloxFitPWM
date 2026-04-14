import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css', './cancelSub.css'],
})
export class AccountComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  showCancelModal = signal(false);
  selectedReservaIndex = signal<number>(0);

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleCancelModal() {
    this.showCancelModal.update(v => !v);
  }

  confirmCancelSub() {
    this.authService.cancelSubscription();
    this.toggleCancelModal();
    alert("¡Tu suscripción ha sido cancelada con éxito!");
  }

  cancelReservation() {
    if (this.authService.currentUser()?.reservas?.length) {
      this.authService.cancelReservation(this.selectedReservaIndex());
      this.selectedReservaIndex.set(0);
      alert("Reserva cancelada correctamente.");
    }
  }
}
