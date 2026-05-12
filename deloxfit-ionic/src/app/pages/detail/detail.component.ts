import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DataService, SiteData } from '../../services/database.service';
import { SqliteService } from '../../services/sqlite.service';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
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

  async ngOnInit() {
    await this.sqlite.initDatabase();

    this.itemId = this.route.snapshot.paramMap.get('id') || '';
    if (this.itemId) {
      this.dataService.getSiteData().subscribe(async (data: SiteData) => {
        if (data && data.subscriptions) {
          const found = data.subscriptions.find(s => s.title.toLowerCase().replace(/\s/g, '-') === this.itemId);
          if (found) {
            this.item = {
              id: this.itemId,
              nombre: found.title,
              precio: found.price,
              descripcion: `Suscripción de nivel ${found.title} a un precio de ${found.price}. Ideal para tu entrenamiento en DeloxFit.`,
              imagen: 'https://ionicframework.com/docs/img/demos/card-media.png'
            };
          }
        }
      });

      this.isFavorite = await this.sqlite.isFavorite(this.itemId);
    }
  }

  async toggleFavorite() {
    if (!this.itemId) return;

    if (this.isFavorite) {
      await this.sqlite.removeFavorite(this.itemId);
      this.isFavorite = false;
    } else {
      await this.sqlite.addFavorite(this.itemId);
      this.isFavorite = true;
    }
  }
}
