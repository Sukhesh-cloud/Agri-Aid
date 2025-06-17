import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface SummaryResponse {
  summary: string;
  language?: string;  // Make it optional since backend might not always send it
}

@Injectable({
  providedIn: 'root'
})
export class SummarizerService {
  private apiUrl = 'http://localhost:5000/api/summarizer';

  constructor(private http: HttpClient) {}

  getSummary(query: string, lang: string = 'en') {
    return this.http.post<SummaryResponse>(this.apiUrl, { query, lang });
  }
}