import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sector } from '../models/sector.model'; // Importa el modelo Sector con la nueva estructura
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SectoresService {
  private apiUrl = environment.apiUrl + '/sectores'; // Usamos la URL del entorno

  constructor(private http: HttpClient) {}

  getSectores(): Observable<Sector[]> {
    return this.http.get<Sector[]>(this.apiUrl);
  }
}
