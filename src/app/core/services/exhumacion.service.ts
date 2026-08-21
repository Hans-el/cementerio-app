import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SolicitudExhumacion,
  DocumentoExhumacion,
} from '../../core/models/exhumacion.model';

@Injectable({
  providedIn: 'root',
})
export class ExhumacionService {
  private apiUrl = environment.apiUrl + '/exhumaciones';

  constructor(private http: HttpClient) {}
  crearSolicitud(archivos: File[]): Observable<any> {
    const formData = new FormData();
    archivos.forEach((archivo) => formData.append('documentos', archivo));
    return this.http.post<any>(this.apiUrl, formData);
  }

  getSolicitudes(): Observable<SolicitudExhumacion[]> {
    return this.http.get<SolicitudExhumacion[]>(this.apiUrl);
  }

  getSolicitudActiva(): Observable<SolicitudExhumacion | null> {
    return this.http.get<SolicitudExhumacion | null>(`${this.apiUrl}/activa`);
  }

  getDocumentos(id_solicitud: number): Observable<DocumentoExhumacion[]> {
    return this.http.get<DocumentoExhumacion[]>(
      `${this.apiUrl}/${id_solicitud}/documentos`,
    );
  }

  cambiarEstado(
    id_solicitud: number,
    estado: string,
    observaciones?: string,
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_solicitud}/estado`, {
      estado,
      observaciones,
    });
  }

  reemplazarDocumento(id_documento: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('documento', archivo);
    return this.http.put<any>(
      `${this.apiUrl}/documentos/${id_documento}`,
      formData,
    );
  }
  // En exhumacion.service.ts — igual
  getPendientesCount(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/pendientes/count`);
  }
}
