//Este es el SERVICIO BASE que maneja las solicitudes HTTP a la API backend

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/'; 

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

  get(endpoint: string, token?: string) {
    return this.http.get(`${this.apiUrl}/${endpoint}`, { headers: this.getHeaders(token) });
  }

  post(endpoint: string, data: any, token?: string) {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data, { headers: this.getHeaders(token) });
  }

  put(endpoint: string, data: any, token?: string) {
    return this.http.put(`${this.apiUrl}/${endpoint}`, data, { headers: this.getHeaders(token) });
  }

  delete(endpoint: string, token?: string) {
    return this.http.delete(`${this.apiUrl}/${endpoint}`, { headers: this.getHeaders(token) });
  }

  
}
