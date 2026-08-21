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
  styleUrls: ['./inicio-difuntos.component.css'],
})
export class InicioDifuntosComponent implements OnInit {
  difuntos: any[] = [];
  totalFallecidos: number = 0;
  loading = false;
  currentPage: number = 1;
  limit: number = 30;
  totalPages: number = 0;
  searchQuery: string = '';
  today: Date = new Date();
  fechaInicio: string = '';
  fechaFin: string = '';

  filtros = { busqueda: '' };

  constructor(
    private modalService: NgbModal,
    private fallecidoService: FallecidoService,
  ) {}

  ngOnInit(): void {
    this.cargarDifuntos();
  }

  cargarDifuntos(): void {
    this.loading = true;
    this.fallecidoService
      .getFallecidos(
        this.currentPage,
        this.limit,
        this.searchQuery || undefined,
        this.fechaInicio || undefined,
        this.fechaFin || undefined,
      )
      .subscribe({
        next: (response) => {
          this.difuntos = response.data.filter(
            (d) => d.nombre_completo.toUpperCase() !== 'S/N',
          );
          this.totalFallecidos = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: () => {
          console.error('Error al cargar los difuntos');
          this.loading = false;
        },
      });
  }
  cargarTotalFallecidos(): void {
    this.fallecidoService
      .getTotalFallecidos(
        this.searchQuery || undefined,
        this.fechaInicio || undefined,
        this.fechaFin || undefined,
      )
      .subscribe({
        next: (data) => {
          this.totalFallecidos = data.total;
        },
        error: () => {
          console.error('Error al cargar el total de difuntos');
        },
      });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cargarDifuntos();
    }
  }
  onSearch(): void {
    this.currentPage = 1;
    this.cargarDifuntos();
  }
  // Nuevo — limpiar todos los filtros
  limpiarFiltros(): void {
    this.searchQuery = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.currentPage = 1;
    this.cargarDifuntos();
  }

  get difuntosFiltrados(): any[] {
    if (!this.filtros.busqueda) return this.difuntos;
    return this.difuntos.filter((d) =>
      d.nombre_completo
        .toLowerCase()
        .includes(this.filtros.busqueda.toLowerCase()),
    );
  }

  get getFallecidos(): number {
    return this.difuntosFiltrados.length;
  }

  //Modal para añadir difunto, se abre al hacer click en el botón "Añadir Difunto"
  abrirModalAnadirDifunto() {
    const modalRef = this.modalService.open(GestionDifuntosComponent);
    modalRef.componentInstance.guardar.subscribe((nuevoDifunto: any) => {
      this.fallecidoService.crearFallecido(nuevoDifunto).subscribe({
        next: (response) => {
          Swal.fire('Éxito', 'Difunto registrado correctamente', 'success');
          this.cargarDifuntos();
        },
        error: () => {
          Swal.fire('Error', 'Error al registrar el difunto', 'error');
        },
      });
    });
  }

  //Modal para editar difunto, se abre al hacer click en el botón "Editar" de cada fila
  abrirModalEditarDifunto(difunto: any) {
    const modalRef = this.modalService.open(EditarDifuntoComponent);
    modalRef.componentInstance.fallecido = { ...difunto }; // Pasa una copia del objeto fallecido al modal, de esta manera obtenemos el id cque va cargar los datos.
    // Escuchar cuando se cierre el modal para recargar los datos
    modalRef.result.then(
      (result) => {
        if (result) {
          this.cargarDifuntos(); // Recargar la lista si se guardaron cambios
        }
      },
      (reason) => {
        // Manejar cancelación si es necesario
      },
    );
  }
  // Método para eliminar un difunto, se llama al hacer click en el botón "Eliminar" de cada fila
  eliminarFallecido(id_fallecido: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#163212',
      confirmButtonText: 'Sí, eliminarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fallecidoService.eliminarFallecido(id_fallecido).subscribe({
          next: () => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              title: '¡Registro Eliminado!',
              text: 'El difunto ha sido eliminado.',
              icon: 'success',
            });
            this.cargarDifuntos();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el fallecido.', 'error');
          },
        });
      }
    });
  }
}
