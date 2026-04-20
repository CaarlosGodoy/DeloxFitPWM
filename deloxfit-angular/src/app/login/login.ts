import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/database.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private router = inject(Router);

  // Formulario de Registro
  registerForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern('[0-9]{8}[A-Za-z]{1}')]],
    usuario: ['', [Validators.required, Validators.minLength(4)]],
    pass: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Formulario de Inicio de Sesión
  loginForm = this.fb.group({
    usuario: ['', Validators.required], // Aquí el usuario debe escribir su EMAIL
    pass: ['', Validators.required]
  });

  /**
   * Registro con Firebase Authentication y Firestore
   */
  async onRegister() {
    if (this.registerForm.valid) {
      // Extraemos los valores con seguridad
      const email = this.registerForm.value.correo!;
      const password = this.registerForm.value.pass!;
      const nombre = this.registerForm.value.usuario!;
      const dni = this.registerForm.value.dni!;

      try {
        await this.dataService.registrarUsuario(email, password, nombre, dni);

        alert("¡Cuenta de DeloxFit creada con éxito!");
        this.registerForm.reset();
        this.router.navigate(['/mi-cuenta']);

      } catch (error: any) {
        console.error("Error en el registro:", error);
        // Personalizamos el error para el usuario
        if (error.code === 'auth/email-already-in-use') {
          alert("Este correo ya está registrado.");
        } else {
          alert("Error: " + error.message);
        }
      }
    }
  }

  /**
   * Inicio de sesión con Firebase
   */
  async onLogin() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.usuario!;
      const password = this.loginForm.value.pass!;

      try {
        await this.dataService.loginUsuario(email, password);
        this.router.navigate(['/mi-cuenta']);
      } catch (error: any) {
        console.error("Error en el login:", error);
        alert("Correo o contraseña incorrectos.");
      }
    }
  }
}
