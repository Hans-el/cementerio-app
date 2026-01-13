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


  // Obtener fallecidos paginados
  getFallecidos(page: number, limit: number, q?: string): Observable<{ data: any[], total: number, page: number, limit: number, totalPages: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (q) {
      params = params.set('q', q);
    }

    return this.http.get<{ data: any[], total: number, page: number, limit: number, totalPages: number }>(this.apiUrl, { params });
  }

  // Obtener el total de fallecidos (sin paginación)
  getTotalFallecidos(q?: string): Observable<{ total: number }> {
    let params = new HttpParams();
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<{ total: number }>(`${this.apiUrl}/total`, { params });
  }

  // getTotalFallecidos(): Observable<{ total: number }> {
  //   return this.http.get<{ total: number }>(`${this.apiUrl}/total`);
  // }

  buscarFallecidos(q: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar`, {
      params: { q }
    });
  }

  crearFallecido(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizarFallecido(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}