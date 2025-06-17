import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private API_KEY = '2cf2d10f0f73c8cd4d5bc393369ca5fc';
  private baseUrl = 'https://api.openweathermap.org/data/3.0/onecall';

  constructor(private http: HttpClient) {}

  get7DayForecast(lat: number, lon: number) {
    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current,alerts&appid=${this.API_KEY}&units=metric`;
    return this.http.get(url);
  }
}
