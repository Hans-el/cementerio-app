//creamos este interceptor para el token del usuario, para que se envie automaticamente el token y valide la informacion.
//tambien renovamos el token automaticamente si el token expira
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { CementerioService } from '../../features/publico/services/cementerio.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  const authService = inject(AuthService);
  const cementerioService = inject(CementerioService);
  const token = localStorage.getItem('token');

  // No interceptar el endpoint de refresh para evitar bucles
  if (req.url.includes('/auth/refresh') || req.url.includes('/auth/login')) {
    return next(req);
  }

  let headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;

    // Superadmin — agregar cementerio activo
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.rol === 'superadmin') {
        const cementerio = cementerioService.getCementerioActivoSnapshot();
        if (cementerio?.id_cementerio) {
          headers['x-cementerio-id'] = String(cementerio.id_cementerio);
        }
      }
    } catch {}
  }

  const authReq = req.clone({
    setHeaders: headers,
    withCredentials: true, // enviar cookies en todas las requests
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('Error status:', error.status, 'URL:', req.url);
      // Si recibimos 401 — intentar renovar el token automáticamente
      if (error.status === 401 && token && !req.url.includes('/auth/')) {
        console.log('Intentando renovar token...');
        return authService.renovarToken().pipe(
          switchMap((response) => {
            // Reintentar la request original con el nuevo token
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${response.token}` },
              withCredentials: true,
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Si el refresh también falla — sesión expirada definitivamente
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
