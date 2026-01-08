import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BloquesService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/api/bloques';

  getBloques() {
    return this.http.get<any[]>(this.apiUrl);
  }

  //para obtener los bloques por id de manzana, ya que cada id de manzana tiene un sector asociadado, no es necesario pasar el id del sector
  getBloquesByManzanaId(idManzana: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/manzana/${idManzana}`);
  }
  //nueva funcion para obtener el resumen de estados de los bloques, para los cards de resumen en inicio.component.html
  getResumenEstadosBloques(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resumen-estados`);
  }


}
