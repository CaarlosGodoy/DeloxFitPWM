import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
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
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async register() {
    if (!this.email || !this.password || !this.nombre) {
      this.showToast('Por favor, completa los campos obligatorios.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando registro...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // 1. Crear usuario en Firebase Auth
      loading.message = 'Autenticando...';
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const uid = userCredential.user.uid;

      let imageUrl = 'https://ionicframework.com/docs/img/demos/avatar.svg';

      // 2. Intentar subir imagen (opcional si falla)
      if (this.selectedFile) {
        loading.message = 'Subiendo imagen de perfil...';
        try {
          const filePath = `profile_images/${uid}_${Date.now()}`;
          const storageRef = ref(this.storage, filePath);
          await uploadBytes(storageRef, this.selectedFile);
          imageUrl = await getDownloadURL(storageRef);
        } catch (imgErr) {
          console.warn('Fallo al subir imagen, se usará una por defecto', imgErr);
          // No lanzamos error para que el registro continúe
        }
      }

      // 3. Guardar datos adicionales en Firestore
      loading.message = 'Guardando perfil...';
      const userDocRef = doc(this.firestore, `usuarios/${uid}`);
      await setDoc(userDocRef, {
        uid: uid,
        nombre: this.nombre,
        apellidos: this.apellidos,
        email: this.email,
        fotoPerfil: imageUrl,
        fechaRegistro: new Date()
      });

      await loading.dismiss();
      this.showToast('¡Registro completado con éxito!');
      this.router.navigate(['/favorites'], { replaceUrl: true });
    } catch (error: any) {
      if (loading) await loading.dismiss();
      console.error('Error detallado en registro:', error);
      
      let msg = 'Error desconocido';
      if (error.code === 'auth/email-already-in-use') msg = 'Este correo ya está registrado.';
      else if (error.code === 'auth/weak-password') msg = 'La contraseña es muy corta (mínimo 6 caracteres).';
      else if (error.code === 'auth/invalid-email') msg = 'El formato del correo no es válido.';
      else msg = error.message;

      alert('Hubo un problema: ' + msg);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}
