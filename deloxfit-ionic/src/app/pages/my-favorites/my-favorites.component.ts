import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { DataService, SiteData } from '../../services/database.service';
import { SqliteService } from '../../services/sqlite.service';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { heart, heartOutline, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class MyFavoritesComponent implements OnInit {
  private dataService = inject(DataService);
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
    // Combinamos la data de Firebase con la de SQLite
    this.favoritesOnly$ = combineLatest([
      this.dataService.getSiteData(),
      of(null).pipe(switchMap(() => this.sqlite.getFavoritesIds()))
    ]).pipe(
      map(([data, favIds]) => {
        if (!data || !data.subscriptions) return [];
        
        return data.subscriptions
          .map(sub => ({
            id: sub.title.toLowerCase().replace(/\s/g, '-'),
            nombre: sub.title,
            precio: sub.price,
            descripcion: `Suscripción de ${sub.title}`,
            imagen: 'https://ionicframework.com/docs/img/demos/card-media.png'
          }))
          .filter(item => favIds.includes(item.id));
      })
    );
  }

  goToDetail(id: string) {
    this.router.navigate(['/detail', id]);
  }
}
