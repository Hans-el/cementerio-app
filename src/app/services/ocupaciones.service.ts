import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OcupacionesService {
  private apiUrl = 'http://localhost:3000/api/ocupaciones';


  constructor(private http: HttpClient) { }

  /** 1. Todas las ocupaciones, no solo las activas (paginadas) */
  getOcupaciones(page: number = 1): Observable<any[]> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<any[]>(`${this.apiUrl}`, { params });
  }

  buscarOcupaciones(q: string): Observable<any[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<any[]>(`${this.apiUrl}/buscar`, { params });
  }

  filtrarOcupaciones(filtros: {
    sector?: number;
    manzana?: number;
    bloque?: number;
    tipo_bloque?: string;
  }): Observable<any[]> {
    let params = new HttpParams();

    if (filtros.sector !== undefined) {
      params = params.set('sector', filtros.sector.toString());
    }

    if (filtros.manzana !== undefined) {
      params = params.set('manzana', filtros.manzana.toString());
    }

    if (filtros.bloque !== undefined) {
      params = params.set('bloque', filtros.bloque.toString());
    }

    if (filtros.tipo_bloque) {
      params = params.set('tipo_bloque', filtros.tipo_bloque);
    }

    return this.http.get<any[]>(`${this.apiUrl}/filtrar`, { params });
  }
}