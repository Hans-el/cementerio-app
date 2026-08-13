import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoTramite, DocumentoTipo, Solicitud, DocumentoSolicitud } from '../models/tramite.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TramiteService {
  private apiUrl = environment.apiUrl + '/tramites';

  constructor(private http: HttpClient) { }
  // Tipos
  getTipos(): Observable<TipoTramite[]> {
    return this.http.get<TipoTramite[]>(`${this.apiUrl}/tipos`);
  }

  getDocumentosTipo(id_tipo: number): Observable<DocumentoTipo[]> {
    return this.http.get<DocumentoTipo[]>(`${this.apiUrl}/tipos/${id_tipo}/documentos`);
  }

  // Solicitudes
  crearSolicitud(id_tipo_tramite: number, archivos: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('id_tipo_tramite', String(id_tipo_tramite));
    archivos.forEach(archivo => formData.append('documentos', archivo));
    return this.http.post<any>(this.apiUrl, formData);
  }

  getSolicitudes(id_tipo_tramite?: number): Observable<Solicitud[]> {
    let params = new HttpParams();
    if (id_tipo_tramite) params = params.set('id_tipo_tramite', id_tipo_tramite);
    return this.http.get<Solicitud[]>(this.apiUrl, { params });
  }

  getSolicitudActiva(id_tipo: number): Observable<Solicitud | null> {
    return this.http.get<Solicitud | null>(`${this.apiUrl}/activa/${id_tipo}`);
  }

  getDocumentos(id_solicitud: number): Observable<DocumentoSolicitud[]> {
    return this.http.get<DocumentoSolicitud[]>(`${this.apiUrl}/${id_solicitud}/documentos`);
  }
  getHistorial(id_tipo: number): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/historial/${id_tipo}`);
  }

  cambiarEstado(id_solicitud: number, estado: string, observaciones?: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_solicitud}/estado`, { estado, observaciones });
  }

  subirDocumentoRespuesta(id_solicitud: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('documento', archivo);
    return this.http.post<any>(`${this.apiUrl}/${id_solicitud}/documento-respuesta`, formData);
  }
  getMisSolicitudes(estado?: string, id_tipo_tramite?: number): Observable<Solicitud[]> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    if (id_tipo_tramite) params = params.set('id_tipo_tramite', id_tipo_tramite.toString());
    return this.http.get<Solicitud[]>(`${this.apiUrl}/mis-solicitudes`, { params });
  }

  getUrlRespuesta(id_solicitud: number): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/${id_solicitud}/respuesta-url`);
  }

  reemplazarDocumento(id_documento: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('documento', archivo);
    return this.http.put<any>(`${this.apiUrl}/documentos/${id_documento}`, formData);
  }

  getPendientesCount(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/pendientes/count`);
  }

  getPendientesCountByTipo(): Observable<{ id_tipo_tramite: number, pendientes: number }[]> {
    return this.http.get<{ id_tipo_tramite: number, pendientes: number }[]>(`${this.apiUrl}/pendientes/count-by-tipo`);
  }

}
