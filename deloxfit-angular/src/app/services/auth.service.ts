import { Injectable, signal, inject } from '@angular/core';
import { DataService } from './database.service';
import { Firestore, doc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from '@angular/fire/firestore';

export interface User {
  correo?: string;
  email?: string;
  dni?: string;
  usuario?: string;
  nombre?: string;
  pass?: string;
  reservas?: string[];
  suscripcion?: string;
  uid?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private dataService = inject(DataService);
  private firestore = inject(Firestore);

  // Using signals to broadcast current user reactively
  currentUser = signal<User | null>(null);
  
  private userSub: any = null; // Unsubscribe function for the snapshot

  constructor() {
    this.listenToAuth();
  }

  private listenToAuth(): void {
    this.dataService.getAuthState().subscribe(user => {
      if (user) {
        // Logged in via Firebase, let's listen to their Firestore document in real-time
        const userDocRef = doc(this.firestore, 'usuarios', user.uid);
        this.userSub = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            this.currentUser.set({ ...docSnap.data(), uid: user.uid } as User);
          } else {
            // Document doesn't exist yet, wait for register to finish creating it
            console.log("No user document found yet");
          }
        });
      } else {
        // Logged out
        this.currentUser.set(null);
        if (this.userSub) {
          this.userSub();
          this.userSub = null;
        }
      }
    });
  }

  // Obsolete local storage methods mapped to Firebase
  async register(user: User): Promise<boolean> {
    try {
      await this.dataService.registrarUsuario(user.correo!, user.pass!, user.usuario!, user.dni!);
      return true;
    } catch(e) {
      console.error(e);
      return false;
    }
  }

  async login(usuario: string, pass: string): Promise<boolean> {
    try {
      await this.dataService.loginUsuario(usuario, pass);
      return true;
    } catch(e) {
      console.error(e);
      return false;
    }
  }

  async logout(): Promise<void> {
    await this.dataService.logout();
  }

  async bookClass(className: string): Promise<{ success: boolean; message: string }> {
    const user = this.currentUser();
    if (!user || !user.uid) {
      return { success: false, message: 'Debes iniciar sesión para reservar.' };
    }

    if (user.reservas && user.reservas.includes(className)) {
      return { success: false, message: 'Ya tienes una reserva para esta clase.' };
    }

    const userDocRef = doc(this.firestore, 'usuarios', user.uid);
    try {
      await updateDoc(userDocRef, {
        reservas: arrayUnion(className)
      });
      return { success: true, message: '¡Clase reservada con éxito!' };
    } catch(e) {
      console.error(e);
      return { success: false, message: 'Error al reservar la clase.' };
    }
  }

  async cancelReservation(className: string): Promise<void> {
    const user = this.currentUser();
    if (!user || !user.uid) return;
    
    const userDocRef = doc(this.firestore, 'usuarios', user.uid);
    try {
      await updateDoc(userDocRef, {
        reservas: arrayRemove(className)
      });
    } catch(e) {
      console.error(e);
    }
  }

  async acquireSubscription(subTitle: string): Promise<{ success: boolean; message: string }> {
    const user = this.currentUser();
    if (!user || !user.uid) {
      return { success: false, message: 'Debes iniciar sesión para adquirir.' };
    }

    if (user.suscripcion && user.suscripcion !== 'Ninguna activa') {
      return { success: false, message: 'Ya tienes una suscripción. Cancela la actual primero.' };
    }

    const userDocRef = doc(this.firestore, 'usuarios', user.uid);
    try {
      await updateDoc(userDocRef, { suscripcion: subTitle });
      return { success: true, message: `Has adquirido la suscripción ${subTitle} con éxito!` };
    } catch(e) {
      console.error(e);
      return { success: false, message: 'Error al adquirir la suscripción.' };
    }
  }

  async cancelSubscription(): Promise<void> {
    const user = this.currentUser();
    if (!user || !user.uid) return;
    
    const userDocRef = doc(this.firestore, 'usuarios', user.uid);
    try {
      await updateDoc(userDocRef, { suscripcion: 'Ninguna activa' });
    } catch(e) {
      console.error(e);
    }
  }
}
