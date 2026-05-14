import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { SqliteService } from '../../services/sqlite.service';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { heart, heartOutline, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class MyFavoritesComponent implements OnInit {
  private sqlite = inject(SqliteService);
  private router = inject(Router);

  favoritesOnly$: Observable<any[]> | undefined;

  constructor() {
    addIcons({ heart, heartOutline, arrowBack });
  }

  async ngOnInit() {
    await this.sqlite.initDatabase();
    this.loadFavorites();
  }

  async ionViewWillEnter() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoritesOnly$ = of(null).pipe(
      switchMap(() => this.sqlite.getFavorites()),
      map((favs: any[]) => {
        return favs.map(item => {
          if (!item.imagen || item.imagen.includes('card-media.png')) {
            const titleLower = item.nombre.toLowerCase();
            let imageName = 'gratis.png';
            if (titleLower.includes('anual')) imageName = 'anual.png';
            else if (titleLower.includes('diario')) imageName = 'diario.png';
            else if (titleLower.includes('familiar')) imageName = 'familiar.png';
            else if (titleLower.includes('mensual')) imageName = 'mensual.png';
            else if (titleLower.includes('semestral')) imageName = 'semestral.png';
            return { ...item, imagen: `assets/images/${imageName}` };
          }
          return item;
        });
      })
    );
  }

  async removeFav(event: Event, id: string) {
    event.stopPropagation();
    await this.sqlite.removeFavorite(id);
    this.loadFavorites();
  }

  goToDetail(id: string) {
    this.router.navigate(['/detail', id]);
  }
}
