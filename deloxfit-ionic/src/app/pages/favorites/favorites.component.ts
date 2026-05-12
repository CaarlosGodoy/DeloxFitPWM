import { Component, OnInit, inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { DataService, SiteData } from '../../services/database.service';
import { SqliteService } from '../../services/sqlite.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { heart, heartOutline, star, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class FavoritesComponent implements OnInit {
  private dataService = inject(DataService);
  private sqlite = inject(SqliteService);
  private router = inject(Router);
  private auth = inject(Auth);

  items$: Observable<any[]> | undefined;
  favorites: string[] = [];

  constructor() {
    addIcons({ heart, heartOutline, star, logOutOutline });
  }

  async ngOnInit() {
    await this.sqlite.initDatabase();
    await this.loadFavorites();

    // Como no tenías la colección 'clases', usamos 'siteConfig' (Suscripciones)
    // que es la data que ya tenías cargada en tu web antigua para que se vea contenido.
    this.items$ = this.dataService.getSiteData().pipe(
      map((data: SiteData) => {
        if (!data || !data.subscriptions) return [];
        return data.subscriptions.map(sub => ({
          id: sub.title.toLowerCase().replace(/\s/g, '-'),
          nombre: sub.title,
          precio: sub.price,
          descripcion: `Suscripción de ${sub.title} por ${sub.price}`,
          imagen: 'https://ionicframework.com/docs/img/demos/card-media.png'
        }));
      })
    );
  }

  async ionViewWillEnter() {
    await this.loadFavorites();
  }

  async loadFavorites() {
    this.favorites = await this.sqlite.getFavoritesIds();
  }

  isFav(id: string): boolean {
    return this.favorites.includes(id);
  }

  goToDetail(id: string) {
    this.router.navigate(['/detail', id]);
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
