import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SolicitudInhumacion, DocumentoInhumacion } from '../models/inhumacion.model';

@Injectable({
  providedIn: 'root'
})
export class InhumacionService {
  private apiUrl = environment.apiUrl + '/inhumaciones'; // Usamos la URL del entorno
  constructor(private http: HttpClient) { }

  /**
   * Usuario envía solicitud con los 7 PDFs.
   * Usa FormData para enviar archivos.
   */
  crearSolicitud(archivos: File[]): Observable<any> {
    const formData = new FormData();
    archivos.forEach(archivo => formData.append('documentos', archivo));
    return this.http.post<any>(this.apiUrl, formData);
  }

  /**
   * Lista solicitudes — admin ve todas, usuario ve las suyas.
   */
  getSolicitudes(): Observable<SolicitudInhumacion[]> {
    return this.http.get<SolicitudInhumacion[]>(this.apiUrl);
  }

  /**
   * Obtiene los documentos de una solicitud.
   */
  getDocumentos(id_solicitud: number): Observable<DocumentoInhumacion[]> {
    return this.http.get<DocumentoInhumacion[]>(`${this.apiUrl}/${id_solicitud}/documentos`);
  }

  /**
   * Admin cambia el estado de una solicitud.
   */
  cambiarEstado(id_solicitud: number, estado: string, observaciones?: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_solicitud}/estado`, { estado, observaciones });
  }

  /**
   * Obtiene la solicitud activa para el usuario autenticado para que vea su estado.
   */
  getSolicitudActiva(): Observable<SolicitudInhumacion | null> {
    return this.http.get<SolicitudInhumacion | null>(`${this.apiUrl}/activa`);
  }

  /**
   * Reemplaza un documento de una solicitud en caso de haber mandando erroneamente el archivo.
   */
  reemplazarDocumento(id_documento: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('documento', archivo);
    return this.http.put<any>(`${this.apiUrl}/documentos/${id_documento}`, formData);
  }
}