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


  getFallecidos(page = 1, limit = 50): Observable<{ data: any[], total: number, page: number, limit: number, totalPages: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }



  getTotalFallecidos(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/total`);
  }

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