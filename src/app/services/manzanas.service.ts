import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manzana } from '../models/manzana.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManzanasService {
  private apiUrl = environment.apiUrl + '/manzanas'; // Usamos la URL del entorno

  constructor(private http: HttpClient) {}
  /**
   * Obtener todas las manzanas
   */
  getManzanas(id_sector: number): Observable<Manzana[]> {
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
   * Aunque estos podrian no usarse ya porque con los parametros en getManzanasid se puede hacer lo mismo, pero lo dejamos por ahora
   */
  getManzanasBySector(idSector: number): Observable<Manzana[]> {
    const params = new HttpParams().set('id_sector', idSector.toString());

    return this.http.get<Manzana[]>(this.apiUrl, { params });
  }
  getManzanasBySectorCodigo(idSector: string): Observable<Manzana[]> {
    const params = new HttpParams().set('codigo_sector', idSector);
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
