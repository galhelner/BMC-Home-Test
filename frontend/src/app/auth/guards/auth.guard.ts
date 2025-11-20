import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check the authentication status
  if (authService.isAuthenticated()) {
    // User is authenticated, allow navigation (stay on the dashboard)
    return true; 
  } else {
    // User is NOT authenticated, redirect to the login page
    return router.createUrlTree(['/auth/login']); 
  }
};