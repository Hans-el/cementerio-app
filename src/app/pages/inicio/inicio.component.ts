import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

interface Boveda {
  codigo: string;
  ubicacion: string;
  sector: string;
  capacidad: number;
  estado: 'Disponible' | 'Ocupada' | 'Mantenimiento' | 'Inactiva';
  actualizado: string;
}

@Component({
  selector: 'app-gestion-bovedas',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule, NgbPaginationModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  bovedas: Boveda[] = [
    { codigo: 'B-01-A', ubicacion: 'Sector A / Fila 1', sector: 'A', capacidad: 2, estado: 'Disponible', actualizado: '2025-08-01' },
    { codigo: 'B-01-B', ubicacion: 'Sector A / Fila 1', sector: 'A', capacidad: 2, estado: 'Ocupada', actualizado: '2025-08-15' },
    { codigo: 'B-02-A', ubicacion: 'Sector B / Fila 2', sector: 'B', capacidad: 1, estado: 'Mantenimiento', actualizado: '2025-07-20' },
    { codigo: 'B-03-A', ubicacion: 'Sector B / Fila 3', sector: 'B', capacidad: 1, estado: 'Disponible', actualizado: '2025-08-28' },
    // Añade más datos según necesites
  ];

  filtros = {
    estado: 'Todos los estados',
    sector: 'Todos los sectores',
    busqueda: '',
  };

  // Contadores para los badges
  get totalBovedas(): number {
    return this.bovedas.length;
  }

  get disponibles(): number {
    return this.bovedas.filter(b => b.estado === 'Disponible').length;
  }

  get ocupadas(): number {
    return this.bovedas.filter(b => b.estado === 'Ocupada').length;
  }

  get mantenimiento(): number {
    return this.bovedas.filter(b => b.estado === 'Mantenimiento').length;
  }

  get inactivas(): number {
    return this.bovedas.filter(b => b.estado === 'Inactiva').length;
  }

  // Filtrar bóvedas según los filtros seleccionados
  get bovedasFiltradas(): Boveda[] {
    return this.bovedas.filter(boveda => {
      const coincideEstado = this.filtros.estado === 'Todos los estados' || boveda.estado === this.filtros.estado;
      const coincideSector = this.filtros.sector === 'Todos los sectores' || boveda.sector === this.filtros.sector;
      const coincideBusqueda =
        boveda.codigo.toLowerCase().includes(this.filtros.busqueda.toLowerCase()) ||
        boveda.ubicacion.toLowerCase().includes(this.filtros.busqueda.toLowerCase()) ||
        boveda.sector.toLowerCase().includes(this.filtros.busqueda.toLowerCase());
      return coincideEstado && coincideSector && coincideBusqueda;
    });
  }

  // Obtener clase CSS según el estado
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Disponible': return 'badge bg-success';
      case 'Ocupada': return 'badge bg-danger';
      case 'Mantenimiento': return 'badge bg-warning text-dark';
      case 'Inactiva': return 'badge bg-secondary';
      default: return 'badge bg-light text-dark';
    }
  }
}
