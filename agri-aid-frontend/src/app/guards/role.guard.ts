import { CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['expectedRole'];
  
  // Get token from AuthService
  const token = auth.getToken();
  if (!token) {
    console.log('RoleGuard: No token found - redirecting to login');
    return router.parseUrl('/login');
  }

  try {
    // Decode token
    const decoded: any = jwtDecode(token);
    console.log('RoleGuard: Decoded token -', decoded);

    // Verify role exists
    if (!decoded.role) {
      console.error('RoleGuard: No role found in token');
      return router.parseUrl('/login');
    }

    // Normalize role comparison
    const userRole = decoded.role.toString().toLowerCase().trim();
    const requiredRole = expectedRole.toString().toLowerCase().trim();

    console.log(`RoleGuard: Checking ${userRole} against required ${requiredRole}`);

    // Role check
    if (userRole === requiredRole) {
      return true;
    }

    // Role mismatch
    console.log(`RoleGuard: Access denied for ${userRole} to ${requiredRole} route`);
    return router.parseUrl('/login');

  } catch (error) {
    console.error('RoleGuard: Error decoding token -', error);
    return router.parseUrl('/login');
  }
};