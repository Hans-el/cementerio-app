import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Servicio para manejar operaciones relacionadas con usuarios
// Como actualizar perfil, obtener detalles de usuario, etc.
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  // Obtener usuario por ID
  getUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Actualizar usuario
  updateUsuario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
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
