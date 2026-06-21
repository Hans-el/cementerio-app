//creamos este interceptor para el token del usuario, para que se envie automaticamente el token y valide la informacion.
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CementerioService } from '../services/cementerio.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cementerioService = inject(CementerioService);
  const token = localStorage.getItem('token');

  if (!token) return next(req);

  // Decodificar el rol del token
  let rol: string | null = null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    rol = payload.rol;
  } catch { }

  // Construir headers base
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  // Si es superadmin, agregar el id_cementerio activo como header
  if (rol === 'superadmin') {
    const cementerio = cementerioService.getCementerioActivoSnapshot();
    if (cementerio?.id_cementerio) {
      headers['x-cementerio-id'] = String(cementerio.id_cementerio);
    }
  }

  const authReq = req.clone({ setHeaders: headers });
  return next(authReq);
};