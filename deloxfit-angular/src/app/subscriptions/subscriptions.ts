import { Component, inject, OnInit, signal } from '@angular/core';
import { SubscriptionComponent as SubCard } from '../shared/subscription/subscription.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [SubCard],
  templateUrl: './subscriptions.html',
  styleUrl: '../../css/subscriptionPage.css',
})
export class SubscriptionsComponent implements OnInit {
  dataService = inject(DataService);
  subscriptionsList = signal<{ title: string; price: string }[]>([]);

  ngOnInit() {
    this.dataService.getSiteData().subscribe(data => {
      this.subscriptionsList.set(data.subscriptions);
    });
  }
}
