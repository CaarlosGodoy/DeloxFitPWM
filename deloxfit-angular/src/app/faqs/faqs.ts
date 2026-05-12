import { Component, inject, OnInit, signal } from '@angular/core';
import { FaqItemComponent } from '../shared/faq-item/faq-item.component';
import { DataService } from '../services/database.service';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [FaqItemComponent],
  templateUrl: './faqs.html'
})
export class FaqsComponent implements OnInit {
  dataService = inject(DataService);
  faqColumn1 = signal<{ question: string; answer: string }[]>([]);
  faqColumn2 = signal<{ question: string; answer: string }[]>([]);

  ngOnInit() {
    this.dataService.getSiteData().subscribe(data => {
      if (data && data.faqs) {
        const half = Math.ceil(data.faqs.length / 2);
        this.faqColumn1.set(data.faqs.slice(0, half));
        this.faqColumn2.set(data.faqs.slice(half));
      }
    });
  }
}
