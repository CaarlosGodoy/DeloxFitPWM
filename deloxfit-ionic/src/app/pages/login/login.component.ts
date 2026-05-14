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
    if (!this.email || !this.password) {
      alert('Por favor, ingresa email y contraseña.');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/favorites']);
    } catch (error) {
      console.error('Error en login', error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
  }
}
