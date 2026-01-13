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
  currentPage = 1; // Página actual
  itemsPerPage = 50; // Ítems por página
  totalItems = 0; // Total de ítems
  totalPages = 0; // Total de páginas

  // Filtros
  filtros = {
    busqueda: '',
  };

  constructor(
    private modalService: NgbModal,
    private fallecidoService: FallecidoService
  ) { }

  ngOnInit(): void {
    this.cargarDifuntos(); // Cargar difuntos al iniciar el componente, lo usamos para el buscador

  }

  cargarDifuntos(page = 1): void {
    this.loading = true;
    this.fallecidoService.getFallecidos(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.difuntos = response.data.filter(difunto => difunto.nombre_completo !== "S/N");
        this.totalItems = response.total;
        this.currentPage = response.page;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los difuntos', 'error');
      }
    });
  }
  // Método para cambiar de página
  cambiarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.cargarDifuntos(page);
    }
  }


  get difuntosFiltrados(): any[] {
    if (!this.filtros.busqueda) {
      return this.difuntos;
    }
    return this.difuntos.filter(difunto =>
      difunto.nombre_completo.toLowerCase().includes(this.filtros.busqueda.toLowerCase()) ||
      (difunto.fecha_fallecimiento_raw && difunto.fecha_fallecimiento_raw.includes(this.filtros.busqueda))
    );
  }

  get getFallecidos(): number {
    return this.difuntosFiltrados.length;
  }

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
        }
      });
    });
  }

  abrirModalEditarDifunto(difunto: any) {
    const modalRef = this.modalService.open(EditarDifuntoComponent);
    modalRef.componentInstance.fallecido = { ...difunto }; // Pasa una copia del objeto

    // Escuchar cuando se cierre el modal para recargar los datos
    modalRef.result.then(
      (result) => {
        if (result) {
          this.cargarDifuntos(this.currentPage); // Recargar la lista si se guardaron cambios
        }
      },
      (reason) => {
        // Manejar cancelación si es necesario
      }
    );
  }


}
