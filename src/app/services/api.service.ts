import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // Asegúrate de que esta URL coincida con la de tu servidor backend

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión
  login(cedula: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { cedula, contrasena });
  }

  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/registrar`, userData);
  }

  // Método para solicitar un enlace de recuperación de contraseña
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  // Método para obtener todos los usuarios (ejemplo de ruta protegida)
  getUsuarios(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/usuarios`, { headers });
  }

  
}
