import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anadir-manzana',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anadir-manzana.component.html',
  styleUrl: './anadir-manzana.component.css'
})
export class AnadirManzanaComponent implements OnInit {
  // Modelo para la nueva manzana
  nuevaManzana: any = {
    id_sector: null,
    numero_manzana: null,
    descripcion: '',
  };
  // Listas para los selectores
  sectores: any[] = [];
  manzanas: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
  ) { }

  ngOnInit(): void {
    this.cargarSectores();
  }

  // Cargar sectores para el selector, traemos todos porque son solo dos
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
  // Cuando el sector es seleccionado, cargamos las manzanas de ese sector
  onSectorChange(): void {
    if (!this.nuevaManzana.id_sector) return;
    this.manzanasService.getManzanasid(this.nuevaManzana.id_sector).subscribe({
      next: (manzanas) => {
        this.manzanas = manzanas;
        this.nuevaManzana.numero_manzana = this.obtenerSiguienteNumeroManzana();
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error');
      }
    });
  }

  // Obtener el siguiente número de manzana disponible, no los antes existentes.
  // Es decir, el ultimo número + 1
  obtenerSiguienteNumeroManzana(): number {
    if (this.manzanas.length === 0) {
      return 1;
    }
    const numerosManzana = this.manzanas.map(manzana => manzana.numero_manzana);
    const maxNumeroManzana = Math.max(...numerosManzana);
    return maxNumeroManzana + 1;
  }

  // Enviar el formulario para crear la nueva manzana
  onSubmit(): void {
    if (!this.nuevaManzana.id_sector || !this.nuevaManzana.numero_manzana) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    this.manzanasService.createManzana(this.nuevaManzana).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Manzana creada correctamente', 'success');
        this.activeModal.close(response);
      },
      error: () => {
        Swal.fire('Error', 'Error al crear la manzana', 'error');
      }
    });
  }
}
