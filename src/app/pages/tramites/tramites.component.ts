import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TramiteService } from '../../services/tramite.service';
import { TipoTramite } from '../../models/tramite.model';


@Component({
  selector: 'app-tramites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tramites.component.html',
  styleUrl: './tramites.component.css'
})
export class TramitesComponent implements OnInit {
  tipos: TipoTramite[] = [];
  cargando = true;

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

  irATramite(id_tipo: number): void {
    this.router.navigate(['/tramites', id_tipo]);
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