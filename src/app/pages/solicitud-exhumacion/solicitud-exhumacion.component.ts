import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExhumacionService } from '../../services/exhumacion.service';
import {
  SolicitudExhumacion,
  DocumentoExhumacion,
} from '../../models/exhumacion.model';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

const DOCUMENTOS_REQUERIDOS = [
  'Documento 1',
  'Documento 2',
  'Documento 3',
  'Documento 4',
];

@Component({
  selector: 'app-solicitud-exhumacion',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './solicitud-exhumacion.component.html',
  styleUrl: './solicitud-exhumacion.component.css',
})
export class SolicitudExhumacionComponent implements OnInit {
  documentosRequeridos = DOCUMENTOS_REQUERIDOS;
  archivos: (File | null)[] = new Array(DOCUMENTOS_REQUERIDOS.length).fill(
    null,
  );
  solicitudActiva: SolicitudExhumacion | null = null;
  documentosActivos: DocumentoExhumacion[] = [];

  cargando = false;
  enviando = false;
  modoNuevaSolicitud = false;

  readonly PRECIO = 27.03;
  readonly apiBase = new URL(environment.apiUrl).origin;

  constructor(private exhumacionService: ExhumacionService) { }

  ngOnInit(): void {
    this.verificarSolicitudActiva();
  }

  verificarSolicitudActiva(): void {
    this.cargando = true;
    this.exhumacionService.getSolicitudActiva().subscribe({
      next: (solicitud) => {
        this.solicitudActiva = solicitud;
        if (solicitud) {
          this.cargarDocumentosActivos(solicitud.id_solicitud);
        } else {
          this.cargando = false;
        }
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  cargarDocumentosActivos(id_solicitud: number): void {
    this.exhumacionService.getDocumentos(id_solicitud).subscribe({
      next: (docs) => {
        this.documentosActivos = docs;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  onArchivoSeleccionado(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
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
    if (archivo.size > 10 * 1024 * 1024) {
      Swal.fire(
        'Archivo muy grande',
        'El archivo no puede superar los 10MB.',
        'warning',
      );
      input.value = '';
      return;
    }
    this.archivos[index] = archivo;
  }

  eliminarArchivo(index: number): void {
    this.archivos[index] = null;
    const input = document.getElementById(`doc-${index}`) as HTMLInputElement;
    if (input) input.value = '';
  }

  get todosSubidos(): boolean {
    return this.archivos.every((a) => a !== null);
  }
  get totalSubidos(): number {
    return this.archivos.filter((a) => a !== null).length;
  }
  get puedeEnviarNueva(): boolean {
    return (
      this.solicitudActiva?.estado === 'RECHAZADA' ||
      this.solicitudActiva?.estado === 'APROBADA'
    );
  }

  iniciarNuevaSolicitud(): void {
    Swal.fire({
      title: '¿Iniciar nueva solicitud?',
      html:
        this.solicitudActiva?.estado === 'RECHAZADA'
          ? 'Tu solicitud anterior fue rechazada. Puedes enviar una nueva con los documentos corregidos.'
          : '¿Deseas iniciar una nueva solicitud de exhumación?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, nueva solicitud',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then((result) => {
      if (result.isConfirmed) {
        this.modoNuevaSolicitud = true;
        this.archivos = new Array(this.documentosRequeridos.length).fill(null);
      }
    });
  }

  cancelarNuevaSolicitud(): void {
    this.modoNuevaSolicitud = false;
    this.archivos = new Array(this.documentosRequeridos.length).fill(null);
  }

  enviarSolicitud(): void {
    if (!this.todosSubidos) {
      Swal.fire(
        'Documentos incompletos',
        'Debes subir todos los documentos requeridos.',
        'warning',
      );
      return;
    }
    Swal.fire({
      title: '¿Enviar solicitud?',
      html: `Se enviará tu solicitud con <strong>${this.totalSubidos} documentos</strong>.<br>
             Costo del trámite: <strong>$${this.PRECIO}</strong> (pago en administración).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.enviando = true;
      this.exhumacionService.crearSolicitud(this.archivos as File[]).subscribe({
        next: () => {
          this.enviando = false;
          this.modoNuevaSolicitud = false;
          Swal.fire({
            title: '¡Solicitud enviada!',
            html: `Tu solicitud fue registrada. Recuerda cancelar <strong>$${this.PRECIO}</strong> en la administración.`,
            icon: 'success',
            confirmButtonColor: '#2d5a27',
          }).then(() => this.verificarSolicitudActiva());
        },
        error: (err) => {
          this.enviando = false;
          Swal.fire(
            'Ups!',
            err.error?.message || 'No se pudo enviar la solicitud.',
            'error',
          );
        },
      });
    });
  }

  onReemplazarDocumento(event: Event, doc: DocumentoExhumacion): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
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
      title: '¿Reemplazar documento?',
      text: `Se reemplazará "${doc.nombre_documento}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, reemplazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then((result) => {
      if (!result.isConfirmed) {
        input.value = '';
        return;
      }
      this.exhumacionService
        .reemplazarDocumento(doc.id_documento, archivo)
        .subscribe({
          next: () => {
            Swal.fire(
              'Actualizado',
              'Documento reemplazado correctamente.',
              'success',
            );
            this.cargarDocumentosActivos(this.solicitudActiva!.id_solicitud);
            input.value = '';
          },
          error: (err) => {
            Swal.fire(
              'Ups!',
              err.error?.message || 'No se pudo reemplazar el documento.',
              'error',
            );
            input.value = '';
          },
        });
    });
  }

  urlDocumento(ruta: string): string {
    return `${this.apiBase}${ruta}`;
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

  badgeIcon(estado: string): string {
    switch (estado) {
      case 'APROBADA':
        return 'bi-check-circle-fill text-success';
      case 'RECHAZADA':
        return 'bi-x-circle-fill text-danger';
      default:
        return 'bi-clock-fill text-warning';
    }
  }
}
