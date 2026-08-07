import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CementerioService } from '../services/cementerio.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const cementerioService = inject(CementerioService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  // Si no hay cementerio seleccionado, volver a la selección
  if (!cementerioService.getCementerioActivoSnapshot()) {
    router.navigate(['/cementerios']);
    return false;
  }

  return true;
};