import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyD_M8Sh34KpuMr5Cs9XughVmKnXkF0BjUw",
  authDomain: "pwm-deloxfitweb.firebaseapp.com",
  projectId: "pwm-deloxfitweb",
  storageBucket: "pwm-deloxfitweb.firebasestorage.app",
  messagingSenderId: "97885501355",
  appId: "1:97885501355:web:83847e16ccfddb0807c4ee",
  measurementId: "G-CD4Z0D1T2D"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    // --- NUEVO: Añadimos el provider de Autenticación ---
    provideAuth(() => getAuth())
  ]
};
