import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-anadir-boveda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anadir-boveda.component.html',
  styleUrl: './anadir-boveda.component.css'
})
export class AnadirBovedaComponent {
  @Output() guardar = new EventEmitter<any>();

  sectores: string[] = Array.from({ length: 40 }, (_, i) => (i + 1).toString()); // Simulamos sectores del 1 al 40 por ahora.

  // Objeto para almacenar los datos de la nueva bóveda. Esto lo definimos segun la base de datos que me de el señor, por ahora lo dejamos así. 
  // esto irá en /models/boveda.model.ts
  nuevaBoveda: any = {
    codigo: '',
    sector: '',
    capacidad: 1,
    estado: 'Disponible',
    actualizado: new Date().toISOString().split('T')[0]
  };

  constructor(public activeModal: NgbActiveModal) { }

  guardarNuevaBoveda() {
    // Validar campos antes de emitir el evento, en este caso solo verificamos que no estén vacíos
    if (!this.nuevaBoveda.codigo || !this.nuevaBoveda.ubicacion || this.nuevaBoveda.capacidad <= 0) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }   //usamos las alertas de swal para que se vea mejor al momento de guardar
    Swal.fire({
      title: '¿Guardar nueva bóveda?',
      text: "¿Desea guardar la nueva bóveda?",
      icon: 'warning',
      showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardar.emit(this.nuevaBoveda);
          this.activeModal.close();
        }
      });
    }
  }