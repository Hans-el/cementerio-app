// Este está siendo usado por el componente difuntos en el sidebar.
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { CementerioService } from './cementerio.service';
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
    private router: Router
  ) { }

  // Obtener fallecidos paginados
  getFallecidos(
    page: number,
    limit: number,
    q?: string,
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

    if (q) {
      params = params.set('q', q);
    }

    return this.http.get<{
      data: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(this.apiUrl, { params });
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

  //este es usado en la pagina de fallecidos
  buscarFallecidos(q: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar`, {
      params: { q },
    });
  }

  //este es usado en el modal de localizar exclusivamente, para buscar unicamente por nombre.
  buscarBovedaPorNombre(nombre: string): Observable<any[]> {
    const slug = this.cementerioService.getSlugActivo();

    return this.http.get<any[]>(`${this.apiUrl}/buscar-boveda`, {
      params: { nombre, cementerio: slug || '' },
    });
  }
  //nuevo metodo para autocompletado de nombres en el modal de localizar. ESTA FUNCION ES MUY IMPORTANTE PARA FACILITAR LA BUSQUEDA EXACTA Y NO METER VALORES ERRONEOS.
  obtenerSugerenciasNombres(term: string): Observable<string[]> {
    const cementerio = this.cementerioService.getCementerioActivoSnapshot();
    let params: any = { term };
    if (cementerio) {
      params.id_cementerio = cementerio.id_cementerio;
    }
    return this.http.get<string[]>(`${this.apiUrl}/sugerencias-nombres`, { params });
  }
  //crear un nuevo fallecido, usado en el modal de añadir difunto
  crearFallecido(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  // Método para actualizar un fallecido por su ID, como nombres y fechas
  actualizarFallecido(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  // Método para editar el espacio de un fallecido, usado para cambios de ubicaciones
  editarEspacioFallecido(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/cambiar-espacio/:id_fallecido`,
      data,
    );
  }
  // Método para eliminar un fallecido por su ID
  eliminarFallecido(id_fallecido: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id_fallecido}`);
  }
}
