import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { GestionBovedasComponent } from '../../components/gestion-bovedas/gestion-bovedas.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditarBovedasComponent } from '../../components/editar-bovedas/editar-bovedas.component';
import Swal from 'sweetalert2';

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
  constructor(private modalService: NgbModal) {}

  bovedas: Boveda[] = [
    { codigo: 'B-01-A', ubicacion: 'Sector A / Fila 1', sector: '1', capacidad: 2, estado: 'Disponible', actualizado: '2025-08-01' },
    { codigo: 'B-01-B', ubicacion: 'Sector A / Fila 1', sector: '1', capacidad: 2, estado: 'Ocupada', actualizado: '2025-08-15' },
    { codigo: 'B-02-A', ubicacion: 'Sector B / Fila 2', sector: '2', capacidad: 1, estado: 'Mantenimiento', actualizado: '2025-07-20' },
    { codigo: 'B-03-A', ubicacion: 'Sector B / Fila 3', sector: '2', capacidad: 1, estado: 'Disponible', actualizado: '2025-08-28' },
    { codigo: 'B-04-A', ubicacion: 'Sector C / Fila 1', sector: '3', capacidad: 3, estado: 'Disponible', actualizado: '2025-08-01' },
    { codigo: 'B-04-B', ubicacion: 'Sector C / Fila 1', sector: '3', capacidad: 3, estado: 'Ocupada', actualizado: '2025-08-15' },
    { codigo: 'B-05-A', ubicacion: 'Sector D / Fila 2', sector: '4', capacidad: 1, estado: 'Mantenimiento', actualizado: '2025-07-20' },
    { codigo: 'B-06-A', ubicacion: 'Sector D / Fila 3', sector: '4', capacidad: 1, estado: 'Disponible', actualizado: '2025-08-28' },
    { codigo: 'B-07-A', ubicacion: 'Sector E / Fila 1', sector: '5', capacidad: 2, estado: 'Disponible', actualizado: '2025-08-01' },
    { codigo: 'B-07-B', ubicacion: 'Sector E / Fila 1', sector: '5', capacidad: 2, estado: 'Ocupada', actualizado: '2025-08-15' },
    { codigo: 'B-08-A', ubicacion: 'Sector F / Fila 2', sector: '6', capacidad: 1, estado: 'Mantenimiento', actualizado: '2025-07-20' },
    { codigo: 'B-09-A', ubicacion: 'Sector F / Fila 3', sector: '6', capacidad: 1, estado: 'Disponible', actualizado: '2025-08-28' },
    { codigo: 'B-10-A', ubicacion: 'Sector G / Fila 1', sector: '7', capacidad: 2, estado: 'Disponible', actualizado: '2025-08-01' },
    { codigo: 'B-10-B', ubicacion: 'Sector G / Fila 1', sector: '7', capacidad: 2, estado: 'Ocupada', actualizado: '2025-08-15' },
    { codigo: 'B-11-A', ubicacion: 'Sector H / Fila 2', sector: '8', capacidad: 1, estado: 'Mantenimiento', actualizado: '2025-07-20' },
    { codigo: 'B-12-A', ubicacion: 'Sector H / Fila 3', sector: '8', capacidad: 1, estado: 'Disponible', actualizado: '2025-08-28' },
    { codigo: 'B-13-A', ubicacion: 'Sector I / Fila 1', sector: '9', capacidad: 2, estado: 'Disponible', actualizado: '2025-08-01' },
    { codigo: 'B-13-B', ubicacion: 'Sector I / Fila 1', sector: '9', capacidad: 2, estado: 'Ocupada', actualizado: '2025-08-15' },
    { codigo: 'B-14-A', ubicacion: 'Sector J / Fila 2', sector: '10', capacidad: 1, estado: 'Mantenimiento', actualizado: '2025-07-20' },
    { codigo: 'B-15-A', ubicacion: 'Sector J / Fila 3', sector: '10', capacidad: 1, estado: 'Disponible', actualizado: '2025-08-28' },
    { codigo: 'B-16-A', ubicacion: 'Sector K / Fila 1', sector: '11', capacidad: 2, estado: 'Disponible', actualizado: '2025-08-01' },
    { codigo: 'B-16-B', ubicacion: 'Sector K / Fila 1', sector: '11', capacidad: 2, estado: 'Ocupada', actualizado: '2025-08-15' },
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

  editarBovedas() {
    this.modalService.open(GestionBovedasComponent, { centered: true, size: 'md' });
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

  // Función para abrir el modal de edición
  abrirModalEditar(boveda: any) {
    const modalRef = this.modalService.open(EditarBovedasComponent);
    modalRef.componentInstance.boveda = { ...boveda };

    modalRef.componentInstance.guardar.subscribe((bovedaEditada: any) => {
      const index = this.bovedas.findIndex(b => b.codigo === bovedaEditada.codigo);
      if (index !== -1) {
        this.bovedas[index] = bovedaEditada;
      }
    });
  }
// usamos las alertas de swal para que se vea mejor al momento de eliminar
  eliminarBoveda(boveda: any) {
    Swal.fire({
      title: '¿Eliminar bóveda?',
      text: `¿Está seguro de que desea eliminar la bóveda ${boveda.codigo}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bovedas = this.bovedas.filter(b => b.codigo !== boveda.codigo);
        Swal.fire(
          'Eliminada',
          `La bóveda ${boveda.codigo} ha sido eliminada.`,
          'success'
        );
      }
    });
  }
}
