import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InhumacionService } from '../../services/inhumacion.service';
import { ExhumacionService } from '../../services/exhumacion.service';
import {
  DocumentoInhumacion,
  SolicitudInhumacion,
} from '../../models/inhumacion.model';
import {
  DocumentoExhumacion,
  SolicitudExhumacion,
} from '../../models/exhumacion.model';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

type TipoSolicitud = 'inhumacion' | 'exhumacion';
type Solicitud = SolicitudInhumacion | SolicitudExhumacion;

@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './admin-solicitudes.component.html',
  styleUrl: './admin-solicitudes.component.css',
})
export class AdminSolicitudesComponent implements OnInit {
  tipoActivo: TipoSolicitud = 'inhumacion';
  solicitudes: Solicitud[] = [];
  documentosSolicitudActual: any[] = [];
  solicitudSeleccionada: Solicitud | null = null;

  loading = false;
  loadingDocumentos = false;
  filtroEstado = 'TODOS';
  filtroFechaInicio = '';
  filtroFechaFin = '';

  readonly apiBase = new URL(environment.apiUrl).origin;
  readonly PRECIO_INHUMACION = 10.9;
  readonly PRECIO_EXHUMACION = 27.03;

  constructor(
    private inhumacionService: InhumacionService,
    private exhumacionService: ExhumacionService,
  ) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  // Cambia entre inhumaciones y exhumaciones
  cambiarTipo(tipo: TipoSolicitud): void {
    if (this.tipoActivo === tipo) return;
    this.tipoActivo = tipo;
    this.solicitudSeleccionada = null;
    this.documentosSolicitudActual = [];
    this.limpiarFiltros();
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.loading = true;
    this.solicitudes = [];

    const obs$ =
      this.tipoActivo === 'inhumacion'
        ? this.inhumacionService.getSolicitudes()
        : this.exhumacionService.getSolicitudes();

    obs$.subscribe({
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

  get solicitudesFiltradas(): Solicitud[] {
    return this.solicitudes.filter((s) => {
      if (this.filtroEstado !== 'TODOS' && s.estado !== this.filtroEstado)
        return false;
      if (this.filtroFechaInicio) {
        const inicio = new Date(this.filtroFechaInicio);
        inicio.setHours(0, 0, 0, 0);
        if (new Date(s.fecha_solicitud) < inicio) return false;
      }
      if (this.filtroFechaFin) {
        const fin = new Date(this.filtroFechaFin);
        fin.setHours(23, 59, 59, 999);
        if (new Date(s.fecha_solicitud) > fin) return false;
      }
      return true;
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = 'TODOS';
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
  }

  verDocumentos(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
    this.loadingDocumentos = true;
    this.documentosSolicitudActual = [];

    const obs$ =
      this.tipoActivo === 'inhumacion'
        ? this.inhumacionService.getDocumentos(solicitud.id_solicitud)
        : this.exhumacionService.getDocumentos(solicitud.id_solicitud);

    obs$.subscribe({
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

  get precioActual(): number {
    return this.tipoActivo === 'inhumacion'
      ? this.PRECIO_INHUMACION
      : this.PRECIO_EXHUMACION;
  }

  aprobar(solicitud: Solicitud): void {
    Swal.fire({
      title: '¿Aprobar solicitud?',
      html: `Confirmas que <strong>${solicitud.nombre_usuario}</strong> realizó el pago de <strong>$${this.precioActual}</strong>.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then((result) => {
      if (!result.isConfirmed) return;

      const obs$ =
        this.tipoActivo === 'inhumacion'
          ? this.inhumacionService.cambiarEstado(
            solicitud.id_solicitud,
            'APROBADA',
          )
          : this.exhumacionService.cambiarEstado(
            solicitud.id_solicitud,
            'APROBADA',
          );

      obs$.subscribe({
        next: () => {
          Swal.fire(
            'Aprobada',
            'La solicitud fue aprobada correctamente.',
            'success',
          );
          this.cargarSolicitudes();
          this.solicitudSeleccionada = null;
        },
        error: () =>
          Swal.fire('Error', 'No se pudo aprobar la solicitud.', 'error'),
      });
    });
  }

  rechazar(solicitud: Solicitud): void {
    Swal.fire({
      title: 'Rechazar solicitud',
      input: 'textarea',
      inputLabel: 'Motivo del rechazo',
      inputPlaceholder: 'Escribe el motivo...',
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      inputValidator: (value) => (!value ? 'Debes ingresar un motivo.' : null),
    }).then((result) => {
      if (!result.isConfirmed) return;

      const obs$ =
        this.tipoActivo === 'inhumacion'
          ? this.inhumacionService.cambiarEstado(
            solicitud.id_solicitud,
            'RECHAZADA',
            result.value,
          )
          : this.exhumacionService.cambiarEstado(
            solicitud.id_solicitud,
            'RECHAZADA',
            result.value,
          );

      obs$.subscribe({
        next: () => {
          Swal.fire('Rechazada', 'La solicitud fue rechazada.', 'info');
          this.cargarSolicitudes();
          this.solicitudSeleccionada = null;
        },
        error: () =>
          Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error'),
      });
    });
  }

  badgeClass(estado: string): string {
    switch (estado) {
      case 'APROBADA':
        return 'bg-success bg-opacity-10 text-success';
      case 'RECHAZADA':
        return 'bg-danger bg-opacity-10 text-danger';
      default:
        return 'bg-warning bg-opacity-10 text-warning';
    }
  }
}
