import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { doc, getDoc, Firestore } from '@angular/fire/firestore'; // Importes necesarios

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css', './cancelSub.css'],
})
export class AccountComponent implements OnInit {
  public dataService = inject(DataService); // Lo hacemos público para el HTML
  private firestore = inject(Firestore);
  private router = inject(Router);

  currentUser = signal<any>(null); // Aquí guardaremos los datos de Firestore
  showCancelModal = signal(false);
  selectedReservaIndex = signal<number>(0);

  ngOnInit() {
    // 1. Escuchamos el estado de Auth
    this.dataService.getAuthState().subscribe(async (user) => {
      if (user) {
        // 2. Si hay usuario, buscamos su "ficha" en Firestore por su UID
        const docRef = doc(this.firestore, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // 3. Guardamos los datos de la base de datos (nombre, dni, etc.)
          this.currentUser.set(docSnap.data());
        } else {
          // Si por alguna razón no tiene ficha, usamos los datos básicos de Auth
          this.currentUser.set({
            usuario: 'Usuario Nuevo',
            correo: user.email,
            dni: 'No registrado',
            suscripcion: 'Ninguna activa',
            reservas: []
          });
        }
      } else {
        this.currentUser.set(null);
      }
    });
  }

  async logout() {
    await this.dataService.logout();
    this.router.navigate(['/login']); // Redirigir al login al salir
  }

  toggleCancelModal() {
    this.showCancelModal.update(v => !v);
  }

  confirmCancelSub() {
    this.toggleCancelModal();
    alert("¡Tu suscripción ha sido cancelada con éxito!");
  }

  cancelReservation() {
    alert("Reserva cancelada correctamente.");
  }
}
