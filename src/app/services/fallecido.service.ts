// Este está siendo usado por el componente difuntos en el sidebar. 
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FallecidoService {
  private apiUrl = 'http://localhost:3000/api/fallecidos';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Obtener todos los fallecidos 
  getFallecidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Buscar fallecidos por nombre unicamente
  buscarFallecidos(q: string): Observable<any[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<any[]>(`${this.apiUrl}/buscar`, { params });
  }

  // Agregar un nuevo fallecido
  createFallecido(fallecido: any): Observable<any> {
    return this.http.post(this.apiUrl, fallecido);
  }

  // Actualizar un fallecido existente
  updateFallecido(idFallecido: number, fallecido: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idFallecido}`, fallecido);
  }

}