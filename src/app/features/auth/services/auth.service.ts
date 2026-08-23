import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';
import { CementerioService } from '../services/cementerio.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Usamos la URL del entorno
  private renovando$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private cementerioService: CementerioService,
    private router: Router,
  ) {}

  login(cedula: string, contrasena: string): Observable<any> {
    const slug = this.cementerioService.getSlugActivo();
    if (!slug) {
      this.router.navigate(['/cementerios']);
      return throwError(() => new Error('No hay cementerio seleccionado.'));
    }

    return this.http
      .post<any>(
        `${this.apiUrl}/auth/login`,
        {
          cedula,
          contrasena,
          slug,
        },
        {
          withCredentials: true, // necesario para recibir la cookie
        },
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
        }),
      );
  }

  // Método para registrar un nuevo usuario
  registrar(userData: any): Observable<any> {
    const slug = this.cementerioService.getSlugActivo();
    if (!slug) {
      // Redirigir a selección de cementerio si no hay slug
      this.router.navigate(['/cementerios']);
      return throwError(() => new Error('No hay cementerio seleccionado.'));
    }

    userData.slug = slug; // Agregar el slug al objeto de datos del usuario
    return this.http.post(`${this.apiUrl}/auth/registrar`, userData);
  }

  /* Método para solicitar un enlace de recuperación de contraseña. //Esto se implementará en versiones posteriores con Nodemailer.
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }*/

  // Método para obtener todos los usuarios (ejemplo de ruta protegida)
  getUsuarios(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/usuarios`, { headers });
  }

  renovarToken(): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/auth/refresh`,
        {},
        {
          withCredentials: true, // envía la cookie automáticamente
        },
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
        }),
        catchError((err) => {
          // Si el refresh falla — cerrar sesión
          this.logout();
          this.router.navigate(['/login']);
          return throwError(() => err);
        }),
      );
  }

  logout(): void {
    // Notificar al backend para invalidar el refresh token
    this.http
      .post(
        `${this.apiUrl}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .subscribe({ error: () => {} }); // silencioso si falla

    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.cementerioService.limpiar();
  }
  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Devuelve true si hay un token, false en caso contrario
  }

  // Método para verificar si el usuario es administrador (mas sencillo y practico)
  isAdmin(): boolean {
    return (
      this.getUserRole() === 'admin' || this.getUserRole() === 'superadmin'
    ); // Consideramos superadmin como admin también
  }

  // Método para verificar si el usuario es administrador
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.rol === 'admin' || payload.rol === 'superadmin';
    } catch (e) {
      return false;
    }
  }

  // Método para obtener el rol del usuario desde el token
  getUserRole(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      return 'Invitado'; // Valor por defecto si no hay token
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.rol || 'Invitado'; // Retorna el rol o 'Invitado' si no existe. De igual forma podrá ver el mapa.
    } catch (e) {
      return 'Invitado';
    }
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para obtener los headers con el token
  getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  // Método para obtener el usuario completo desde el token (id, nombre, rol, etc.)
  getUserFromToken(): any | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload; // Aquí estará { id, nombre, rol, ... }
    } catch (e) {
      console.error('Error al decodificar token:', e);
      return null;
    }
  }
}
