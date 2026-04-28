import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-faq-item',
  standalone: true,
  template: `
    <div class="card bg-black border border-info h-100 text-white">
      <div class="card-body">
        <h5 class="card-title text-info mb-3"><i class="fa-solid fa-circle-question me-2"></i>{{question}}</h5>
        <p class="card-text mb-0">{{answer}}</p>
      </div>
    </div>
  `
})
export class FaqItemComponent {
  @Input({ required: true }) question!: string;
  @Input({ required: true }) answer!: string;
}
