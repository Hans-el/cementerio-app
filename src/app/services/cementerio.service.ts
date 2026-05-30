import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cementerio } from '../models/cementerio.model';

@Injectable({
  providedIn: 'root'
})
export class CementerioService {
  private apiUrl = environment.apiUrl + '/cementerios';


  constructor(private http: HttpClient) { }
  getCementerios(): Observable<Cementerio[]> {
    return this.http.get<Cementerio[]>(this.apiUrl);
  }

  /**
   * Guarda el slug del cementerio seleccionado en localStorage.
   * Se usa en el login y registro para saber a qué cementerio pertenece.
   */
  guardarSlug(slug: string): void {
    localStorage.setItem('cementerio_slug', slug);
  }

  obtenerSlug(): string | null {
    return localStorage.getItem('cementerio_slug');
  }

  limpiarSlug(): void {
    localStorage.removeItem('cementerio_slug');
  }
}
