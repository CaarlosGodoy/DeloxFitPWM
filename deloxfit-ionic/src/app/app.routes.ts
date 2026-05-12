import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { DetailComponent } from './pages/detail/detail.component';
import { MyFavoritesComponent } from './pages/my-favorites/my-favorites.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { path: 'my-favorites', component: MyFavoritesComponent, canActivate: [authGuard] },
  { path: 'detail/:id', component: DetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
