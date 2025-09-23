import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NichosService } from '../../services/nicho.service';
import { Nicho } from '../../models/nicho.model'; //El modelo de Nicho en donde definimos la estructura de los datos, es decir, todos los campos que tiene un nicho.
import { CommonModule } from '@angular/common';
import { NichoSeleccionadoService } from '../../services/nicho-seleccionado.service';
import { DisponibilidadModalComponent } from '../disponibilidad-modal/disponibilidad-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-localizar-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './localizar-modal.component.html',
  styleUrls: ['./localizar-modal.component.css']
})
export class LocalizarModalComponent {
  cedula: string = '';
  resultadoBusqueda: Nicho[] | null = null; // Resultado de la búsqueda
  mensajeError: string | null = null; // Mensaje de error si no se encuentra nada
  cargando: boolean = false; // Indicador de carga para mejor UX
  cedulaInvalida: boolean = false; // Indicador de cédula inválida

  constructor(
    public activeModal: NgbActiveModal,
    private nichosService: NichosService,
    private nichoSeleccionadoService: NichoSeleccionadoService,
    private modalService: NgbModal // Servicio para abrir modales
  ) { }


  validarCedula(): void {
    // Permite que el usuario escriba, pero marca como inválido si no son 10 dígitos
    this.cedulaInvalida = this.cedula.length > 0 && !/^\d{10}$/.test(this.cedula);
  }

  openDisponibilidadModal() { // Abre el modal de disponibilidad que está puesto en el localizar para agilizar la adquisición de una bóveda
    this.modalService.open(DisponibilidadModalComponent, { centered: true, size: 'lg' });
  }
  buscar(): void {
    if (this.cedulaInvalida || !this.cedula.trim()) {
      this.mensajeError = this.cedulaInvalida
        ? 'La cédula debe tener 10 dígitos numéricos.'
        : 'Por favor, ingrese una cédula.';
      return;
    }

    this.cargando = true;
    this.mensajeError = null;
    this.resultadoBusqueda = null;

    this.nichosService.buscarPorCedula(this.cedula).subscribe({
      next: (nichos) => {
        this.cargando = false;
        if (nichos.length > 0) {
          this.resultadoBusqueda = nichos;
          this.nichoSeleccionadoService.setSelectedNicho(nichos[0]);
        } else {
          this.mensajeError = 'No se encontró ninguna bóveda asociada a esta cédula.';
        }
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = 'Ocurrió un error al buscar la bóveda.';
      }
    });
  }
}