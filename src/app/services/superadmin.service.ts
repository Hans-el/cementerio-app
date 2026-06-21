import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {
  private apiUrl = environment.apiUrl + '/superadmin';

  constructor(private http: HttpClient) { }

  // Cementerios
  getCementerios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cementerios`);
  }
  crearCementerio(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cementerios`, data);
  }
  editarCementerio(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cementerios/${id}`, data);
  }
  toggleActivoCementerio(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/cementerios/${id}/toggle`, {});
  }

  // Admins
  getAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admins`);
  }
  crearAdmin(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admins`, data);
  }
  editarAdmin(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admins/${id}`, data);
  }
  eliminarAdmin(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admins/${id}`);
  }
  resetContrasena(id: number, contrasenaNueva: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admins/${id}/reset-pass`, { contrasenaNueva });
  }
}