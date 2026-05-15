import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  // Si no hay token, sigue normal
  if (!token) {
    return next(req);
  }
  // Clonamos la request agregando Authorization
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(authReq);
};
