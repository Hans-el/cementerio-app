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
  ocupaciones: any[] = [];
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
  page = 1;
  limit = 50;

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

  }


  // CARGAS BASE DE LOS DATOS
  cargarSectores(): void {
    this.sectoresService.obtenerSectores().subscribe({
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
    this.manzanasService.getManzanasBySectorCodigo(idSector).subscribe({
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
  cargarBloques(idManzana: number, idSector: number): void {
    this.bloquesService.getBloquesByManzanaAndSector(idManzana, idSector).subscribe({
      next: data => {
        this.bloques = data;
        this.filtros.bloque = null; // Reinicia el filtro de bloque al cambiar de manzana
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los bloques', 'error');
      }
    });
  }
  //aca cargamos las ocupaciones activas, usando la funcion creada en ocupaciones.service.ts
  cargarOcupaciones(): void {
    this.loading = true;
    this.ocupacionesService.getOcupaciones(this.page).subscribe({
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
      sector: this.filtros.sector ?? undefined,
      manzana: this.filtros.manzana ?? undefined,
      bloque: this.filtros.bloque ?? undefined
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
    if (!this.filtros.sector) {
      this.manzanas = [];
      this.filtros.manzana = null;
      this.cargarOcupaciones();
      return;
    }
    this.cargarManzanas(this.filtros.sector);
    this.aplicarFiltros();
  }
  // Función para manejar el cambio de manzana
  onManzanaChange(): void {
    if (!this.filtros.manzana || !this.filtros.sector) {
      this.bloques = [];
      this.filtros.bloque = null;
      this.aplicarFiltros();
      return;
    }
    this.cargarBloques(this.filtros.manzana, this.filtros.sector);
    this.aplicarFiltros();
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
