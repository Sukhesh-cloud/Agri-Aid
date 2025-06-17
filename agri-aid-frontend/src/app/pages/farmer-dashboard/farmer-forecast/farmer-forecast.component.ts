import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface DayForecast {
  maxtemp_c: number;
  mintemp_c: number;
  maxtemp_f: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: WeatherCondition;
  uv: number;
}

interface AstronomyData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: string;
}

interface HourlyForecast {
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}

interface ForecastDay {
  date: string;
  date_epoch: number;
  day: DayForecast;
  astro: AstronomyData;
  hour: HourlyForecast[];
}

@Component({
  selector: 'app-farmer-forecast',
  templateUrl: './farmer-forecast.component.html',
  styleUrls: ['./farmer-forecast.component.scss']
})
export class FarmerForecastComponent implements OnInit {
  location: string = '';
  forecastData: ForecastDay[] = [];
  loading = true;
  selectedDay: ForecastDay | null = null;
  showHourlyForecast = false;
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';
  windUnit: 'kph' | 'mph' = 'kph';

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    const user = this.authService.getTokenPayload();
    if (user && user.id) {
      this.fetchUserDetails(user.id);
    }
  }

  fetchUserDetails(id: string) {
    this.http.get<any>(`http://localhost:5000/api/auth/user/${id}`).subscribe({
      next: (data) => {
        this.location = data.location;
        this.fetch7DayForecast(this.location);
      },
      error: () => this.loading = false
    });
  }

  fetch7DayForecast(location: string) {
    const apiKey = 'your_api_key';
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=yes&alerts=yes`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.forecastData = res.forecast.forecastday;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleTemperatureUnit() {
    this.temperatureUnit = this.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
  }

  toggleWindUnit() {
    this.windUnit = this.windUnit === 'kph' ? 'mph' : 'kph';
  }

  getTemperature(tempC: number, tempF: number): string {
    return this.temperatureUnit === 'celsius' ? `${tempC}°C` : `${tempF}°F`;
  }

  getWindSpeed(windKph: number, windMph: number): string {
    return this.windUnit === 'kph' ? `${windKph} km/h` : `${windMph} mph`;
  }

  selectDay(day: ForecastDay) {
    this.selectedDay = day;
    this.showHourlyForecast = true;
  }

  closeHourlyForecast() {
    this.showHourlyForecast = false;
    this.selectedDay = null;
  }

  getUVIndex(uv: number): string {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  }

  getUVIndexClass(uv: number): string {
    if (uv <= 2) return 'text-success';
    if (uv <= 5) return 'text-warning';
    if (uv <= 7) return 'text-orange';
    if (uv <= 10) return 'text-danger';
    return 'text-purple';
  }

  getHumidityClass(humidity: number): string {
    if (humidity < 30) return 'text-warning';
    if (humidity > 70) return 'text-info';
    return 'text-success';
  }

  getRainChanceClass(chance: number): string {
    if (chance < 30) return 'text-success';
    if (chance < 70) return 'text-warning';
    return 'text-primary';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatTime(timeString: string): string {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
