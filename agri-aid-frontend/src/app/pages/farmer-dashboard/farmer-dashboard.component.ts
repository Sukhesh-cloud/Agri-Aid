import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss']
})
export class FarmerDashboardComponent implements OnInit {
  location: string = '';
  weather: any = null;
  loadingWeather = true;
  
  // Dashboard stats (these could come from API calls)
  activeCrops: number = 12;
  currentYield: string = '2.4t';
  diseaseAlerts: number = 3;
  revenue: string = '1.2L';

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    const payload = this.authService.getTokenPayload();
    if (payload && payload.id) {
      this.fetchUserDetails(payload.id);
      this.loadDashboardStats();
    }
  }

  fetchUserDetails(userId: string) {
    this.http.get<any>(`http://localhost:5000/api/auth/user/${userId}`).subscribe({
      next: (user) => {
        this.location = user.location;
        this.fetchWeather(this.location);
      },
      error: (err) => {
        console.error('Failed to fetch user details:', err);
        this.loadingWeather = false;
      }
    });
  }

  fetchWeather(location: string) {
    const apiKey = '0a9e3a37e3ba4b14874140251251606';
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;
    
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.weather = data;
        this.loadingWeather = false;
      },
      error: (err) => {
        console.error('Failed to fetch weather:', err);
        this.loadingWeather = false;
      }
    });
  }

  // Load dashboard statistics (you can replace this with actual API calls)
  loadDashboardStats() {
    // This is where you would make API calls to get real dashboard data
    // For now, using mock data
    setTimeout(() => {
      this.activeCrops = Math.floor(Math.random() * 20) + 5;
      this.currentYield = (Math.random() * 5 + 1).toFixed(1) + 't';
      this.diseaseAlerts = Math.floor(Math.random() * 8);
      this.revenue = (Math.random() * 3 + 0.5).toFixed(1) + 'L';
    }, 1000);
  }

  // Generate weather alerts based on current conditions
  getWeatherAlert(): string {
    if (!this.weather) return 'No alerts';
    
    const temp = this.weather.current.temp_c;
    const humidity = this.weather.current.humidity;
    const windSpeed = this.weather.current.wind_kph;
    const condition = this.weather.current.condition.text.toLowerCase();

    if (condition.includes('rain') || condition.includes('storm')) {
      return 'Heavy rainfall expected - protect crops and equipment';
    } else if (temp > 35) {
      return 'High temperature warning - ensure adequate irrigation';
    } else if (temp < 5) {
      return 'Frost warning - protect sensitive crops';
    } else if (windSpeed > 25) {
      return 'Strong winds - secure loose equipment and structures';
    } else if (humidity > 85) {
      return 'High humidity - monitor for fungal diseases';
    } else if (humidity < 30) {
      return 'Low humidity - increase irrigation frequency';
    } else {
      return 'Favorable conditions for farming activities';
    }
  }

  // Get CSS class for weather alert styling
  getWeatherAlertClass(): string {
    if (!this.weather) return 'alert-info';
    
    const alert = this.getWeatherAlert();
    
    if (alert.includes('warning') || alert.includes('protect') || alert.includes('secure')) {
      return 'alert-warning';
    } else if (alert.includes('Favorable')) {
      return 'alert-success';
    } else {
      return 'alert-info';
    }
  }

  // Format numbers for display
  formatNumber(num: number): string {
    if (num >= 100000) {
      return (num / 100000).toFixed(1) + 'L';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Refresh dashboard data
  refreshDashboard() {
    this.loadingWeather = true;
    this.fetchWeather(this.location);
    this.loadDashboardStats();
  }
}