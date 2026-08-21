import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-bloque-publico',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './bloque-publico.component.html',
  styleUrl: './bloque-publico.component.css',
})
export class BloquePublicoComponent implements OnInit {
  cargando = true;
  error = false;
  datos: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug'];
    const codigo = this.route.snapshot.params['codigo'];

    // Realizar la solicitud HTTP para obtener los datos del bloque de una vez aqui para no crear servicio para consulta publica
    this.http
      .get(`${environment.apiUrl}/publico/bloque/${slug}/${codigo}`)
      .subscribe({
        next: (data) => {
          this.datos = data;
          this.cargando = false;
        },
        error: () => {
          this.error = true;
          this.cargando = false;
        },
      });
  }

  get espaciosOcupados(): number {
    return (
      this.datos?.fallecidos?.filter((f: any) => f.nombre_completo).length ?? 0
    );
  }

  get espaciosLibres(): number {
    return (
      this.datos?.fallecidos?.filter((f: any) => !f.nombre_completo).length ?? 0
    );
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }
}
