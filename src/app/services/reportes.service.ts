import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private apiUrl = environment.apiUrl + '/reportes'; // Usamos la URL del entorno

  constructor(private http: HttpClient) {}

  // Reportes de ocupaciones
  getReporteOcupaciones(
    startDate?: string,
    endDate?: string,
  ): Observable<any[]> {
    let params: any = {};
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
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
}
