// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html'
// })
// export class RegisterComponent {
//   user = {
//     name: '',
//     email: '',
//     password: '',
//     role: 'farmer' // or seller (dropdown in form)
//   };

//   constructor(private auth: AuthService, private router: Router) {}

//   register() {
//     this.auth.register(this.user).subscribe({
//       next: (res: any) => {
//         this.auth.setToken(res.token);
//         this.router.navigate(
//           [this.user.role === 'farmer' ? '/farmer-dashboard' : '/seller-dashboard']
//         );
//       },
//       error: (err) => console.error('Register failed:', err)
//     });
//   }
// }

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    role: '',
    location: '' // Optional field for location
  };
  
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  register(): void {
    // Validate required fields
    if (!this.user.name || !this.user.email || !this.user.password || !this.user.role) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // Password validation (minimum 6 characters)
    if (this.user.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    // Clear any previous error messages
    this.errorMessage = '';

    // Call the auth service to register
    this.auth.register(this.user).subscribe({
      next: (res: any) => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 409) {
          this.errorMessage = 'Email already exists. Please use a different email.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
        console.error('Registration error:', err);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}