import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="banner-background">
        <img [src]="image" alt="Background Banner" class="banner-img">
        <a [routerLink]="link" class="banner-btn">{{title}}</a>
    </div>
  `,
  styleUrl: './banner.css',
})
export class BannerComponent {
  @Input({ required: true }) image!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) link!: string;
}
