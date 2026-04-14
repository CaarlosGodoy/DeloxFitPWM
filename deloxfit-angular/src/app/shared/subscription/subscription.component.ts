import { Component, Input, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  template: `
    <div class="subscription-card">
        <h3 class="subscription-title">{{title}}</h3>

        <div class="subscription-price">
            <span class="price-amount">{{price}}</span>
        </div>

        <button class="subscription-btn" (click)="onAcquire()">ADQUIRIR</button>
    </div>
  `,
  styleUrl: '../../subscriptions/subscriptions.css',
})
export class SubscriptionComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) price!: string;

  authService = inject(AuthService);

  onAcquire() {
    const res = this.authService.acquireSubscription(this.title);
    alert(res.message);
  }
}
