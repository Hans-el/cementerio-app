import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cementerio } from '../models/cementerio.model';

@Injectable({
  providedIn: 'root'
})
export class CementerioService {
  private apiUrl = environment.apiUrl + '/cementerios';

  // Cementerio activo en memoria — accesible desde cualquier componente
  private cementerioActivo$ = new BehaviorSubject<Cementerio | null>(
    this.cargarDesdeStorage()
  );

  constructor(private http: HttpClient) { }

  // Obtiene todos los cementerios activos (endpoint público)
  getCementerios(): Observable<Cementerio[]> {
    return this.http.get<Cementerio[]>(this.apiUrl);
  }

  // Obtiene un cementerio por slug (endpoint público)
  getCementerioPorSlug(slug: string): Observable<Cementerio> {
    return this.http.get<Cementerio>(`${this.apiUrl}/${slug}`);
  }

  // Guarda el cementerio seleccionado en localStorage y en el BehaviorSubject
  seleccionar(cementerio: Cementerio): void {
    localStorage.setItem('cementerio', JSON.stringify(cementerio));
    this.cementerioActivo$.next(cementerio);
    this.aplicarTema(cementerio);
  }

  // Retorna el cementerio activo como observable
  getCementerioActivo(): Observable<Cementerio | null> {
    return this.cementerioActivo$.asObservable();
  }

  // Retorna el cementerio activo de forma síncrona
  getCementerioActivoSnapshot(): Cementerio | null {
    return this.cementerioActivo$.getValue();
  }

  // Retorna el slug del cementerio activo
  getSlugActivo(): string | null {
    return this.cementerioActivo$.getValue()?.slug ?? null;
  }

  // Limpia el cementerio seleccionado al cerrar sesión
  limpiar(): void {
    localStorage.removeItem('cementerio');
    this.cementerioActivo$.next(null);
  }

  // Aplica el color primario del cementerio como variable CSS global
  aplicarTema(cementerio: Cementerio): void {
    document.documentElement.style.setProperty(
      '--color-cementerio',
      cementerio.color_primario
    );
  }

  private cargarDesdeStorage(): Cementerio | null {
    try {
      const data = localStorage.getItem('cementerio');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}