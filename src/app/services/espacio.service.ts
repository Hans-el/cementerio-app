import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspacioService {
  private apiUrl = 'http://localhost:3000/api/espacios';

  constructor(private http: HttpClient) { }

  // Obtener todos los espacios (opcionalmente por bloque)
  getEspacios(idBloque?: number): Observable<any[]> {
    const params: any = {};
    if (idBloque) {
      params.id_bloque = idBloque;
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // Obtener solo los espacios disponibles (opcional por bloque)
  getEspaciosDisponibles(idBloque?: number): Observable<any[]> {
    const params: any = {};
    if (idBloque) {
      params.id_bloque = idBloque;
    }
    return this.http.get<any[]>(`${this.apiUrl}/disponibles`, { params });
  }

  getResumenEspacios(): Observable<{ bovedas: number, nichos: number, cruces: number }> {
    return this.http.get<{ bovedas: number, nichos: number, cruces: number }>(`${this.apiUrl}/resumen`);
  }
}
