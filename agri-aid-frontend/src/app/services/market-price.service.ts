import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketPriceService {
  private apiUrl = 'http://localhost:5000/api/market-prices';

  constructor(private http: HttpClient) {}

  getPrices(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
