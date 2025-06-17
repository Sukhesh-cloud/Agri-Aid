import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';  // ✅ correct import (case-sensitive)

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  errorMessage: string = ''; // Optional: for user-facing error

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.auth.login(this.credentials).subscribe({
      next: (res: any) => {
        try {
          this.auth.setToken(res.token);
          const decoded: any = jwtDecode(res.token);

          const role = decoded?.role;
          if (role === 'farmer') {
            this.router.navigate(['/farmer-dashboard']);
          } else if (role === 'seller') {
            this.router.navigate(['/seller-dashboard']);
          } else {
            this.errorMessage = 'Unknown role. Access denied.';
          }
        } catch (err) {
          this.errorMessage = 'Invalid token. Please try again.';
          console.error('Token decode failed:', err);
        }
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
