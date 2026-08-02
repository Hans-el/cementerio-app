import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TramiteService } from '../../services/tramite.service';
import { TipoTramite, Solicitud, DocumentoSolicitud } from '../../models/tramite.model';


@Component({
  selector: 'app-tramites',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './tramites.component.html',
  styleUrl: './tramites.component.css'
})
export class TramitesComponent implements OnInit {
  tipos: TipoTramite[] = [];
  cargando = true;
  // ── Tabs
  tabActivo: 'tramites' | 'historial' = 'tramites';
  solicitudes: Solicitud[] = [];
  cargandoHistorial = false;
  filtroEstado: string = 'TODOS';
  filtroTipo: number | null = null;

  solicitudExpandida: number | null = null;
  documentosCache: { [id: number]: DocumentoSolicitud[] } = {};
  urlsRespuestaCache: { [id: number]: string | null } = {};
  cargandoDocumentos: { [id: number]: boolean } = {};


  constructor(
    private tramiteService: TramiteService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.tramiteService.getTipos().subscribe({
      next: (data) => { this.tipos = data; this.cargando = false; },
      error: () => { this.cargando = false; },
    });
  }

  cambiarTab(tab: 'tramites' | 'historial'): void {
    this.tabActivo = tab;
    if (tab === 'historial' && !this.solicitudes.length) {
      this.cargarHistorial();
    }
  }

  // ── Historial ─────────────────────────────────────────────

  cargarHistorial(): void {
    this.cargandoHistorial = true;
    this.solicitudExpandida = null;
    this.tramiteService.getMisSolicitudes(
      this.filtroEstado !== 'TODOS' ? this.filtroEstado : undefined,
      this.filtroTipo ?? undefined,
    ).subscribe({
      next: (data) => { this.solicitudes = data; this.cargandoHistorial = false; },
      error: () => { this.cargandoHistorial = false; },
    });
  }

  aplicarFiltros(): void {
    this.solicitudes = [];
    this.solicitudExpandida = null;
    this.cargarHistorial();
  }

  limpiarFiltros(): void {
    this.filtroEstado = 'TODOS';
    this.filtroTipo = null;
    this.aplicarFiltros();
  }

  toggleDetalle(solicitud: Solicitud): void {
    const id = solicitud.id_solicitud;
    if (this.solicitudExpandida === id) { this.solicitudExpandida = null; return; }
    this.solicitudExpandida = id;

    if (!this.documentosCache[id]) {
      this.cargandoDocumentos[id] = true;
      this.tramiteService.getDocumentos(id).subscribe({
        next: (docs) => { this.documentosCache[id] = docs; this.cargandoDocumentos[id] = false; },
        error: () => { this.documentosCache[id] = []; this.cargandoDocumentos[id] = false; },
      });
    }

    if (solicitud.documento_respuesta && this.urlsRespuestaCache[id] === undefined) {
      this.urlsRespuestaCache[id] = null;
      this.tramiteService.getUrlRespuesta(id).subscribe({
        next: (res) => { this.urlsRespuestaCache[id] = res.url; },
        error: () => { this.urlsRespuestaCache[id] = null; },
      });
    }
  }

  // ── Navegación 

  irATramite(id_tipo: number): void {
    this.router.navigate(['/tramites', id_tipo]);
  }

  // ── Helpers 

  get hayFiltros(): boolean {
    return this.filtroEstado !== 'TODOS' || this.filtroTipo !== null;
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

  iconoPorTipo(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('inhumación') || n.includes('inhumacion')) return 'bi-file-earmark-arrow-up';
    if (n.includes('exhumación') || n.includes('exhumacion')) return 'bi-file-earmark-arrow-down';
    if (n.includes('construcción') || n.includes('construccion')) return 'bi-building-add';
    if (n.includes('mejora')) return 'bi-tools';
    return 'bi-file-earmark-text';
  }

  colorPorTipo(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('inhumación') || n.includes('inhumacion')) return 'success';
    if (n.includes('exhumación') || n.includes('exhumacion')) return 'warning';
    if (n.includes('construcción') || n.includes('construccion')) return 'primary';
    return 'info';
  }
}