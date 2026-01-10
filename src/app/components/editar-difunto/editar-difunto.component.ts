import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Fallecido } from '../../models/fallecido.models';
import { FallecidoService } from '../../services/fallecido.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-editar-difunto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-difunto.component.html',
  styleUrls: ['./editar-difunto.component.css']
})
export class EditarDifuntoComponent {
  @Input() fallecido: Fallecido = {
    id_fallecido: 0,
    nombre_completo: '',
    fecha_fallecimiento: null,
    fecha_fallecimiento_raw: '',
    fecha_inhumacion: null,
    fecha_exhumacion: null,
    observaciones: null
  };

  constructor(
    public activeModal: NgbActiveModal,
    private fallecidoService: FallecidoService
  ) { }

  guardarCambios(): void {
    // Llamar directamente al servicio para actualizarlo
    this.fallecidoService.actualizarFallecido(this.fallecido.id_fallecido, this.fallecido).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Fallecido actualizado correctamente', 'success');
        this.activeModal.close(true); // Cerrar el modal y notificar éxito
      },
      error: () => {
        Swal.fire('Error', 'Error al actualizar el fallecido', 'error');
      }
    });
  }
}
