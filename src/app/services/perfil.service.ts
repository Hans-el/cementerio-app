// Este servicio se crea para manejar las operaciones relacionadas con el perfil de usuario
// En otras palabras, es para editar los datos del usuario.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:3000/api/usuarios'; 

  constructor(private http: HttpClient) {}

  getPerfil(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  updatePerfil(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
