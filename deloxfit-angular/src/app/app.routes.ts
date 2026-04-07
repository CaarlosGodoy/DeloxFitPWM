import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { AccountComponent } from './account/account';
import { SubscriptionsComponent } from './subscriptions/subscriptions';
import { ClassesComponent } from './classes/classes';
import { FaqsComponent } from './faqs/faqs';
import { LegalnoticeComponent } from './legalnotice/legalnotice';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'mi-cuenta', component: AccountComponent },
  { path: 'suscripciones', component: SubscriptionsComponent },
  { path: 'clases', component: ClassesComponent },
  { path: 'faqs', component: FaqsComponent },
  { path: 'aviso-legal', component: LegalnoticeComponent },
  { path: '**', redirectTo: '' }
];
