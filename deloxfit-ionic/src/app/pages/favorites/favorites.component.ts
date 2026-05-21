import { Component, OnInit, inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/database.service';
import { SqliteService } from '../../services/sqlite.service';
import { mapSubscriptionsToItems } from '../../services/site-data.util';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { heart, heartOutline, star, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class FavoritesComponent implements OnInit {
  private dataService = inject(DataService);
  private sqlite = inject(SqliteService);
  private router = inject(Router);
  private auth = inject(Auth);

  items$ = this.dataService.getSiteData().pipe(map(mapSubscriptionsToItems));
  favorites: string[] = [];

  constructor() {
    addIcons({ heart, heartOutline, star, logOutOutline });
  }

  ngOnInit() {
    void this.initFavorites();
  }

  private async initFavorites() {
    await this.sqlite.initDatabase();
    await this.loadFavorites();
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

  async toggleFav(event: Event, item: any) {
    event.stopPropagation();
    if (this.isFav(item.id)) {
      await this.sqlite.removeFavorite(item.id);
    } else {
      await this.sqlite.addFavorite(item);
    }
    await this.loadFavorites();
  }

  goToDetail(id: string) {
    this.router.navigate(['/detail', id]);
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
