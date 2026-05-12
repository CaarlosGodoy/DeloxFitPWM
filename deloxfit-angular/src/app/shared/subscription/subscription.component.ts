import { Component, Input, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  template: `
    <div class="card bg-black border border-info h-100 mx-auto text-center text-white py-4 shadow-sm hover-shadow" style="max-width: 350px;">
      <div class="card-body d-flex flex-column">
        <h3 class="card-title text-info text-uppercase mb-4">{{title}}</h3>

        <div class="mb-4">
            <span class="fs-1 fw-bold">{{price}}</span>
        </div>

        <button class="btn btn-info fw-bold w-100 mt-auto" (click)="onAcquire()">ADQUIRIR</button>
      </div>
    </div>
  `
})
export class SubscriptionComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) price!: string;

  authService = inject(AuthService);

  async onAcquire() {
    const res = await this.authService.acquireSubscription(this.title);
    alert(res.message);
  }
}
