import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { EditarBovedasComponent } from '../../components/editar-bovedas/editar-bovedas.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OcupacionesService } from '../../services/ocupaciones.service';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';
import { BloquesService } from '../../services/bloques.service';
import { GestionBovedasComponent } from '../../components/gestion-bovedas/gestion-bovedas.component';
import { Ocupacion } from '../../models/ocupacion.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbPaginationModule
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  // ===============================
  // DATA
  // ===============================
  ocupaciones: Ocupacion[] = [];
  sectores: any[] = [];
  manzanas: any[] = [];
  bloques: any[] = [];
  resumenEstados: any[] = [];
  loading = false;

  // ===============================
  // FILTROS
  // ===============================
  filtros = {
    busqueda: '',
    sector: null as number | null,
    manzana: null as number | null,
    bloque: null as number | null
  };


  // PAGINACIÓN
  page: number = 1;
  limit: number = 50;
  totalOcupaciones: number = 0;

  constructor(
    private ocupacionesService: OcupacionesService,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
    private bloquesService: BloquesService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.cargarSectores();
    this.cargarOcupaciones();
    this.cargarResumenEstados();
    this.obtenerTotalOcupaciones(); // Función para obtener el total de ocupaciones


  }


  // CARGAS BASE DE LOS DATOS
  cargarSectores(): void {
    this.sectoresService.getSectores().subscribe({
      next: data => {
        this.sectores = data;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los sectores', 'error');
      }
    });
  }
  //aca cargamos las manzanas. Esto debe estar igual a la funcion del backend en controllers/manzanaController.js [La ultima funcion creada]
  cargarManzanas(idSector: number): void {
    this.manzanasService.getManzanasBySectorCodigo(idSector.toString()).subscribe({
      next: data => {
        this.manzanas = data;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error');
      }
    });
  }
  //aca cargamos los bloques segun la manzana y el sector seleccionado, usando la nueva funcion creada en bloques.service.ts.
  // recordemos que usamos numero_manzana para los filtros en el componente inicio.component.html, no id_manzana
  cargarBloques(idManzana: number): void {
    this.bloquesService.getBloquesByManzanaId(idManzana).subscribe({
      next: data => {
        this.bloques = data; // Asegúrate de que `data` sea un arreglo válido
        console.log('Bloques cargados:', this.bloques); // Depuración
      },
      error: (error) => {
        console.error('Error al cargar bloques:', error);
        Swal.fire('Error', 'No se pudieron cargar los bloques', 'error');
      }
    });
  }

  //aca cargamos las ocupaciones activas, usando la funcion creada en ocupaciones.service.ts
  cargarOcupaciones(): void {
    this.loading = true;
    this.ocupacionesService.getOcupaciones(this.page, this.limit).subscribe({
      next: data => {
        this.ocupaciones = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar las ocupaciones', 'error');
      }
    });
  }
  // Función para obtener el total de ocupaciones
  obtenerTotalOcupaciones(): void {
    this.ocupacionesService.getTotalOcupaciones().subscribe({
      next: total => {
        this.totalOcupaciones = total;
      },
      error: () => {
        console.error('Error al obtener el total de ocupaciones');
      }
    });
  }

  // Función para ir a la página anterior
  paginaAnterior(): void {
    if (this.page > 1) {
      this.page--;
      this.cargarOcupaciones();
    }
  }

  // Función para ir a la página siguiente
  siguientePagina(): void {
    const totalPages = Math.ceil(this.totalOcupaciones / this.limit);
    if (this.page < totalPages) {
      this.page++;
      this.cargarOcupaciones();
    }
  }
  // nueva funcion para cargar el resumen de estados de los bloques, para los cards de resumen en inicio.component.html
  cargarResumenEstados(): void {
    this.bloquesService.getResumenEstadosBloques().subscribe({
      next: data => {
        this.resumenEstados = data;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el resumen de estados', 'error');
      }
    });
  }

  // ===============================
  // BUSCADOR TEXTO
  // ===============================
  buscarTexto(): void {
    if (!this.filtros.busqueda || this.filtros.busqueda.length < 2) {
      this.cargarOcupaciones();
      return;
    }
    this.loading = true;
    this.ocupacionesService.buscarOcupaciones(this.filtros.busqueda).subscribe({
      next: data => {
        this.ocupaciones = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Error en la búsqueda', 'error');
      }
    });
  }

  // FILTROS DINÁMICOS
  aplicarFiltros(): void {
    this.loading = true;

    this.ocupacionesService.filtrarOcupaciones({
      sector: this.filtros.sector?.toString(),
      manzana: this.filtros.manzana?.toString(),
      bloque: this.filtros.bloque?.toString()
    }).subscribe({
      next: data => {
        this.ocupaciones = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Error al aplicar filtros', 'error');
      }
    });
  }


  // Función para manejar el cambio de sector
  onSectorChange(): void {
    this.filtros.manzana = null;
    this.filtros.bloque = null;
    this.manzanas = [];
    this.bloques = [];

    if (!this.filtros.sector) {
      this.cargarOcupaciones();
      return;
    }

    this.cargarManzanas(this.filtros.sector);
    this.aplicarFiltros();
  }

  // Función para manejar el cambio de manzana
  onManzanaChange(): void {
    this.filtros.bloque = null;
    this.bloques = [];

    if (!this.filtros.manzana) {
      this.aplicarFiltros();
      return;
    }
    // Obtener el id_manzana correspondiente al número de manzana seleccionado
    const manzanaSeleccionada = this.manzanas.find(m => m.numero_manzana === this.filtros.manzana);
    if (manzanaSeleccionada) {
      this.cargarBloques(manzanaSeleccionada.id_manzana);
    } else {
      this.aplicarFiltros();
    }
  }



  // Función para manejar el cambio de bloque
  onBloqueChange(): void {
    this.aplicarFiltros();
  }




  // CONTADORES DE LOS BADGES ((falta corregir para que se acualizen respectivamente los numeros reales))
  // ===============================
  // Métodos get para los cards de resumen
  get total(): number {
    return this.resumenEstados.reduce((sum, estado) => sum + estado.cantidad, 0);
  }

  get disponibles(): number {
    const estado = this.resumenEstados.find(e => e.estado === 'DISPONIBLE');
    return estado ? estado.cantidad : 0;
  }

  get ocupadas(): number {
    const estado = this.resumenEstados.find(e => e.estado === 'OCUPADO');
    return estado ? estado.cantidad : 0;
  }

  get mantenimiento(): number {
    const estado = this.resumenEstados.find(e => e.estado === 'MANTENIMIENTO');
    return estado ? estado.cantidad : 0;
  }

  get clausuradas(): number {
    const estado = this.resumenEstados.find(e => e.estado === 'CLAUSURADO');
    return estado ? estado.cantidad : 0;
  }





  eliminar(ocupacion: any): void {
    Swal.fire({
      title: '¿Eliminar ocupación?',
      text: `Ocupación de ${ocupacion.nombre_fallecido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(() => {
      Swal.fire(
        'Pendiente',
        'La eliminación se realizará desde el backend',
        'info'
      );
    });
  }

  //editar registro, debemos ajustarlo al backend para que se actulice los datos en la base de datos
  editar(ocupacion: any): void {
    Swal.fire(
      'Pendiente',
      'La edición se realizará desde el backend',
      'info'
    );
  }
}
