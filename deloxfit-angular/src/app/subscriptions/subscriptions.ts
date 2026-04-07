import { Component } from '@angular/core';
import { SubscriptionComponent as SubCard } from '../shared/subscription/subscription.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [SubCard],
  templateUrl: './subscriptions.html',
  styleUrl: '../../css/subscriptionPage.css',
})
export class SubscriptionsComponent {}
