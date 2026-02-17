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
  currentPage: number = 1; // Página actual
  limit: number = 30; // Número de registros por página
  totalPages: number = 0; // Total de páginas
  searchQuery: string = ''; // Consulta de búsqueda
  today: Date = new Date();

  // Filtros
  filtros = {
    busqueda: '',
  };

  constructor(
    private modalService: NgbModal,
    private fallecidoService: FallecidoService,
  ) {}

  ngOnInit(): void {
    this.cargarDifuntos(); // Cargar difuntos al iniciar el componente, lo usamos para el buscador
  }

  cargarDifuntos(): void {
    this.fallecidoService
      .getFallecidos(this.currentPage, this.limit, this.searchQuery)
      .subscribe({
        next: (response) => {
          this.difuntos = response.data.filter(
            (difunto) => difunto.nombre_completo.toUpperCase() !== 'S/N',
          );
          this.totalFallecidos = response.total;
          this.totalPages = response.totalPages;
        },
        error: () => {
          console.error('Error al cargar los difuntos');
        },
      });
  }
  cargarTotalFallecidos(): void {
    this.fallecidoService.getTotalFallecidos(this.searchQuery).subscribe({
      next: (data) => {
        this.totalFallecidos = data.total;
      },
      error: () => {
        console.error('Error al cargar el total de difuntos');
      },
    });
  }
  // Método para manejar el cambio de página. Se llama cuando el usuario navega entre páginas.
  // En el html se encuentra abajo en los botones de paginación
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
  // Obtener difuntos filtrados según la búsqueda
  get difuntosFiltrados(): any[] {
    if (!this.filtros.busqueda) {
      return this.difuntos;
    }
    return this.difuntos.filter(
      (difunto) =>
        difunto.nombre_completo
          .toLowerCase()
          .includes(this.filtros.busqueda.toLowerCase()) ||
        (difunto.fecha_fallecimiento_raw &&
          difunto.fecha_fallecimiento_raw.includes(this.filtros.busqueda)),
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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fallecidoService.eliminarFallecido(id_fallecido).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminado!',
              'El fallecido ha sido eliminado.',
              'success',
            );
            // Aquí puedes recargar la lista de fallecidos o hacer cualquier otra acción necesaria
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
