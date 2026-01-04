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

  getBloquesByManzana(idManzana: number) {
    return this.http.get<any[]>(`${this.apiUrl}/manzana/${idManzana}`);
  }

}
