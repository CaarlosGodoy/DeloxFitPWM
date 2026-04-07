import { Component } from '@angular/core';
import { FaqItemComponent } from '../shared/faq-item/faq-item.component';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [FaqItemComponent],
  templateUrl: './faqs.html',
  styleUrl: '../../css/faqsPage.css',
})
export class FaqsComponent {}
