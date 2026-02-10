import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/auth.models';

export const authGuard: CanActivateFn = (route, state) => {
    const platformId = inject(PLATFORM_ID);
    const authService = inject(AuthService);
    const router = inject(Router);

    // If we're on the server, we don't have access to localStorage.
    // We return true to allow the initial render, and the client will handle the actual check.
    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    if (!authService.isAuthenticated()) {
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    const requiredRoles = route.data['roles'] as Role[];
    if (requiredRoles && !authService.hasRole(requiredRoles)) {
        return router.createUrlTree(['/dashboard']);
    }

    return true;
};
