import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TramiteService } from '../../../../features/tramites/services/tramite.service';
import {
  TipoTramite,
  Solicitud,
  DocumentoSolicitud,
} from '../../../tramites/models/tramite.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './admin-solicitudes.component.html',
  styleUrl: './admin-solicitudes.component.css',
})
export class AdminSolicitudesComponent implements OnInit {
  // Tipos de trámite disponibles
  tipos: TipoTramite[] = [];
  tipoActivo: TipoTramite | null = null;

  // Solicitudes
  solicitudes: Solicitud[] = [];
  documentosSolicitudActual: DocumentoSolicitud[] = [];
  solicitudSeleccionada: Solicitud | null = null;

  // Conteo de pendientes por tipo
  pendientesPorTipo: Map<number, number> = new Map();

  // Flags
  loading = false;
  loadingDocumentos = false;
  subiendoRespuesta = false;

  // Filtros
  filtroEstado = 'TODOS';
  filtroFechaInicio = '';
  filtroFechaFin = '';

  constructor(private tramiteService: TramiteService) {}

  ngOnInit(): void {
    this.cargarTipos();
    this.cargarPendientesPorTipo();
  }

  // ── Tipos

  cargarTipos(): void {
    this.tramiteService.getTipos().subscribe({
      next: (tipos) => {
        this.tipos = tipos;
        this.tipoActivo = tipos[0] ?? null;
        if (this.tipoActivo) this.cargarSolicitudes();
      },
      error: () =>
        Swal.fire(
          'Error',
          'No se pudieron cargar los tipos de trámite.',
          'error',
        ),
    });
  }

  cambiarTipo(tipo: TipoTramite): void {
    if (this.tipoActivo?.id_tipo_tramite === tipo.id_tipo_tramite) return;
    this.tipoActivo = tipo;
    this.solicitudSeleccionada = null;
    this.documentosSolicitudActual = [];
    this.limpiarFiltros();
    this.cargarSolicitudes();
  }

  // ── Pendientes por tipo

  cargarPendientesPorTipo(): void {
    this.tramiteService.getPendientesCountByTipo().subscribe({
      next: (data) => {
        this.pendientesPorTipo.clear();
        data.forEach((item) => {
          this.pendientesPorTipo.set(item.id_tipo_tramite, item.pendientes);
        });
      },
      error: () => {},
    });
  }

  getPendientes(id_tipo: number): number {
    return this.pendientesPorTipo.get(id_tipo) || 0;
  }

  // ── Solicitudes

  cargarSolicitudes(): void {
    if (!this.tipoActivo) return;
    this.loading = true;
    this.solicitudes = [];

    this.tramiteService
      .getSolicitudes(this.tipoActivo.id_tipo_tramite)
      .subscribe({
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

  // ── Detalle

  verDocumentos(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
    this.loadingDocumentos = true;
    this.documentosSolicitudActual = [];

    this.tramiteService.getDocumentos(solicitud.id_solicitud).subscribe({
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

  // ── Aprobar / Rechazar

  aprobar(solicitud: Solicitud): void {
    const esPago = !this.tipoActivo?.es_gratuito;
    Swal.fire({
      title: '¿Aprobar solicitud?',
      html: esPago
        ? `Confirmas que <strong>${solicitud.nombre_usuario}</strong> realizó el pago de <strong>$${this.tipoActivo?.costo}</strong>.`
        : `¿Confirmas la aprobación de la solicitud de <strong>${solicitud.nombre_usuario}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.tramiteService
        .cambiarEstado(solicitud.id_solicitud, 'APROBADA')
        .subscribe({
          next: () => {
            Swal.fire(
              'Aprobada',
              'La solicitud fue aprobada correctamente.',
              'success',
            );
            this.cargarSolicitudes();
            this.cargarPendientesPorTipo();
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
      inputValidator: (v) => (!v ? 'Debes ingresar un motivo.' : null),
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.tramiteService
        .cambiarEstado(solicitud.id_solicitud, 'RECHAZADA', result.value)
        .subscribe({
          next: () => {
            Swal.fire('Rechazada', 'La solicitud fue rechazada.', 'info');
            this.cargarSolicitudes();
            this.cargarPendientesPorTipo();
            this.solicitudSeleccionada = null;
          },
          error: () =>
            Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error'),
        });
    });
  }

  // ── Documento de respuesta

  onSubirRespuesta(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0] || !this.solicitudSeleccionada) return;
    const archivo = input.files[0];

    if (archivo.type !== 'application/pdf') {
      Swal.fire(
        'Formato inválido',
        'Solo se permiten archivos PDF.',
        'warning',
      );
      input.value = '';
      return;
    }

    Swal.fire({
      title: '¿Subir documento de respuesta?',
      text: 'Este documento será visible para el usuario como validación del trámite.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, subir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then((result) => {
      if (!result.isConfirmed) {
        input.value = '';
        return;
      }

      this.subiendoRespuesta = true;
      this.tramiteService
        .subirDocumentoRespuesta(
          this.solicitudSeleccionada!.id_solicitud,
          archivo,
        )
        .subscribe({
          next: () => {
            this.subiendoRespuesta = false;
            input.value = '';
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Documento de respuesta subido.',
              timer: 2500,
              showConfirmButton: false,
            });
            this.cargarSolicitudes();
          },
          error: () => {
            this.subiendoRespuesta = false;
            input.value = '';
            Swal.fire('Error', 'No se pudo subir el documento.', 'error');
          },
        });
    });
  }

  // ── Helpers

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
