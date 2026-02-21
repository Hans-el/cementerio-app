import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface MensajeContacto {
  //Esta interfaz también está creada en model/contacto
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
  private apiUrl = environment.apiUrl + '/contacto'; //la url del backend

  constructor(private http: HttpClient) {}

  enviarMensaje(data: MensajeContacto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
