import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';
import { BloquesService } from '../../services/bloques.service';
import { EspacioService } from '../../services/espacio.service';
import { FallecidoService } from '../../services/fallecido.service';

@Component({
  selector: 'app-anadir-difunto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anadir-difunto.component.html',
  styleUrls: ['./anadir-difunto.component.css']
})
export class AnadirDifuntoComponent implements OnInit {
  // Datos del difunto
  nuevoDifunto: any = {
    nombre_completo: '',
    fecha_fallecimiento: null,
    fecha_inhumacion: null,
    fecha_exhumacion: null,
    observaciones: '',
    id_espacio: null
  };

  // Selectores
  sectores: any[] = [];
  manzanas: any[] = [];
  bloques: any[] = [];
  espacios: any[] = [];

  // Valores seleccionados
  selectedSector: number | null = null;
  selectedManzana: number | null = null;
  selectedBloque: number | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
    private bloquesService: BloquesService,
    private espacioService: EspacioService,
    private fallecidoService: FallecidoService
  ) { }

  ngOnInit(): void {
    this.cargarSectores();
  }

  cargarSectores(): void {
    this.sectoresService.getSectores().subscribe({ // Sin parámetros
      next: (sectores) => {
        this.sectores = sectores;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los sectores', 'error');
      }
    });
  }

  onSectorChange(): void {
    if (!this.selectedSector) return;
    this.manzanasService.getManzanasid(this.selectedSector).subscribe({
      next: (manzanas) => {
        this.manzanas = manzanas;
        this.selectedManzana = null;
        this.bloques = [];
        this.espacios = [];
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error');
      }
    });
  }

  onManzanaChange(): void {
    if (!this.selectedManzana) return;
    this.bloquesService.getBloquesid(this.selectedManzana).subscribe({
      next: (bloques) => {
        this.bloques = bloques;
        this.selectedBloque = null;
        this.espacios = [];
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los bloques', 'error');
      }
    });
  }

  onBloqueChange(): void {
    if (!this.selectedBloque) return;
    this.espacioService.getEspacios(this.selectedBloque).subscribe({
      next: (espacios) => {
        this.espacios = espacios;
      },
      error: (err) => {
        console.error('Error al cargar espacios:', err);
        Swal.fire('Error', 'No se pudieron cargar los espacios', 'error');
      }
    });
  }


  onSubmit(): void {
    if (!this.nuevoDifunto.nombre_completo || !this.nuevoDifunto.id_espacio) {
      Swal.fire('Error', 'Nombre completo y espacio son obligatorios', 'error');
      return;
    }

    //usamos swal para preguntar si realmente quiere guardar el registro
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres guardar este registro?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.fallecidoService.crearFallecido(this.nuevoDifunto).subscribe({
          next: (response) => {
            Swal.fire('Éxito', 'Difunto registrado correctamente', 'success');
            this.activeModal.close(this.nuevoDifunto);
          },
          error: () => {
            Swal.fire('Error', 'Error al registrar el difunto', 'error');
          }
        });
      }
    });
  }
}
