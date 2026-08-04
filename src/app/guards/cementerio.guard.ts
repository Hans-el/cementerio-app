import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CementerioService } from '../services/cementerio.service';


export const cementerioGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const cementerioService = inject(CementerioService);
  const router = inject(Router);

  const tieneSesion = authService.isLoggedIn();
  const tieneCementerio = cementerioService.getCementerioActivoSnapshot();

  if (tieneSesion && tieneCementerio) {
    router.navigate(['/mapa']);
    return false;
  }

  return true;
};