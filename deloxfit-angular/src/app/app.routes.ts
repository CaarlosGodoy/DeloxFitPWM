import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { AccountComponent } from './account/account';
import { SubscriptionsComponent } from './subscriptions/subscriptions';
import { ClassesComponent } from './classes/classes';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // La página principal (index)
  { path: 'login', component: LoginComponent },
  { path: 'mi-cuenta', component: AccountComponent },
  { path: 'suscripciones', component: SubscriptionsComponent },
  { path: 'clases', component: ClassesComponent },
  { path: '**', redirectTo: '' } // Si alguien pone una ruta que no existe, va al inicio
];
