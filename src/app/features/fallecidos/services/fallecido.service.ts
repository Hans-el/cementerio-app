// Este está siendo usado por el componente difuntos en el sidebar.
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../../environments/environment';
import { CementerioService } from '../../../features/auth/services/cementerio.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FallecidoService {
  private apiUrl = environment.apiUrl + '/fallecidos'; // Usamos la URL del entorno

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cementerioService: CementerioService,
    private router: Router,
  ) {}

  getFallecidos(
    page: number,
    limit: number,
    q?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Observable<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (q) params = params.set('q', q);
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);

    return this.http.get<{
      data: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(this.apiUrl, { params });
  }

  getTotalFallecidos(
    q?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Observable<{ total: number }> {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);
    return this.http.get<{ total: number }>(`${this.apiUrl}/total`, { params });
  }

  buscarFallecidos(q: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar`, {
      params: { q },
    });
  }

  buscarBovedaPorNombre(nombre: string): Observable<any[]> {
    const slug = this.cementerioService.getSlugActivo();

    return this.http.get<any[]>(`${this.apiUrl}/buscar-boveda`, {
      params: { nombre, cementerio: slug || '' },
    });
  }

  obtenerSugerenciasNombres(term: string): Observable<string[]> {
    const cementerio = this.cementerioService.getCementerioActivoSnapshot();
    let params: any = { term };
    if (cementerio) {
      params.id_cementerio = cementerio.id_cementerio;
    }
    return this.http.get<string[]>(`${this.apiUrl}/sugerencias-nombres`, {
      params,
    });
  }

  crearFallecido(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizarFallecido(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  editarEspacioFallecido(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/cambiar-espacio/:id_fallecido`,
      data,
    );
  }
  registrarTraslado(id_fallecido: number, destino: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/traslado`, { id_fallecido, destino });
  }

  eliminarFallecido(id_fallecido: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id_fallecido}`);
  }
}
