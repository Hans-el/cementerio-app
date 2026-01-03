import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OcupacionesService {
  private apiUrl = 'http://localhost:3000/api/ocupaciones';


  constructor(private http: HttpClient) { }


  // Obtener ocupaciones activas con paginación
  getOcupacionesActivas(page: number = 1): Observable<any[]> {
    const params = new HttpParams().set('page', page);
    return this.http.get<any[]>(`${this.apiUrl}/activas`, { params });
  }
  //Para el buscador 
  buscarOcupaciones(filtros: { busqueda?: string; sector?: string; manzana?: string }) {
    let params = new HttpParams();
    if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
    if (filtros.sector) params = params.set('sector', filtros.sector);
    if (filtros.manzana) params = params.set('manzana', filtros.manzana);

    return this.http.get<any[]>(`${this.apiUrl}/ocupaciones/buscar`, { params });
  }
  //Autocomplete para el buscador, mejora la experiencia del usuario
  autocomplete(q: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/ocupaciones/autocomplete?q=${q}`
    );
  }

}