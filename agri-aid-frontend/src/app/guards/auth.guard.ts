import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  // Check if user is logged in
  if (!auth.isLoggedIn()) {
    console.log('AuthGuard: User not logged in - redirecting to login');
    return router.parseUrl('/login');
  }

  // Additional token validation
  const token = auth.getToken();
  if (!token) {
    console.log('AuthGuard: No token found - redirecting to login');
    return router.parseUrl('/login');
  }

  try {
    // Verify token is not expired
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      console.log('AuthGuard: Token expired - redirecting to login');
      return router.parseUrl('/login');
    }
    
    return true;
  } catch (error) {
    console.error('AuthGuard: Invalid token -', error);
    return router.parseUrl('/login');
  }
};