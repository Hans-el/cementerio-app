import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';
import { BloquesService } from '../../services/bloques.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anadir-espacios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anadir-espacios.component.html',
  styleUrl: './anadir-espacios.component.css'
})
export class AnadirEspaciosComponent implements OnInit {
  nuevoEspacio: any = {
    id_sector: null,
    id_manzana: null,
    id_bloque: null,
    cantidad_espacios: null,
    id_tipo_espacio: 1, // Valor por defecto, por ejemplo, "Bóveda"
  };

  sectores: any[] = [];
  manzanas: any[] = [];
  bloques: any[] = [];
  //Solo contemplamos las dos opciones porque cruz ya no lo permite según el señor
  tiposEspacio: any[] = [
    { id_tipo_espacio: 1, nombre: 'Bóveda' },
    { id_tipo_espacio: 2, nombre: 'Nicho' },
  ];


  constructor(public activeModal: NgbActiveModal,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
    private bloquesService: BloquesService
  ) { }

  // Al inicializar el componente, cargamos los sectores disponibles
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
    if (!this.nuevoEspacio.id_sector) return;
    this.manzanasService.getManzanasid(this.nuevoEspacio.id_sector).subscribe({
      next: (manzanas) => {
        this.manzanas = manzanas;
        this.nuevoEspacio.id_manzana = null;
        this.bloques = [];
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error');
      }
    });
  }

  onManzanaChange(): void {
    if (!this.nuevoEspacio.id_manzana) return;
    this.bloquesService.getBloquesid(this.nuevoEspacio.id_manzana).subscribe({
      next: (bloques) => {
        this.bloques = bloques;
        this.nuevoEspacio.id_bloque = null;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los bloques', 'error');
      }
    });
  }

  // Función para manejar el envío del formulario
  // usamos swal para mostrar mensajes de éxito o error para que se vea mejor
  onSubmit(): void {
    if (!this.nuevoEspacio.id_bloque || !this.nuevoEspacio.cantidad_espacios) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    this.bloquesService.anadirEspacios(this.nuevoEspacio.id_bloque, this.nuevoEspacio).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Espacios añadidos correctamente', 'success');
        this.activeModal.close(response);
      },
      error: () => {
        Swal.fire('Error', 'Error al añadir espacios', 'error');
      }
    });
  }
}

