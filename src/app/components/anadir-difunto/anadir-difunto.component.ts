import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Difunto } from '../../models/difunto.model';


@Component({
  selector: 'app-anadir-difunto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anadir-difunto.component.html',
  styleUrl: './anadir-difunto.component.css'
})
export class AnadirDifuntoComponent {
  @Output() guardar = new EventEmitter<Difunto>();
  difunto: Difunto = {
    id: 0,
    nombreCompleto: '',
    cedula: '',
    genero: 'Masculino',
    fechaNacimiento: '',
    fechaFallecimiento: '',
    causaFallecimiento: '',
    observaciones: ''
  };

  constructor(public activeModal: NgbActiveModal) { }

  guardarNuevoDifunto() {
    if (
      !this.difunto.nombreCompleto ||
      !this.difunto.cedula ||
      !this.difunto.genero ||
      !this.difunto.fechaNacimiento ||
      !this.difunto.fechaFallecimiento
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, complete todos los campos obligatorios.',
      });
      return;
    }

    Swal.fire({
      title: '¿Guardar nuevo difunto?',
      text: '¿Desea guardar el registro de este difunto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.guardar.emit(this.difunto);
        this.activeModal.close();
        Swal.fire({
          icon: 'success',
          title: 'Guardado exitosamente',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }
}
