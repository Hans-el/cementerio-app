import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ocupacion } from '../models/ocupacion.model'; // usamos el modelo de Ocupacion
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OcupacionesService {
  private apiUrl = environment.apiUrl + '/ocupaciones'; // Usamos la URL del entorno
  //Este servicio se usa en el componente inicio
  //Este servicio usa los datos del modelo de Ocupacion (models/ocupacion.model.ts)

  constructor(private http: HttpClient) {}

  /**
   * Obtener ocupaciones paginadas
   * @param page Número de página
   * @param limit Número de registros por página
   * @returns Observable con los datos paginados
   */
  getOcupaciones(
    page: number = 1,
    limit: number = 50,
  ): Observable<{
    data: Ocupacion[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<{
      data: Ocupacion[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(this.apiUrl, { params });
  }

  /**
   * Obtener el total de ocupaciones
   * @returns Observable con el total de ocupaciones
   */
  getTotalOcupaciones(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/total`);
  }

  /**
   * Buscar ocupaciones por término de búsqueda con paginación
   * @param query Término de búsqueda
   * @param page Número de página
   * @param limit Número de registros por página
   * @returns Observable con los datos paginados
   */
  buscarOcupaciones(
    query: string,
    page: number = 1,
    limit: number = 50,
  ): Observable<{
    data: Ocupacion[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<{
      data: Ocupacion[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`${this.apiUrl}/buscar`, { params });
  }

  /**
   * Filtrar ocupaciones con paginación
   * @param filtros Objeto con los filtros a aplicar
   * @param page Número de página
   * @param limit Número de registros por página
   * @returns Observable con los datos paginados
   */
  filtrarOcupaciones(
    filtros: {
      sector?: string;
      manzana?: string;
      bloque?: string;
      tipo?: string;
    },
    page: number = 1,
    limit: number = 50,
  ): Observable<{
    data: Ocupacion[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filtros.sector) params = params.set('sector', filtros.sector);
    if (filtros.manzana) params = params.set('manzana', filtros.manzana);
    if (filtros.bloque) params = params.set('bloque', filtros.bloque);
    if (filtros.tipo) params = params.set('tipo', filtros.tipo);

    return this.http.get<{
      data: Ocupacion[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`${this.apiUrl}/filtrar`, { params });
  }
}
