import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Fallecido } from '../../models/fallecido.models';
import { AnadirDifuntoComponent } from '../anadir-difunto/anadir-difunto.component';
import Swal from 'sweetalert2';
import { EditarEspacioFallecidoComponent } from '../editar-espacio-fallecido/editar-espacio-fallecido.component';

@Component({
  selector: 'app-gestion-difuntos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './gestion-difuntos.component.html',
  styleUrls: ['./gestion-difuntos.component.css'],
})
export class GestionDifuntosComponent {
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) {}
  abrirModalAnadir() {
    const modalRef = this.modalService.open(AnadirDifuntoComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.guardar.subscribe((nuevo: Fallecido) => {
      Swal.fire({
        icon: 'success',
        title: 'Difunto añadido',
        text: `${nuevo.nombre_completo} ha sido registrado correctamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
    });
  }

  abrirModalEditar(): void {
    const modalRef = this.modalService.open(EditarEspacioFallecidoComponent, {
      centered: true,
      size: 'lg',
    });
  }
}
