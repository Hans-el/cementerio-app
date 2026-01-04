import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { OcupacionesService } from '../../services/ocupaciones.service';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';
import { BloquesService } from '../../services/bloques.service';

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

  loading = false;

  // ===============================
  // FILTROS
  // ===============================
  filtros = {
    busqueda: '',
    sector: null as number | null,
    manzana: null as number | null
  };

  // ===============================
  // PAGINACIÓN
  // ===============================
  page = 1;
  limit = 50;

  constructor(
    private ocupacionesService: OcupacionesService,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
    private bloquesService: BloquesService
  ) { }

  // ===============================
  // INIT
  // ===============================
  ngOnInit(): void {
    this.cargarSectores();
    this.cargarOcupaciones();
  }

  // ===============================
  // CARGAS BASE
  // ===============================
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

  cargarManzanas(idSector: number): void {
    this.manzanasService.getManzanasBySector(idSector).subscribe({
      next: data => {
        this.manzanas = data;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error');
      }
    });
  }

  cargarOcupaciones(): void {
    this.loading = true;

    this.ocupacionesService.getOcupacionesActivas(this.page).subscribe({
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

  // ===============================
  // FILTROS REALES
  // ===============================
  aplicarFiltros(): void {
    this.loading = true;

    this.ocupacionesService.filtrarOcupaciones({
      sector: this.filtros.sector ?? undefined,
      manzana: this.filtros.manzana ?? undefined
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

  onManzanaChange(): void {
    this.aplicarFiltros();
  }

  // ===============================
  // CONTADORES DE LOS BADGES ((falta corregir para que se acualizen respectivamente los numeros reales))
  // ===============================
  get total(): number {
    return this.ocupaciones.length;
  }

  get ocupadas(): number {
    return this.disponible;
  }

  get mantenimiento(): number {
    return this.ocupaciones.length;
  }
  get disponible(): number {
    return this.ocupaciones.length;
  }
  get clausuradas(): number {
    return this.ocupaciones.length;
  }


  // ===============================
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
