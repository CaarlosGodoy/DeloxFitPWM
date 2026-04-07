import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-faq-item',
  standalone: true,
  template: `
    <div class="faq-item">
        <div class="question">{{question}}</div>
        <div class="answer">{{answer}}</div>
    </div>
  `,
  styleUrl: '../../../css/faqsPage.css',
})
export class FaqItemComponent {
  @Input({ required: true }) question!: string;
  @Input({ required: true }) answer!: string;
}
