import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sector } from '../models/sector.model';
import { environment } from '../../../../environments/environment';

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
