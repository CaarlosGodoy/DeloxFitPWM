import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SiteData {
  faqs: { question: string; answer: string }[];
  subscriptions: { title: string; price: string }[];
  schedule: { time: string; lunes: string; martes: string; miercoles: string; jueves: string; viernes: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);

  getSiteData(): Observable<SiteData> {
    return this.http.get<SiteData>('/assets/data.json');
  }
}
