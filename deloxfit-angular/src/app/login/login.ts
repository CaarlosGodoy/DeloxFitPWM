import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: '../../css/login.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern('[0-9]{8}[A-Za-z]{1}')]],
    usuario: ['', [Validators.required, Validators.minLength(4)]],
    pass: ['', [Validators.required, Validators.minLength(6)]]
  });

  loginForm = this.fb.group({
    usuario: ['', Validators.required],
    pass: ['', Validators.required]
  });

  onRegister() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const success = this.authService.register({
        correo: formValue.correo!,
        dni: formValue.dni!,
        usuario: formValue.usuario!,
        pass: formValue.pass!,
        reservas: [],
        suscripcion: 'Ninguna activa'
      });
      if (success) {
        alert("¡Registro completado con éxito!");
        this.registerForm.reset();
      } else {
        alert("El nombre de usuario ya está registrado.");
      }
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      const success = this.authService.login(
        this.loginForm.value.usuario!, 
        this.loginForm.value.pass!
      );
      if (success) {
        this.router.navigate(['/mi-cuenta']);
      } else {
        alert("Usuario o contraseña incorrectos.");
      }
    }
  }
}
