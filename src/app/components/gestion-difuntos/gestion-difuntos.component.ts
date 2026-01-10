import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Fallecido } from '../../models/fallecido.models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnadirDifuntoComponent } from '../anadir-difunto/anadir-difunto.component';
import { FallecidoService } from '../../services/fallecido.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-gestion-difuntos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './gestion-difuntos.component.html',
  styleUrls: ['./gestion-difuntos.component.css']
})
export class GestionDifuntosComponent {
  cedula: string = '';
  cedulaInvalida = false;
  cargando = false;
  resultadoBusqueda: Fallecido[] = [];
  mensajeError = '';

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) { }
  validarCedula() {
    this.cedulaInvalida = !/^[0-9]{10}$/.test(this.cedula);
  }

  // Función de búsqueda de difuntos por nombre
  buscar() {
    if (this.cedulaInvalida || !this.cedula) return;
    this.cargando = true;
    this.mensajeError = '';
    this.resultadoBusqueda = [];
  }
  abrirModalAnadir() {
    const modalRef = this.modalService.open(AnadirDifuntoComponent, { centered: true, size: 'lg' });

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
}
