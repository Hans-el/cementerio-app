import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InhumacionService } from '../../../../core/services/inhumacion.service';
import {
  SolicitudInhumacion,
  DocumentoInhumacion,
} from '../../../admin/models/inhumacion.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { PuedeSalir } from '../../../../core/guards/unsaved-changes.guard';

//archivos necesarios
const DOCUMENTOS_REQUERIDOS = [
  'Copia de Cédula del Propietario',
  'Copia de Cédula del Fallecido',
  'Copia de Cédula del familar más cercano',
  'Copia Certificado del INEC',
  'Copia Certificado de Defunción',
];

@Component({
  selector: 'app-solicitud-inhumacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud-inhumacion.component.html',
  styleUrl: './solicitud-inhumacion.component.css',
})
export class SolicitudInhumacionComponent implements OnInit, PuedeSalir {
  documentosRequeridos = DOCUMENTOS_REQUERIDOS;
  archivos: (File | null)[] = new Array(DOCUMENTOS_REQUERIDOS.length).fill(
    null,
  );
  solicitudActiva: SolicitudInhumacion | null = null;
  documentosActivos: DocumentoInhumacion[] = [];
  cargando = false;
  enviando = false;
  reenviando = false;
  modoNuevaSolicitud = false;
  readonly PRECIO = 10.81;
  readonly apiBase = new URL(environment.apiUrl).origin;

  constructor(private inhumacionService: InhumacionService) {}

  ngOnInit(): void {
    this.verificarSolicitudActiva();
  }

  // Al entrar al componente verificamos si ya tiene solicitud activa
  verificarSolicitudActiva(): void {
    this.cargando = true;
    this.inhumacionService.getSolicitudActiva().subscribe({
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
    this.inhumacionService.getDocumentos(id_solicitud).subscribe({
      next: (docs) => {
        this.documentosActivos = docs;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  // ---- Formulario nueva solicitud ----

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
      this.inhumacionService.crearSolicitud(this.archivos as File[]).subscribe({
        next: () => {
          this.enviando = false;
          this.modoNuevaSolicitud = false; // <-- resetea la solicitud
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
            'Error',
            err.error?.message || 'No se pudo enviar la solicitud.',
            'error',
          );
        },
      });
    });
  }

  // ---- Editar documento (solo PENDIENTE) ----

  onReemplazarDocumento(event: Event, doc: DocumentoInhumacion): void {
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

      this.inhumacionService
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
              'Error',
              err.error?.message || 'No se pudo reemplazar el documento.',
              'error',
            );
            input.value = '';
          },
        });
    });
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
          : 'Tu solicitud anterior fue aprobada. ¿Deseas iniciar una nueva solicitud de inhumación?',
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
  // Agregar este único método al final
  tieneCambiosSinGuardar(): boolean {
    // Hay cambios sin guardar si:
    // 1. Está en modo nueva solicitud Y subió al menos un archivo
    // 2. No tiene solicitud activa (es la primera vez) Y subió al menos un archivo
    const hayArchivos = this.archivos.some((a) => a !== null);
    const enModoEdicion = this.modoNuevaSolicitud || !this.solicitudActiva;
    return hayArchivos && enModoEdicion && !this.enviando;
  }
}
