import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BloquesService {
  private apiUrl = 'http://localhost:3000/api/bloques';

  constructor(private http: HttpClient) { }

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

  // Obtener resumen de estados de los bloques para la pagina de inicio
  getResumenEstadosBloques(): Observable<any[]> {
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


}
