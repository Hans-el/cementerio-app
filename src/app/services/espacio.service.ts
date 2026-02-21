import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EspacioService {
  private apiUrl = environment.apiUrl + '/espacios'; // Usamos la URL del entorno

  constructor(private http: HttpClient) {}

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

  getResumenEspacios(): Observable<{
    bovedas: number;
    nichos: number;
    cruces: number;
  }> {
    return this.http.get<{ bovedas: number; nichos: number; cruces: number }>(
      `${this.apiUrl}/resumen`,
    );
  }
}
