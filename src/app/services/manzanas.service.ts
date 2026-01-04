import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ManzanasService {
  private apiUrl = 'http://localhost:3000/api/manzanas';


  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las manzanas
   * (para un listado general por si llegaramos a necesitarlo)
   */
  getManzanas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Obtener manzanas filtradas por sector
   * @param idSector ID del sector seleccionado
   */
  getManzanasBySector(idSector: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sector/${idSector}`);
  }


}