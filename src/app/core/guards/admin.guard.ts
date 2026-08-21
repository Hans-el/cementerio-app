// admin.guard.ts
// ESte guardia protege las rutas que solo deben ser accesibles por administradores, en este caso, protegemos la ruta en donde se gestionan las bóvedas.
// No es tan necesario un guardia tan complejo como el auth.guard.ts, ya que solo necesitamos verificar si el usuario tiene el rol de admin.
// Pero lo hemos para tener mejor claridad en el código, y más seguridad.
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const rol = authService.getUserRole();
  if (['admin', 'superadmin', 'supervisor'].includes(rol)) return true;
  router.navigate(['/mapa']);
  return false;
};
