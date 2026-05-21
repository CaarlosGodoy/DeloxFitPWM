import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/database.service';
import { SqliteService } from '../../services/sqlite.service';
import { subscriptionImageName } from '../../services/site-data.util';
import { take } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private sqlite = inject(SqliteService);

  item: any = null;
  itemId: string = '';
  isFavorite: boolean = false;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.itemId) return;

    this.dataService.getSiteData().pipe(take(1)).subscribe((data) => {
      const found = data?.subscriptions?.find(
        s => s.title.toLowerCase().replace(/\s/g, '-') === this.itemId
      );
      if (found) {
        this.item = {
          id: this.itemId,
          nombre: found.title,
          precio: found.price,
          descripcion: `Suscripción de nivel ${found.title} a un precio de ${found.price}. Ideal para tu entrenamiento en DeloxFit.`,
          imagen: `assets/images/${subscriptionImageName(found.title)}`
        };
      }
    });

    void this.initFavoriteState();
  }

  private async initFavoriteState() {
    await this.sqlite.initDatabase();
    if (this.itemId) {
      this.isFavorite = await this.sqlite.isFavorite(this.itemId);
    }
  }

  async toggleFavorite() {
    if (!this.itemId || !this.item) return;

    if (this.isFavorite) {
      await this.sqlite.removeFavorite(this.itemId);
      this.isFavorite = false;
    } else {
      await this.sqlite.addFavorite(this.item);
      this.isFavorite = true;
    }
  }
}
