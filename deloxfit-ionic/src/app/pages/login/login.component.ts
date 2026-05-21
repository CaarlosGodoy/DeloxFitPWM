import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  email = '';
  password = '';
  private auth = inject(Auth);
  private router = inject(Router);

  async login() {
    const email = this.email.trim().toLowerCase();
    const password = this.password;

    if (!email || !password) {
      alert('Por favor, ingresa email y contraseña.');
      return;
    }

    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      await this.auth.authStateReady();
      this.router.navigate(['/favorites'], { replaceUrl: true });
    } catch (error: any) {
      console.error('Error en login', error);
      alert(this.getLoginErrorMessage(error));
    }
  }

  private getLoginErrorMessage(error: { code?: string }): string {
    switch (error?.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email o contraseña incorrectos.';
      case 'auth/invalid-email':
        return 'El formato del correo no es válido.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
      case 'auth/user-disabled':
        return 'Esta cuenta está deshabilitada.';
      default:
        return 'Error al iniciar sesión. Verifica tus credenciales.';
    }
  }
}
