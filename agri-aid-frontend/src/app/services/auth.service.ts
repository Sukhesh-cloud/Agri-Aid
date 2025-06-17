
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  getTokenPayload(): any {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return jwtDecode(token); // jwtDecode from 'jwt-decode' package
  }

  logout() {
    localStorage.clear();
  }
}
