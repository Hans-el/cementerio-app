import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BitacoraResponse } from '../models/bitacora.model';

@Injectable({
  providedIn: 'root',
})
export class BitacoraService {
  private apiUrl = environment.apiUrl + '/bitacora';

  constructor(private http: HttpClient) {}
  getBitacora(filtros: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    entidad?: string;
    accion?: string;
  }): Observable<BitacoraResponse> {
    let params = new HttpParams()
      .set('page', String(filtros.page ?? 1))
      .set('limit', String(filtros.limit ?? 50));

    if (filtros.startDate) params = params.set('startDate', filtros.startDate);
    if (filtros.endDate) params = params.set('endDate', filtros.endDate);
    if (filtros.entidad) params = params.set('entidad', filtros.entidad);
    if (filtros.accion) params = params.set('accion', filtros.accion);

    return this.http.get<BitacoraResponse>(this.apiUrl, { params });
  }
}
