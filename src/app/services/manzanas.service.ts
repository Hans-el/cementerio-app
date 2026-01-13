import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manzana } from '../models/manzana.model';


@Injectable({
  providedIn: 'root'
})
export class ManzanasService {
  private apiUrl = 'http://localhost:3000/api/manzanas';


  constructor(private http: HttpClient) { }
  /**
   * Obtener todas las manzanas
   */
  getManzanas(): Observable<Manzana[]> {
    return this.http.get<Manzana[]>(this.apiUrl);
  }
  //este lo uso para el modal de añadir difunto
  getManzanasid(idSector?: number): Observable<any[]> {
    const params: any = {};
    if (idSector) {
      params.id_sector = idSector;
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }
  /**
   * Obtener manzanas por sector
   * (para filtros y selects encadenados)
   */
  getManzanasBySector(idSector: number): Observable<Manzana[]> {
    const params = new HttpParams()
      .set('id_sector', idSector.toString());

    return this.http.get<Manzana[]>(this.apiUrl, { params });
  }
  getManzanasBySectorCodigo(idSector: string): Observable<Manzana[]> {
    const params = new HttpParams()
      .set('codigo_sector', idSector);
    return this.http.get<Manzana[]>(this.apiUrl, { params });
  }


  //Crear nueva manzana, usamos un objeto con los datos que están definidos en el servicio y backend
  createManzana(data: {
    id_sector: number;
    numero_manzana: number;
    descripcion?: string;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}