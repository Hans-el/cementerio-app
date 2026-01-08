import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ocupacion } from '../models/ocupacion.model';

@Injectable({
  providedIn: 'root',
})
export class OcupacionesService {
  private apiUrl = 'http://localhost:3000/api/ocupaciones';

  constructor(private http: HttpClient) { }
  /**Listar todas las ubicaciones (vista)
   * Soporta paginación
   */
  getOcupaciones(page: number): Observable<Ocupacion[]> {
    return this.http.get<Ocupacion[]>(`${this.apiUrl}?page=${page}`);
  }

  buscarOcupaciones(query: string): Observable<Ocupacion[]> {
    return this.http.get<Ocupacion[]>(`${this.apiUrl}/buscar?q=${query}`);
  }

  // En ocupaciones.service.ts
  filtrarOcupaciones(filtros: { sector?: string; manzana?: string; bloque?: string }): Observable<Ocupacion[]> {
    const params = new HttpParams()
      .set('sector', filtros.sector || '')
      .set('manzana', filtros.manzana || '')
      .set('bloque', filtros.bloque || '');

    return this.http.get<Ocupacion[]>(`${this.apiUrl}/filtrar`, { params });
  }

}
