import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CropSaleService {
  private apiUrl = 'http://localhost:5000/api/cropsale';

  constructor(private http: HttpClient) {}

  createSale(saleData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, saleData);
  }

  getFarmerSales(farmerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/farmer/${farmerId}`);
  }

  getPendingSales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending`);
  }

  respondToSale(saleId: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/respond/${saleId}`, data);
  }
}
