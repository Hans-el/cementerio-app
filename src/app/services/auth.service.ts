import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient, apiService: ApiService) { }

  // Método para iniciar sesión
  login(cedula: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { cedula, contrasena });
  }

  // Método para registrar un nuevo usuario
  registrar(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registrar`, userData);
  }

  /* Método para solicitar un enlace de recuperación de contraseña. //Esto se implementará en versiones posteriores con Nodemailer.
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }
    */

  // Método para obtener todos los usuarios (ejemplo de ruta protegida)
  getUsuarios(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/usuarios`, { headers });
  }

  // Método para cerrar sesión, eliminando el token del almacenamiento local
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Devuelve true si hay un token, false en caso contrario
  }

   // Método para verificar si el usuario es administrador (mas sencillo y practico)
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }


  // Método para verificar si el usuario es administrador
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.rol === 'admin';
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
      'Authorization': `Bearer ${token}`
    });
  }
}
