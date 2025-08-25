import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NichosService } from '../../services/nicho.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NichoSeleccionadoService } from '../../services/nicho-seleccionado.service';
import { Nicho } from '../../models/nicho/nicho.module';

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


  constructor(
    public activeModal: NgbActiveModal,
    private nichosService: NichosService,
    private nichoSeleccionadoService: NichoSeleccionadoService
  ) { }

  buscar() {
    this.mensajeError = null;
    this.resultadoBusqueda = null;

    if (!this.cedula.trim()) {
      this.mensajeError = 'Por favor, ingrese una cédula.';
      return;
    }

    this.nichosService.buscarPorCedula(this.cedula).subscribe({
      next: (nichos) => {
        if (nichos.length > 0) {
          this.resultadoBusqueda = nichos;
          this.nichoSeleccionadoService.setSelectedNicho(nichos[0]);

        } else {
          this.mensajeError = 'No se encontró ninguna bóveda asociada a esta cédula.';
        }
      },
      error: (err) => {
        this.mensajeError = 'Ocurrió un error al buscar la bóveda.';
      }
    });
  }

  Anadir():void {}
  
  Editar():void {}
}