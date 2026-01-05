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
    // Aquí iría la lógica para obtener los bloques desde la API
  }
  //para obtener los bloques filtrados por manzana, 
  getBloquesByManzana(idManzana: number) {
    return this.http.get<any[]>(`${this.apiUrl}/manzana/${idManzana}`);
  }
  //para obtener los bloques filtrados por manzana y sector, como en el componente inicio.component.ts
  getBloquesByManzanaAndSector(idManzana: number, idSector: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/manzana/${idManzana}/sector/${idSector}`);
  }
  //nueva funcion para obtener el resumen de estados de los bloques, para los cards de resumen en inicio.component.html
  getResumenEstadosBloques(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resumen-estados`);
  }


}
