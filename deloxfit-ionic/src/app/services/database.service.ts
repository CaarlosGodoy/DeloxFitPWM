import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, concat, defer, from, of } from 'rxjs';
import { catchError, filter, shareReplay, switchMap, timeout } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState
} from '@angular/fire/auth';

export interface SiteData {
  faqs: { question: string; answer: string }[];
  subscriptions: { title: string; price: string }[];
  schedule: { time: string; lunes: string; martes: string; miercoles: string; jueves: string; viernes: string }[];
}

const FIRESTORE_TIMEOUT_MS = 6000;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private siteData$?: Observable<SiteData>;

  getAuthState(): Observable<any> {
    return authState(this.auth);
  }

  /** Precarga datos en segundo plano (p. ej. al arrancar la app). */
  preloadSiteData(): void {
    this.getSiteData().subscribe();
  }

  getSiteData(): Observable<SiteData> {
    if (!this.siteData$) {
      this.siteData$ = this.http.get<SiteData>('assets/data.json').pipe(
        catchError(() => of({ faqs: [], subscriptions: [], schedule: [] } as SiteData)),
        switchMap((localData) =>
          concat(
            of(localData),
            defer(() => from(this.fetchFromFirestore())).pipe(
              timeout(FIRESTORE_TIMEOUT_MS),
              filter((remote): remote is SiteData => !!remote),
              catchError(() => of())
            )
          )
        ),
        shareReplay(1)
      );
    }
    return this.siteData$;
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

  async seedData() {
    const data = await firstValueFrom(this.http.get<SiteData>('assets/data.json'));
    if (!data) return;
    try {
      const siteDataRef = doc(this.firestore, 'siteConfig', 'data');
      await setDoc(siteDataRef, data);
      console.log('Datos subidos a Firestore correctamente');
    } catch (error) {
      console.error('Error subiendo datos:', error);
    }
  }

  private async fetchFromFirestore(): Promise<SiteData | null> {
    const siteDataRef = doc(this.firestore, 'siteConfig', 'data');
    const snap = await getDoc(siteDataRef);
    return snap.exists() ? (snap.data() as SiteData) : null;
  }
}
