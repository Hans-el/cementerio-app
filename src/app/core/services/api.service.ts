//Este es el SERVICIO BASE que maneja las solicitudes HTTP a la API backend
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHeaders(token?: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
  // Todos los servicios apuntan a este servicio base para hacer las solicitudes HTTP.
  // Es como el punto central para manejar las peticiones a la API backend.
  get(endpoint: string, token?: string) {
    return this.http.get(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders(token),
    });
  }

  post(endpoint: string, data: any, token?: string) {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders(token),
    });
  }

  put(endpoint: string, data: any, token?: string) {
    return this.http.put(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders(token),
    });
  }

  delete(endpoint: string, token?: string) {
    return this.http.delete(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders(token),
    });
  }
}
