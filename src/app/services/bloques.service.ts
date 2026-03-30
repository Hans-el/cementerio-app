import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BloquesService {
  private apiUrl = environment.apiUrl + '/bloques'; // Usamos la URL del entorno

  constructor(private http: HttpClient) {}

  // Obtener todos los bloques
  getBloques(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  //este lo uso para el modal de añadir difunto
  getBloquesid(idManzana?: number): Observable<any[]> {
    const params: any = {};
    if (idManzana) {
      params.id_manzana = idManzana;
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // Obtener bloques por ID de manzana
  getBloquesByManzanaId(idManzana: number): Observable<any[]> {
    const params = new HttpParams().set('id_manzana', idManzana.toString());
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // este es para los contadores de los badges y obtener el resumen de estados de todos los tipos de bloques
  // bloqueController -> getResumenEstadosBloques
  getResumenBloques(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resumen-estados`);
  }
  // Crear nuevo bloque
  createBloque(data: {
    id_manzana: number;
    numero_bloque: number;
    cantidad_espacios: number;
    id_tipo_espacio: number;
    observaciones?: string;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
  // Actualizar bloque para añadir mas espacios por si algun dia se quiere ampliar
  anadirEspacios(idBloque: number, espacios: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idBloque}/espacios`, espacios);
  }

  //esta parte es para los bloques en venta
  ponerEnVenta(bloqueData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/poner-en-venta`, bloqueData);
  }

  getBloquesEnVenta(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bloques-en-venta`);
  }
  borrarBloqueEnVenta(id_bloque_venta: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/bloques-en-venta/${id_bloque_venta}`,
    );
  }
  subirImagenBloque(
    sector: string,
    manzana: string,
    bloque: string,
    archivo: File,
  ): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    return this.http.post<any>(
      `${this.apiUrl}/imagen/${sector}/${manzana}/${bloque}`,
      formData,
    );
  }
}
