import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GestionDifuntosComponent } from '../../components/gestion-difuntos/gestion-difuntos.component';
import { EditarDifuntoComponent } from '../../components/editar-difunto/editar-difunto.component';
import { FallecidoService } from '../../services/fallecido.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio-difuntos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-difuntos.component.html',
  styleUrls: ['./inicio-difuntos.component.css']
})
export class InicioDifuntosComponent implements OnInit {
  difuntos: any[] = [];
  loading = false;
  filtros = {
    busqueda: '',
    genero: 'Todos',
  };

  constructor(
    private modalService: NgbModal,
    private fallecidoService: FallecidoService
  ) { }

  ngOnInit(): void {
    this.cargarDifuntos();
  }

  cargarDifuntos(): void {
    this.loading = true;
    this.fallecidoService.getFallecidos().subscribe({
      next: (data) => {
        this.difuntos = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los difuntos', 'error');
      }
    });
  }

  // Filtrar difuntos según los filtros seleccionados
  get difuntosFiltrados(): any[] {
    return this.difuntos.filter(difunto => {
      const coincideBusqueda =
        difunto.nombre_completo.toLowerCase().includes(this.filtros.busqueda.toLowerCase()) ||
        difunto.fecha_fallecimiento_raw.includes(this.filtros.busqueda);
      const coincideGenero = this.filtros.genero === 'Todos' || difunto.genero === this.filtros.genero;
      return coincideBusqueda && (this.filtros.genero === 'Todos' ? true : coincideGenero);
    });
  }

  // Contadores de difuntos para mayor claridad en la UI
  get totalDifuntos(): number {
    return this.difuntosFiltrados.length;
  }

  // Función para abrir el modal de añadir difunto
  abrirModalAnadirDifunto() {
    const modalRef = this.modalService.open(GestionDifuntosComponent);
    modalRef.componentInstance.guardar.subscribe((nuevoDifunto: any) => {
      this.fallecidoService.createFallecido(nuevoDifunto).subscribe({
        next: (response) => {
          Swal.fire('Éxito', 'Difunto registrado correctamente', 'success');
          this.cargarDifuntos(); // Recargar la lista de difuntos
        },
        error: () => {
          Swal.fire('Error', 'Error al registrar el difunto', 'error');
        }
      });
    });
  }

  // Función para abrir el modal de editar difunto
  abrirModalEditarDifunto(difunto: any) {
    const modalRef = this.modalService.open(EditarDifuntoComponent);
    modalRef.componentInstance.difunto = { ...difunto };
    modalRef.componentInstance.guardar.subscribe((difuntoEditado: any) => {
      this.fallecidoService.updateFallecido(difuntoEditado.id_fallecido, difuntoEditado).subscribe({
        next: (response) => {
          Swal.fire('Éxito', 'Difunto actualizado correctamente', 'success');
          this.cargarDifuntos(); // Recargar la lista de difuntos
        },
        error: () => {
          Swal.fire('Error', 'Error al actualizar el difunto', 'error');
        }
      });
    });
  }
}
