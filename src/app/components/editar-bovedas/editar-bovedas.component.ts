import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NichosService } from '../../services/nicho.service'; //con la finalidad de traer los sectores desde la base de datos


@Component({
  selector: 'app-editar-bovedas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-bovedas.component.html',
  styleUrl: './editar-bovedas.component.css'
})
export class EditarBovedasComponent {
  sectores: string[] = ['1', '2', '3', '4']; // estos sectores deben ser traidos desde la base de datos, que son como 50 aprox.
  @Input() boveda: any; // Con esto recibimos la bóveda a editar
  @Output() guardar = new EventEmitter<any>(); // Un evento para guardar los cambios

  constructor(public activeModal: NgbActiveModal, private nichosService: NichosService) { }

  //funcion para guardar los cambios y cerrar el modal
  // ponemos una aletrta de swal para que se vea mejor. 
  guardarCambios() {
    Swal.fire({
      title: '¿Guardar cambios?',
      text: "¿Desea guardar los cambios realizados?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.guardar.emit(this.boveda);
        // this.activeModal.close(); //cerramos el modal automaticamente al guardar.
      }
    });
  }
}