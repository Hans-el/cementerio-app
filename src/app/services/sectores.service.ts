import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sector } from '../models/sector.model'; // Importa el modelo Sector con la nueva estructura


@Injectable({
  providedIn: 'root'
})
export class SectoresService {

  private apiUrl = 'http://localhost:3000/api/sectores';

  constructor(private http: HttpClient) { }

  obtenerSectores(): Observable<Sector[]> {
    return this.http.get<Sector[]>(this.apiUrl);
  }
}
