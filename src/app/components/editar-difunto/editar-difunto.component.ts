import { Component } from '@angular/core';
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
  fallecido: Fallecido = {
    id_fallecido: 0,
    nombre_completo: '',
    fecha_fallecimiento: '',
    fecha_fallecimiento_raw: '',
    fecha_inhumacion: '',
    fecha_exhumacion: '',
    observaciones: ''
  };

  constructor(
    public activeModal: NgbActiveModal,
    private fallecidoService: FallecidoService
  ) { }

  guardarCambios(): void {
    this.fallecidoService.actualizarFallecido(this.fallecido.id_fallecido, this.fallecido).subscribe({
      next: (response) => {
        //alerta swal con toast en la esquina superior derecha, con el mensaje "Fallecido actualizado correctamente" y un icono de éxito
        Swal.fire({
          title: 'Fallecido actualizado correctamente',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        this.activeModal.close(this.fallecido); // Cerrar el modal y devolver el fallecido actualizado
      },
      error: () => {
        Swal.fire('Error', 'Error al actualizar el fallecido', 'error');
      }
    });
  }
}