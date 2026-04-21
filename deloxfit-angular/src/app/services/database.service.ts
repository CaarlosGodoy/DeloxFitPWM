import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Firestore,
  collection,
  addDoc,
  setDoc,
  doc,
  collectionData,
  onSnapshot
} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState // <--- AÑADE ESTO
} from '@angular/fire/auth';

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

  /**
   * ESTA ES LA FUNCIÓN QUE TE FALTA
   * Permite saber en tiempo real si hay un usuario logueado
   */
  getAuthState(): Observable<any> {
    return authState(this.auth);
  }

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

  async loginUsuario(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async logout() {
    return signOut(this.auth);
  }

  getSiteData(): Observable<SiteData> {
    return new Observable<SiteData>(observer => {
      const siteDataRef = doc(this.firestore, 'siteConfig', 'data');
      const unsubscribe = onSnapshot(siteDataRef, (docSnap) => {
        if (docSnap.exists()) {
          observer.next(docSnap.data() as SiteData);
        } else {
          observer.next(undefined as any);
        }
      }, (error) => {
        observer.error(error);
      });
      return () => unsubscribe();
    });
  }

  // Ejecuta esto una sola vez para subir tu JSON a Firebase
  async seedData() {
    this.http.get<SiteData>('assets/data.json').subscribe(async (data) => {
      try {
        const siteDataRef = doc(this.firestore, 'siteConfig', 'data');
        await setDoc(siteDataRef, data);
        console.log('✅ Datos subidos a Firestore correctamente!');
      } catch (error) {
        console.error('❌ Error subiendo datos:', error);
      }
    });
  }
}
