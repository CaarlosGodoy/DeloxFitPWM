import { Injectable, signal } from '@angular/core';

export interface User {
  correo: string;
  dni: string;
  usuario: string;
  pass: string;
  reservas: string[];
  suscripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  // Using signals to broadcast current user reactively
  currentUser = signal<User | null>(null);

  constructor() {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const userStr = localStorage.getItem(this.CURRENT_USER_KEY);
    if (userStr) {
      try {
        this.currentUser.set(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing current user', e);
      }
    }
  }

  private getUsers(): User[] {
    const usersStr = localStorage.getItem(this.USERS_KEY);
    if (!usersStr) return [];
    try {
      return JSON.parse(usersStr);
    } catch (e) {
      return [];
    }
  }

  private setUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  register(user: User): boolean {
    const users = this.getUsers();
    if (users.find(u => u.usuario === user.usuario)) {
      return false; // Username already exists
    }
    users.push(user);
    this.setUsers(users);
    return true;
  }

  login(usuario: string, pass: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.usuario === usuario && u.pass === pass);
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      this.currentUser.set(user);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUser.set(null);
  }

  updateCurrentUser(updatedUser: User): void {
    this.currentUser.set(updatedUser);
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
    
    // Also update in users array
    const users = this.getUsers();
    const idx = users.findIndex(u => u.usuario === updatedUser.usuario);
    if (idx !== -1) {
      users[idx] = updatedUser;
      this.setUsers(users);
    }
  }

  bookClass(className: string): { success: boolean; message: string } {
    const user = this.currentUser();
    if (!user) {
      return { success: false, message: 'Debes iniciar sesión para reservar.' };
    }

    if (!user.reservas) user.reservas = [];

    if (user.reservas.includes(className)) {
      return { success: false, message: 'Ya tienes una reserva para esta clase.' };
    }

    const updatedUser = { ...user, reservas: [...user.reservas, className] };
    this.updateCurrentUser(updatedUser);
    return { success: true, message: '¡Clase reservada con éxito!' };
  }

  cancelReservation(index: number): void {
    const user = this.currentUser();
    if (!user || !user.reservas) return;
    
    const newReservas = [...user.reservas];
    newReservas.splice(index, 1);
    
    this.updateCurrentUser({ ...user, reservas: newReservas });
  }

  acquireSubscription(subTitle: string): { success: boolean; message: string } {
    const user = this.currentUser();
    if (!user) {
      return { success: false, message: 'Debes iniciar sesión para adquirir.' };
    }

    if (user.suscripcion && user.suscripcion !== 'Ninguna activa') {
      return { success: false, message: 'Ya tienes una suscripción. Cancela la actual primero.' };
    }

    this.updateCurrentUser({ ...user, suscripcion: subTitle });
    return { success: true, message: `Has adquirido la suscripción ${subTitle} con éxito!` };
  }

  cancelSubscription(): void {
    const user = this.currentUser();
    if (user) {
      this.updateCurrentUser({ ...user, suscripcion: 'Ninguna activa' });
    }
  }
}
