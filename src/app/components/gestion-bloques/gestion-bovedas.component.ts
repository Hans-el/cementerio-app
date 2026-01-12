import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Nicho } from '../../models/nicho.model'
import { AnadirBovedaComponent } from '../anadir-bloque/anadir-boveda.component';
import { EditarEspaciosComponent } from '../editar-espacios/editar-espacios.component';
import { AnadirManzanaComponent } from '../anadir-manzana/anadir-manzana.component';

@Component({
  selector: 'app-gestion-bovedas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './gestion-bovedas.component.html',
  styleUrl: './gestion-bovedas.component.css'
})
export class GestionBovedasComponent {
  cedula: string = '';
  resultadoBusqueda: Nicho[] | null = null; // Resultado de la búsqueda
  mensajeError: string | null = null; // Mensaje de error si no se encuentra nada
  cedulaInvalida: boolean = false; //para validar que la cédula tenga 10 dígitos
  cargando: boolean = false; // Indicador de carga para mejor UX



  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }


  //Funciones para abrir los modales correspondientes a cada botón
  //1. Abrimos el modal de añadir manzana
  abrirModalAnadirManzana(): void {
    const modalRef = this.modalService.open(AnadirManzanaComponent);
    modalRef.result.then((result) => {
      console.log('manzanas cargadas:', result);
    }).catch((error) => {
      console.log('Modal cerrado sin acción');
    });
  }
  //2. Abrimos el modal de añadir bloques
  abrirModalAnadirBloque(): void {
    const modalRef = this.modalService.open(AnadirBovedaComponent);
    modalRef.result.then((result) => {
      console.log('bloques cargados:', result);
    }).catch((error) => {
      console.log('Modal cerrado sin acción');
    });
  }
  //3. Abrimos el modal de editar espacios
  abrirModalEditarEspacio() {
    const modalRef = this.modalService.open(EditarEspaciosComponent, { size: 'lg' });
    modalRef.result.then((result) => {
      console.log('espacios cargados:', result);
    }).catch((error) => {
      console.log('Modal cerrado sin acción');
    });
  }
}