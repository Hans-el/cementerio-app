import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FallecidoService {
  private apiUrl = 'http://localhost:3000/api/fallecidos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getFallecidos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.authService.getHeaders() });
  }

  createFallecido(fallecidoData: any): Observable<any> {
    return this.http.post(this.apiUrl, fallecidoData, { headers: this.authService.getHeaders() });
  }
}