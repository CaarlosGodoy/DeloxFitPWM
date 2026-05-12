import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RegisterComponent {
  nombre = '';
  apellidos = '';
  email = '';
  password = '';
  selectedFile: File | null = null;
  
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private router = inject(Router);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async register() {
    if (!this.email || !this.password || !this.nombre || !this.selectedFile) {
      alert('Por favor, completa todos los campos obligatorios y selecciona una imagen de perfil.');
      return;
    }

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const uid = userCredential.user.uid;

      // 2. Subir imagen a Firebase Storage
      const filePath = `profile_images/${uid}_${this.selectedFile.name}`;
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, this.selectedFile);
      const imageUrl = await getDownloadURL(storageRef);

      // 3. Guardar datos adicionales en Firestore
      const userDocRef = doc(this.firestore, `usuarios/${uid}`);
      await setDoc(userDocRef, {
        uid: uid,
        nombre: this.nombre,
        apellidos: this.apellidos,
        email: this.email,
        fotoPerfil: imageUrl,
        fechaRegistro: new Date()
      });

      alert('Registro exitoso. Bienvenido a DeloxFit!');
      this.router.navigate(['/favorites']);
    } catch (error: any) {
      console.error('Error en registro', error);
      alert('Hubo un error en el registro: ' + (error.message || error));
    }
  }
}
