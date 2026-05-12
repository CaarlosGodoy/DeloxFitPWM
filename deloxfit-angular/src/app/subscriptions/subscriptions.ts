import { Component, inject, OnInit, signal } from '@angular/core';
import { SubscriptionComponent as SubCard } from '../shared/subscription/subscription.component';
import { DataService } from '../services/database.service';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [SubCard],
  templateUrl: './subscriptions.html'
})
export class SubscriptionsComponent implements OnInit {
  dataService = inject(DataService);
  subscriptionsList = signal<{ title: string; price: string }[]>([]);

  ngOnInit() {
    this.dataService.getSiteData().subscribe({
      next: (data) => {
        if (data && data.subscriptions) {
          this.subscriptionsList.set(data.subscriptions);
        }
      },
      error: (err) => console.error('Error loading subscriptions:', err)
    });
  }
}
