import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CementerioService } from '../../../features/publico/services/cementerio.service';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private apiUrl = environment.apiUrl + '/reportes'; // Usamos la URL del entorno

  constructor(
    private http: HttpClient,
    private cementerioService: CementerioService,
  ) {}

  // Reportes de ocupaciones
  getReporteOcupaciones(
    startDate?: string,
    endDate?: string,
  ): Observable<any[]> {
    const slug = this.cementerioService.getSlugActivo();
    let params: any = {};
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
      params.slug = slug;
    }
    return this.http.get<any[]>(`${this.apiUrl}/ocupaciones`, { params });
  }

  // Reportes de fallecidos
  getReporteFallecidos(
    startDate?: string,
    endDate?: string,
  ): Observable<any[]> {
    let params: any = {};
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }
    return this.http.get<any[]>(`${this.apiUrl}/fallecidos`, { params });
  }

  // Reportes de bloques
  getReporteBloques(startDate?: string, endDate?: string): Observable<any[]> {
    let params: any = {};
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }
    return this.http.get<any[]>(`${this.apiUrl}/bloques`, { params });
  }
  //Reporte de solicitudes exhumaciones/inhumaciones
  getReporteSolicitudes(
    startDate?: string,
    endDate?: string,
    tipo?: string,
    estado?: string,
  ): Observable<any[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (tipo) params = params.set('tipo', tipo);
    if (estado) params = params.set('estado', estado);
    return this.http.get<any[]>(`${this.apiUrl}/solicitudes`, { params });
  }
}
