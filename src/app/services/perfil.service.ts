// Este servicio se crea para manejar las operaciones relacionadas con el perfil de usuario
// Como actualizar perfil, obtener detalles de usuario, etc.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient, private authService: AuthService) { }

  //obtener el perfil de un usuario por el ID
  getPerfil(id: number): Observable<any> {
    const token = this.authService.getToken(); // Obtener el token de autenticación
    const headers = new HttpHeaders({ 
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }


  // editar el perfil del usuario
  updatePerfil(id: number, data: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers });
  }
}

// Nota: En las dos funciones se ha incluido el token de autenticación en los encabezados
// para asegurar que solo los usuarios autenticados puedan acceder o modificar su perfil.
