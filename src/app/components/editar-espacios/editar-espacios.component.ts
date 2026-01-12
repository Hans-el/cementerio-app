import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';
import { BloquesService } from '../../services/bloques.service';
import Swal from 'sweetalert2';
import { EspacioService } from '../../services/espacio.service';


@Component({
  selector: 'app-editar-espacios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-espacios.component.html',
  styleUrl: './editar-espacios.component.css'
})
export class EditarEspaciosComponent implements OnInit {
  espacioEdit: any = {
    id_sector: null,
    id_manzana: null,
    id_bloque: null,
  };
  nuevosEspacios: any = {
    cantidad_espacios: null,
    id_tipo_espacio: 1,
  };

  sectores: any[] = [];
  manzanas: any[] = [];
  bloques: any[] = [];
  espacios: any[] = [];
  tiposEspacio: any[] = [
    { id_tipo_espacio: 1, nombre: 'BOVEDA' },
    { id_tipo_espacio: 2, nombre: 'NICHO' },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
    private bloquesService: BloquesService,
    private espacioService: EspacioService,
  ) { }

  ngOnInit(): void {
    this.cargarSectores();
  }

  cargarSectores(): void {
    this.sectoresService.getSectores().subscribe({
      next: (sectores) => {
        this.sectores = sectores;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los sectores', 'error');
      }
    });
  }

  onSectorChange(): void {
    if (!this.espacioEdit.id_sector) return;
    this.manzanasService.getManzanasid(this.espacioEdit.id_sector).subscribe({
      next: (manzanas) => {
        this.manzanas = manzanas;
        this.espacioEdit.id_manzana = null;
        this.bloques = [];
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error');
      }
    });
  }

  onManzanaChange(): void {
    if (!this.espacioEdit.id_manzana) return;
    this.bloquesService.getBloquesid(this.espacioEdit.id_manzana).subscribe({
      next: (bloques) => {
        this.bloques = bloques;
        this.espacioEdit.id_bloque = null;
        this.espacios = [];
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los bloques', 'error');
      }
    });
  }

  onBloqueChange(): void {
    if (!this.espacioEdit.id_bloque) return;
    this.espacioService.getEspacios(this.espacioEdit.id_bloque).subscribe({
      next: (espacios) => {
        this.espacios = espacios;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los espacios', 'error');
      }
    });
  }

  onSubmit(): void {
    if (!this.espacioEdit.id_bloque || !this.nuevosEspacios.cantidad_espacios) {
      Swal.fire('Error', 'Debes seleccionar un bloque y especificar la cantidad de espacios a añadir', 'error');
      return;
    }

    const request = {
      cantidad_espacios: this.nuevosEspacios.cantidad_espacios,
      id_tipo_espacio: this.nuevosEspacios.id_tipo_espacio,
    };

    this.bloquesService.anadirEspacios(this.espacioEdit.id_bloque, request).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Espacios añadidos correctamente', 'success');
        this.onBloqueChange(); // Recargar los espacios después de añadir nuevos
      },
      error: () => {
        Swal.fire('Error', 'Error al añadir espacios', 'error');
      }
    });
  }
}