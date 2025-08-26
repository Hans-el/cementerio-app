import { Injectable } from '@angular/core';
import { Nicho } from '../models/nicho/nicho.module';
import { of, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NichosService {
 private apiUrl = 'http://localhost:3000/api/nichos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getNichos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.authService.getHeaders() });
  }

  getNichosDisponibles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/disponibles`, { headers: this.authService.getHeaders() });
  }

  createNicho(nichoData: any): Observable<any> {
    return this.http.post(this.apiUrl, nichoData, { headers: this.authService.getHeaders() });
  }

  // Por ahora usamos datos simulados. 
  private sectores: { [key: string]: Nicho[] } = {
    A: [
      { id: 'A1', cedulaPropietario: '12345678', nombrePropietario: 'Juan Pérez', sector: 'A', numero: '1', estado: 'disponible' },
      { id: 'A2', cedulaPropietario: '87654321', nombrePropietario: 'María López', sector: 'A', numero: '2', estado: 'ocupado' },
      { id: 'A3', cedulaPropietario: '11223344', nombrePropietario: 'Carlos Ramírez', sector: 'A', numero: '3', estado: 'reservado' },
      { id: 'A4', cedulaPropietario: '44332211', nombrePropietario: 'Ana Gómez', sector: 'A', numero: '4', estado: 'reservado' },
      { id: 'A5', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '5', estado: 'disponible' },
      { id: 'A6', cedulaPropietario: '55667788', nombrePropietario: 'Luis Martínez', sector: 'A', numero: '6', estado: 'ocupado' },
      { id: 'A7', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '7', estado: 'disponible' },
      { id: 'A8', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '8', estado: 'reservado' },
      { id: 'A9', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '9', estado: 'reservado' },
      { id: 'A10', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '10', estado: 'disponible' },
      { id: 'A11', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '11', estado: 'ocupado' },
      { id: 'A12', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '12', estado: 'disponible' },
      { id: 'A13', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '13', estado: 'reservado' },
      { id: 'A14', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '14', estado: 'reservado' },
      { id: 'A15', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '15', estado: 'disponible' },
      { id: 'A16', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '16', estado: 'ocupado' },
      { id: 'A17', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '17', estado: 'disponible' },
      { id: 'A18', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '18', estado: 'reservado' },
      { id: 'A19', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '19', estado: 'reservado' },
      { id: 'A20', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '20', estado: 'disponible' },
      { id: 'A21', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '21', estado: 'ocupado' },
      { id: 'A22', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '22', estado: 'disponible' },
      { id: 'A23', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '23', estado: 'reservado' },
      { id: 'A24', cedulaPropietario: '', nombrePropietario: '', sector: 'A', numero: '24', estado: 'reservado' }
    ],
    B: [
      { id: 'B1', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '1', estado: 'disponible' },
      { id: 'B2', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '2', estado: 'ocupado' },
      { id: 'B3', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '3', estado: 'reservado' },
      { id: 'B4', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '4', estado: 'reservado' },
      { id: 'B5', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '5', estado: 'disponible' },
      { id: 'B6', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '6', estado: 'ocupado' },
      { id: 'B7', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '7', estado: 'disponible' },
      { id: 'B8', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '8', estado: 'reservado' },
      { id: 'B9', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '9', estado: 'reservado' },
      { id: 'B10', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '10', estado: 'disponible' },
      { id: 'B11', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '11', estado: 'ocupado' },
      { id: 'B12', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '12', estado: 'disponible' },
      { id: 'B13', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '13', estado: 'reservado' },
      { id: 'B14', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '14', estado: 'reservado' },
      { id: 'B15', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '15', estado: 'disponible' },
      { id: 'B16', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '16', estado: 'ocupado' },
      { id: 'B17', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '17', estado: 'disponible' },
      { id: 'B18', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '18', estado: 'reservado' },
      { id: 'B19', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '19', estado: 'reservado' },
      { id: 'B20', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '20', estado: 'disponible' },
      { id: 'B21', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '21', estado: 'ocupado' },
      { id: 'B22', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '22', estado: 'disponible' },
      { id: 'B23', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '23', estado: 'reservado' },
      { id: 'B24', cedulaPropietario: '1316623030', nombrePropietario: 'Hansel Alcívar', sector: 'B', numero: '24', estado: 'reservado' }
    ],
    C: [
      { id: 'B1', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '1', estado: 'disponible' },
      { id: 'B2', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '2', estado: 'ocupado' },
      { id: 'B3', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '3', estado: 'reservado' },
      { id: 'B4', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '4', estado: 'reservado' },
      { id: 'B5', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '5', estado: 'disponible' },
      { id: 'B6', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '6', estado: 'ocupado' },
      { id: 'B7', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '7', estado: 'disponible' },
      { id: 'B8', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '8', estado: 'reservado' },
      { id: 'B9', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '9', estado: 'reservado' },
      { id: 'B10', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '10', estado: 'disponible' },
      { id: 'B11', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '11', estado: 'ocupado' },
      { id: 'B12', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '12', estado: 'disponible' },
      { id: 'B13', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '13', estado: 'reservado' },
      { id: 'B14', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '14', estado: 'reservado' },
      { id: 'B15', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '15', estado: 'disponible' },
      { id: 'B16', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '16', estado: 'ocupado' },
      { id: 'B17', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '17', estado: 'disponible' },
      { id: 'B18', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '18', estado: 'reservado' },
      { id: 'B19', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '19', estado: 'reservado' },
      { id: 'B20', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '20', estado: 'disponible' },
      { id: 'B21', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '21', estado: 'ocupado' },
      { id: 'B22', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '22', estado: 'disponible' },
      { id: 'B23', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '23', estado: 'reservado' },
      { id: 'B24', cedulaPropietario: '1316623030', nombrePropietario: 'Hansel Alcívar', sector: 'C', numero: '24', estado: 'reservado' }
    ],
    D: [
      { id: 'B1', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '1', estado: 'disponible' },
      { id: 'B2', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '2', estado: 'ocupado' },
      { id: 'B3', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '3', estado: 'reservado' },
      { id: 'B4', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '4', estado: 'reservado' },
      { id: 'B5', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '5', estado: 'disponible' },
      { id: 'B6', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '6', estado: 'ocupado' },
      { id: 'B7', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '7', estado: 'disponible' },
      { id: 'B8', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '8', estado: 'reservado' },
      { id: 'B9', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '9', estado: 'reservado' },
      { id: 'B10', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '10', estado: 'disponible' },
      { id: 'B11', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '11', estado: 'ocupado' },
      { id: 'B12', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '12', estado: 'disponible' },
      { id: 'B13', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '13', estado: 'reservado' },
      { id: 'B14', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '14', estado: 'reservado' },
      { id: 'B15', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '15', estado: 'disponible' },
      { id: 'B16', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '16', estado: 'ocupado' },
      { id: 'B17', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '17', estado: 'disponible' },
      { id: 'B18', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '18', estado: 'reservado' },
      { id: 'B19', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '19', estado: 'reservado' },
      { id: 'B20', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '20', estado: 'disponible' },
      { id: 'B21', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '21', estado: 'ocupado' },
      { id: 'B22', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '22', estado: 'disponible' },
      { id: 'B23', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '23', estado: 'reservado' },
      { id: 'B24', cedulaPropietario: '1316623030', nombrePropietario: 'Hansel Alcívar', sector: 'D', numero: '24', estado: 'reservado' }
    ],
    E: [
      { id: 'B1', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '1', estado: 'disponible' },
      { id: 'B2', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '2', estado: 'ocupado' },
      { id: 'B3', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '3', estado: 'reservado' },
      { id: 'B4', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '4', estado: 'reservado' },
      { id: 'B5', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '5', estado: 'disponible' },
      { id: 'B6', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '6', estado: 'ocupado' },
      { id: 'B7', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '7', estado: 'disponible' },
      { id: 'B8', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '8', estado: 'reservado' },
      { id: 'B9', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '9', estado: 'reservado' },
      { id: 'B10', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '10', estado: 'disponible' },
      { id: 'B11', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '11', estado: 'ocupado' },
      { id: 'B12', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '12', estado: 'disponible' },
      { id: 'B13', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '13', estado: 'reservado' },
      { id: 'B14', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '14', estado: 'reservado' },
      { id: 'B15', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '15', estado: 'disponible' },
      { id: 'B16', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '16', estado: 'ocupado' },
      { id: 'B17', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '17', estado: 'disponible' },
      { id: 'B18', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '18', estado: 'reservado' },
      { id: 'B19', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '19', estado: 'reservado' },
      { id: 'B20', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '20', estado: 'disponible' },
      { id: 'B21', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '21', estado: 'ocupado' },
      { id: 'B22', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '22', estado: 'disponible' },
      { id: 'B23', cedulaPropietario: '', nombrePropietario: '', sector: 'B', numero: '23', estado: 'reservado' },
      { id: 'B24', cedulaPropietario: '1316623030', nombrePropietario: 'Hansel Alcívar', sector: 'E', numero: '24', estado: 'reservado' }
    ],
    F: [
      { id: 'F1', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '1', estado: 'disponible' },
      { id: 'F2', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '2', estado: 'ocupado' },
      { id: 'F3', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '3', estado: 'reservado' },
      { id: 'F4', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '4', estado: 'reservado' },
      { id: 'F5', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '5', estado: 'disponible' },
      { id: 'F6', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '6', estado: 'ocupado' },
      { id: 'F7', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '7', estado: 'disponible' },
      { id: 'F8', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '8', estado: 'reservado' },
      { id: 'F9', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '9', estado: 'reservado' },
      { id: 'F10', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '10', estado: 'disponible' },
      { id: 'F11', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '11', estado: 'ocupado' },
      { id: 'F12', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '12', estado: 'disponible' },
      { id: 'F13', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '13', estado: 'reservado' },
      { id: 'F14', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '14', estado: 'reservado' },
      { id: 'F15', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '15', estado: 'disponible' },
      { id: 'F16', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '16', estado: 'ocupado' },
      { id: 'F17', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '17', estado: 'disponible' },
      { id: 'F18', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '18', estado: 'reservado' },
      { id: 'F19', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '19', estado: 'reservado' },
      { id: 'F20', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '20', estado: 'disponible' },
      { id: 'F21', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '21', estado: 'ocupado' },
      { id: 'F22', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '22', estado: 'disponible' },
      { id: 'F23', cedulaPropietario: '', nombrePropietario: '', sector: 'F', numero: '23', estado: 'reservado' },
      { id: 'F24', cedulaPropietario: '1316623031', nombrePropietario: 'Testing 2', sector: 'B', numero: '24', estado: 'disponible' }
    ]
  };

  // Método para obtener todos los nichos por sector
  getSectores(): { [key: string]: Nicho[] } {
    return this.sectores;
  }

  // Método para obtener un nicho por su ID
  getNichoById(id: string): Nicho | undefined {
    for (const sector in this.sectores) {
      const nicho = this.sectores[sector].find(n => n.id === id);
      if (nicho) return nicho;
    }
    return undefined;
  }

  // Método para buscar nichos por cédula del propietario
  buscarPorCedula(cedula: string): Observable<Nicho[]> {
    const resultados = [];
    for (const sector in this.sectores) {
      const nichosEnSector = this.sectores[sector].filter(nicho => nicho.cedulaPropietario === cedula);
      resultados.push(...nichosEnSector);
    }
    return of(resultados);
  }
}
