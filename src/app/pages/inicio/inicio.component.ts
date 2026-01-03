import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { OcupacionesService } from '../../services/ocupaciones.service';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';

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

  loading = false;

  // ===============================
  // FILTROS
  // ===============================
  filtros = {
    busqueda: '',
    sector: '',
    manzana: ''
  };

  // ===============================
  // AUTOCOMPLETE
  // ===============================
  busqueda$ = new Subject<string>();
  sugerencias: any[] = [];
  mostrarSugerencias = false;

  // ===============================
  // PAGINACIÓN
  // ===============================
  page = 1;
  limit = 30;

  constructor(
    private ocupacionesService: OcupacionesService,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService
  ) { }

  // ===============================
  // INIT
  // ===============================
  ngOnInit(): void {
    this.cargarSectores(); // para cargar los sectores al iniciar, ya está hecho
    this.cargarOcupaciones();

    this.busqueda$
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(valor => {
        if (valor.length < 2) {
          this.sugerencias = [];
          this.mostrarSugerencias = false;
          return;
        }

        this.ocupacionesService.autocomplete(valor)
          .subscribe(data => {
            this.sugerencias = data;
            this.mostrarSugerencias = true;
          });
      });
  }


  // Carga los sectores desde el servicio SectoresService y los asigna a la propiedad 'sectores'.
  // ya está hecho
  cargarSectores() {
    this.sectoresService.obtenerSectores().subscribe({
      next: (data) => {
        console.log('Sectores cargados:', data);
        this.sectores = data;
      },
      error: (err) => {
        console.error('Error cargando sectores', err);
      }
    });
  }

  // Carga las manzanas desde el servicio ManzanasService y los asigna a la propiedad 'manzanas'.
  // no está hecho aun del todo (pendiente de implementar el servicio)
  cargarManzanas(idSector: number): void {
    (this.manzanasService as any).getManzanasBySector(idSector).subscribe({
      next: (data: any) => this.manzanas = data,
      error: () => Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error')
    });
  }

  cargarOcupaciones(): void {
    this.loading = true;

    this.ocupacionesService.getOcupacionesActivas(this.page)
      .subscribe({
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
  // FILTROS
  // ===============================
  buscar(): void {
    this.loading = true;

    this.ocupacionesService.buscarOcupaciones({
      busqueda: this.filtros.busqueda,
      sector: this.filtros.sector,
      manzana: this.filtros.manzana
    }).subscribe({
      next: data => {
        this.ocupaciones = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Error al aplicar los filtros', 'error');
      }
    });
  }

  onBuscarChange(valor: string): void {
    this.busqueda$.next(valor);
  }

  onSectorChange(): void {
    if (!this.filtros.sector) {
      this.manzanas = [];
      this.filtros.manzana = '';
      this.buscar();
      return;
    }

    this.cargarManzanas(Number(this.filtros.sector));
    this.buscar();
  }

  seleccionarSugerencia(texto: string): void {
    this.filtros.busqueda = texto;
    this.mostrarSugerencias = false;
    this.buscar();
  }

  // ===============================
  // CONTADORES
  // ===============================
  get total(): number {
    return this.ocupaciones.length;
  }

  get ocupadas(): number {
    return this.ocupaciones.length;
  }

  // ===============================
  // ACCIONES
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
}
