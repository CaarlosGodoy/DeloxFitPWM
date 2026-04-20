import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Firestore,
  collection,
  addDoc,
  setDoc,
  doc,
  collectionData
} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';

// Interfaz para tus datos locales (FAQs, Horarios, etc.)
export interface SiteData {
  faqs: { question: string; answer: string }[];
  subscriptions: { title: string; price: string }[];
  schedule: { time: string; lunes: string; martes: string; miercoles: string; jueves: string; viernes: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor() { }

  async registrarUsuario(email: string, pass: string, nombre: string, dni: string) {

    const credenciales = await createUserWithEmailAndPassword(this.auth, email, pass);
    const uid = credenciales.user.uid;

    return setDoc(doc(this.firestore, 'usuarios', uid), {
      uid: uid,
      nombre: nombre,
      email: email,
      dni: dni,
      fechaRegistro: new Date(),
      rol: 'usuario'
    });
  }

  /**
   * Inicia sesión con email y contraseña
   */
  async loginUsuario(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async logout() {
    return signOut(this.auth);
  }

  getSiteData(): Observable<SiteData> {
    return this.http.get<SiteData>('assets/data.json');
  }
}
