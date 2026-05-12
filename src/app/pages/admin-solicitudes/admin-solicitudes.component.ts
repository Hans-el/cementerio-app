import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DocumentoInhumacion, SolicitudInhumacion } from '../../models/inhumacion.model';
import { InhumacionService } from '../../services/inhumacion.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-solicitudes.component.html',
  styleUrl: './admin-solicitudes.component.css'
})
export class AdminSolicitudesComponent {
  solicitudes: SolicitudInhumacion[] = [];
  documentosSolicitudActual: DocumentoInhumacion[] = [];
  solicitudSeleccionada: SolicitudInhumacion | null = null;
  loading = false;
  loadingDocumentos = false;
  filtroEstado: string = 'TODOS';
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';
  readonly apiBase = new URL(environment.apiUrl).origin;

  constructor(private inhumacionService: InhumacionService) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.loading = true;
    this.inhumacionService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar las solicitudes.', 'error');
      },
    });
  }

  get solicitudesFiltradas(): SolicitudInhumacion[] {
    return this.solicitudes.filter(s => {

      // Filtro por estado
      if (this.filtroEstado !== 'TODOS' && s.estado !== this.filtroEstado) return false;

      // Filtro por fecha inicio
      if (this.filtroFechaInicio) {
        const fechaSolicitud = new Date(s.fecha_solicitud);
        const inicio = new Date(this.filtroFechaInicio);
        inicio.setHours(0, 0, 0, 0);
        if (fechaSolicitud < inicio) return false;
      }

      // Filtro por fecha fin
      if (this.filtroFechaFin) {
        const fechaSolicitud = new Date(s.fecha_solicitud);
        const fin = new Date(this.filtroFechaFin);
        fin.setHours(23, 59, 59, 999);
        if (fechaSolicitud > fin) return false;
      }

      return true;
    });
  }
  limpiarFiltros(): void {
    this.filtroEstado = 'TODOS';
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
  }
  verDocumentos(solicitud: SolicitudInhumacion): void {
    this.solicitudSeleccionada = solicitud;
    this.loadingDocumentos = true;
    this.documentosSolicitudActual = [];

    this.inhumacionService.getDocumentos(solicitud.id_solicitud).subscribe({
      next: (docs) => {
        this.documentosSolicitudActual = docs;
        this.loadingDocumentos = false;
      },
      error: () => {
        this.loadingDocumentos = false;
        Swal.fire('Error', 'No se pudieron cargar los documentos.', 'error');
      },
    });
  }

  urlDocumento(ruta: string): string {
    return `${this.apiBase}${ruta}`;
  }

  aprobar(solicitud: SolicitudInhumacion): void {
    Swal.fire({
      title: '¿Aprobar solicitud?',
      html: `Confirmas que <strong>${solicitud.nombre_usuario}</strong> realizó el pago de <strong>$10.90</strong>.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then(result => {
      if (result.isConfirmed) {
        this.inhumacionService.cambiarEstado(solicitud.id_solicitud, 'APROBADA').subscribe({
          next: () => {
            Swal.fire('Aprobada', 'La solicitud fue aprobada correctamente.', 'success');
            this.cargarSolicitudes();
            this.solicitudSeleccionada = null;
          },
          error: () => Swal.fire('Error', 'No se pudo aprobar la solicitud.', 'error'),
        });
      }
    });
  }

  rechazar(solicitud: SolicitudInhumacion): void {
    Swal.fire({
      title: 'Rechazar solicitud',
      input: 'textarea',
      inputLabel: 'Motivo del rechazo',
      inputPlaceholder: 'Escribe el motivo...',
      inputAttributes: { 'aria-label': 'Motivo del rechazo' },
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      inputValidator: (value) => {
        if (!value) return 'Debes ingresar un motivo de rechazo.';
        return null;
      },
    }).then(result => {
      if (result.isConfirmed) {
        this.inhumacionService.cambiarEstado(solicitud.id_solicitud, 'RECHAZADA', result.value).subscribe({
          next: () => {
            Swal.fire('Rechazada', 'La solicitud fue rechazada.', 'info');
            this.cargarSolicitudes();
            this.solicitudSeleccionada = null;
          },
          error: () => Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error'),
        });
      }
    });
  }

  badgeClass(estado: string): string {
    switch (estado) {
      case 'APROBADA': return 'bg-success bg-opacity-10 text-success';
      case 'RECHAZADA': return 'bg-danger bg-opacity-10 text-danger';
      default: return 'bg-warning bg-opacity-10 text-warning';
    }
  }
}
