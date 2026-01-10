import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ocupacion } from '../models/ocupacion.model'; // usamos el modelo de Ocupacion

@Injectable({
  providedIn: 'root',
})
export class OcupacionesService {
  private apiUrl = 'http://localhost:3000/api/ocupaciones';
  //Este servicio se usa en el componente inicio
  //Este servicio usa los datos del modelo de Ocupacion (models/ocupacion.model.ts)

  constructor(private http: HttpClient) { }
  /** Listado principal (vista completa) */
  getOcupaciones(page = 1, limit = 50): Observable<Ocupacion[]> {
    return this.http.get<Ocupacion[]>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }

  // Obtener el total de ocupaciones, ideal para mostrarlos en los contadores
  getTotalOcupaciones(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`);
  }

  /** Buscar por código o fallecido */
  buscarOcupaciones(query: string): Observable<Ocupacion[]> {
    return this.http.get<Ocupacion[]>(
      `${this.apiUrl}/buscar?q=${query}`
    );
  }

  // para filtrar las ocupaciones por sector, manzana y bloque
  filtrarOcupaciones(filtros: {
    sector?: string;
    manzana?: string;
    bloque?: string;
    tipo?: string;
  }): Observable<Ocupacion[]> {
    let params = new HttpParams();

    if (filtros.sector) params = params.set('sector', filtros.sector);
    if (filtros.manzana) params = params.set('manzana', filtros.manzana);
    if (filtros.bloque) params = params.set('bloque', filtros.bloque);
    if (filtros.tipo) params = params.set('tipo', filtros.tipo);

    return this.http.get<Ocupacion[]>(
      `${this.apiUrl}/filtrar`,
      { params }
    );
  }

}
