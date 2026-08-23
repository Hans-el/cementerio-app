import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditarEspacioFallecidoComponent } from '../editar-espacio-fallecido/editar-espacio-fallecido.component';
import { TrasladoFallecidoComponent } from '../traslado-fallecido/traslado-fallecido.component';

@Component({
  selector: 'app-seleccionar-accion-exhumacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seleccionar-accion-exhumacion.component.html',
  styleUrl: './seleccionar-accion-exhumacion.component.css',
})
export class SeleccionarAccionExhumacionComponent {
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) {}

  elegirEditarEspacio(): void {
    this.activeModal.close();
    this.modalService.open(EditarEspacioFallecidoComponent, {
      centered: true,
      size: 'lg',
    });
  }

  elegirTraslado(): void {
    this.activeModal.close();
    this.modalService.open(TrasladoFallecidoComponent, {
      centered: true,
      size: 'lg',
    });
  }
}
