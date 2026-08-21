import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResumen } from '../models/dashboard.model';
import { environment } from '../../../../environments/environment';
import { InhumacionAnio } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl + '/reportes';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los KPIs del dashboard:
   * totales por tipo, por sector, top manzanas y conteo de fallecidos
   */
  getDashboardResumen(): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(`${this.apiUrl}/dashboard`);
  }

  /**
   * Obtener conteo de inhumaciones agrupadas por año
   * (últimos 10 años con fecha registrada)
   */
  getInhumacionesPorAnio(): Observable<InhumacionAnio[]> {
    return this.http.get<InhumacionAnio[]>(
      `${this.apiUrl}/inhumaciones-por-anio`,
    );
  }
}
