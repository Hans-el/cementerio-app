import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EspacioService } from '../../services/espacio.service';
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
    id_bloque: null,
    cantidad_espacios: null,
    id_tipo_espacio: null,
  };

  tiposEspacio: any[] = [{ id_tipo_espacio: 1, nombre: 'Bóveda' }, { id_tipo_espacio: 2, nombre: 'Nicho' }];
  constructor(public activeModal: NgbActiveModal,
    private espacioService: EspacioService,
    private bloquesService: BloquesService,

  ) { }
  ngOnInit(): void {
  }
  onSubmit(): void {
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

