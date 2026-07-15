import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TramiteService } from '../../services/tramite.service';
import { TipoTramite, DocumentoTipo, Solicitud, DocumentoSolicitud } from '../../models/tramite.model';
import { PuedeSalir } from '../../guards/unsaved-changes.guard';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-tramite',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './solicitud-tramite.component.html',
  styleUrl: './solicitud-tramite.component.css'
})
export class SolicitudTramiteComponent implements OnInit, PuedeSalir {
  // Tipo de trámite actual
  tipoTramite: TipoTramite | null = null;
  documentosTipo: DocumentoTipo[] = [];

  // Estado de la solicitud
  solicitudActiva: Solicitud | null = null;
  documentosActivos: DocumentoSolicitud[] = [];
  urlRespuesta: string | null = null;

  // Archivos seleccionados por el usuario
  archivos: (File | null)[] = [];

  // Flags de estado
  cargando = false;
  enviando = false;
  modoNuevaSolicitud = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tramiteService: TramiteService,
  ) { }

  ngOnInit(): void {
    // Obtener el id_tipo_tramite desde la URL — /tramites/:id_tipo
    this.route.params.subscribe(params => {
      const id_tipo = parseInt(params['id_tipo']);
      if (isNaN(id_tipo)) { this.router.navigate(['/tramites']); return; }
      this.cargarTipo(id_tipo);
    });
  }

  cargarTipo(id_tipo: number): void {
    this.cargando = true;

    // Cargar tipo de trámite
    this.tramiteService.getTipos().subscribe({
      next: (tipos) => {
        this.tipoTramite = tipos.find(t => t.id_tipo_tramite === id_tipo) ?? null;
        if (!this.tipoTramite) { this.router.navigate(['/tramites']); return; }

        // Cargar documentos requeridos
        this.tramiteService.getDocumentosTipo(id_tipo).subscribe({
          next: (docs) => {
            this.documentosTipo = docs;
            this.archivos = new Array(docs.length).fill(null);
            this.verificarSolicitudActiva(id_tipo);
          },
        });
      },
    });
  }

  verificarSolicitudActiva(id_tipo: number): void {
    this.tramiteService.getSolicitudActiva(id_tipo).subscribe({
      next: (solicitud) => {
        this.solicitudActiva = solicitud;
        if (solicitud) {
          this.cargarDocumentosActivos(solicitud.id_solicitud);
          if (solicitud.documento_respuesta) {
            this.cargarUrlRespuesta(solicitud.id_solicitud);
          }
        } else {
          this.cargando = false;
        }
      },
      error: () => { this.cargando = false; },
    });
  }

  cargarDocumentosActivos(id_solicitud: number): void {
    this.tramiteService.getDocumentos(id_solicitud).subscribe({
      next: (docs) => { this.documentosActivos = docs; this.cargando = false; },
      error: () => { this.cargando = false; },
    });
  }

  cargarUrlRespuesta(id_solicitud: number): void {
    this.tramiteService.getUrlRespuesta(id_solicitud).subscribe({
      next: (res) => { this.urlRespuesta = res.url; },
      error: () => { this.urlRespuesta = null; },
    });
  }

  // ── Selección de archivos ─────────────────────────────────

  onArchivoSeleccionado(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
    const archivo = input.files[0];
    if (archivo.type !== 'application/pdf') {
      Swal.fire('Formato inválido', 'Solo se permiten archivos PDF.', 'warning');
      input.value = ''; return;
    }
    if (archivo.size > 10 * 1024 * 1024) {
      Swal.fire('Archivo muy grande', 'El archivo no puede superar 10MB.', 'warning');
      input.value = ''; return;
    }
    this.archivos[index] = archivo;
  }

  eliminarArchivo(index: number): void {
    this.archivos[index] = null;
    const input = document.getElementById(`doc-${index}`) as HTMLInputElement;
    if (input) input.value = '';
  }

  onReemplazarDocumento(event: Event, doc: DocumentoSolicitud): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
    const archivo = input.files[0];
    if (archivo.type !== 'application/pdf') {
      Swal.fire('Formato inválido', 'Solo se permiten archivos PDF.', 'warning');
      input.value = ''; return;
    }
    Swal.fire({
      title: '¿Reemplazar documento?',
      text: `Se reemplazará "${doc.nombre_documento}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, reemplazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then(result => {
      if (!result.isConfirmed) { input.value = ''; return; }
      this.tramiteService.reemplazarDocumento(doc.id_documento, archivo).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Documento reemplazado correctamente.', 'success');
          this.cargarDocumentosActivos(this.solicitudActiva!.id_solicitud);
          input.value = '';
        },
        error: (err) => {
          Swal.fire('Error', err.error?.mensaje || 'No se pudo reemplazar.', 'error');
          input.value = '';
        },
      });
    });
  }

  // ── Envío ─────────────────────────────────────────────────

  get obligatoriosSubidos(): boolean {
    return this.documentosTipo
      .every((doc, i) => !doc.obligatorio || this.archivos[i] !== null);
  }

  get totalSubidos(): number {
    return this.archivos.filter(a => a !== null).length;
  }

  enviarSolicitud(): void {
    if (!this.obligatoriosSubidos) {
      Swal.fire('Documentos incompletos', 'Debes subir todos los documentos obligatorios.', 'warning');
      return;
    }

    const precio = this.tipoTramite?.es_gratuito
      ? 'Trámite gratuito'
      : `Costo: <strong>$${this.tipoTramite?.costo}</strong> (pago en administración)`;

    Swal.fire({
      title: '¿Enviar solicitud?',
      html: `Solicitud de <strong>${this.tipoTramite?.nombre}</strong><br>${precio}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then(result => {
      if (!result.isConfirmed) return;
      this.enviando = true;

      const archivosAEnviar = this.archivos.filter(a => a !== null) as File[];

      this.tramiteService.crearSolicitud(
        this.tipoTramite!.id_tipo_tramite,
        archivosAEnviar
      ).subscribe({
        next: () => {
          this.enviando = false;
          this.modoNuevaSolicitud = false;
          Swal.fire({
            title: '¡Solicitud enviada!',
            html: `Tu solicitud de <strong>${this.tipoTramite?.nombre}</strong> fue registrada.`,
            icon: 'success',
            confirmButtonColor: '#2d5a27',
          }).then(() => this.verificarSolicitudActiva(this.tipoTramite!.id_tipo_tramite));
        },
        error: (err) => {
          this.enviando = false;
          Swal.fire('Error', err.error?.mensaje || 'No se pudo enviar la solicitud.', 'error');
        },
      });
    });
  }

  // ── Nueva solicitud ───────────────────────────────────────

  get puedeEnviarNueva(): boolean {
    return this.solicitudActiva?.estado === 'RECHAZADA' ||
      this.solicitudActiva?.estado === 'APROBADA';
  }

  iniciarNuevaSolicitud(): void {
    Swal.fire({
      title: '¿Iniciar nueva solicitud?',
      html: this.solicitudActiva?.estado === 'RECHAZADA'
        ? 'Tu solicitud anterior fue rechazada. Puedes enviar una nueva con los documentos corregidos.'
        : `¿Deseas iniciar una nueva solicitud de <strong>${this.tipoTramite?.nombre}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, nueva solicitud',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then(result => {
      if (result.isConfirmed) {
        this.modoNuevaSolicitud = true;
        this.archivos = new Array(this.documentosTipo.length).fill(null);
      }
    });
  }

  cancelarNuevaSolicitud(): void {
    this.modoNuevaSolicitud = false;
    this.archivos = new Array(this.documentosTipo.length).fill(null);
  }

  // ── Helpers (ordenarlos despues en carpeta para centralizar)

  tieneCambiosSinGuardar(): boolean {
    const hayArchivos = this.archivos.some(a => a !== null);
    const enModoEdicion = this.modoNuevaSolicitud || !this.solicitudActiva;
    return hayArchivos && enModoEdicion && !this.enviando;
  }

  badgeClass(estado: string): string {
    switch (estado) {
      case 'APROBADA': return 'bg-success bg-opacity-10 text-success';
      case 'RECHAZADA': return 'bg-danger bg-opacity-10 text-danger';
      default: return 'bg-warning bg-opacity-10 text-warning';
    }
  }

  badgeIcon(estado: string): string {
    switch (estado) {
      case 'APROBADA': return 'bi-check-circle-fill text-success';
      case 'RECHAZADA': return 'bi-x-circle-fill text-danger';
      default: return 'bi-clock-fill text-warning';
    }
  }
}


