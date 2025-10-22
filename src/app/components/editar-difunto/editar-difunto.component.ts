import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FallecidoService } from '../../services/fallecido.service';
import Swal from 'sweetalert2';
import { NichosService } from '../../services/nicho.service'; //con la finalidad de traer los sectores desde la base de datos


@Component({
  selector: 'app-editar-difunto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-difunto.component.html',
  styleUrl: './editar-difunto.component.css'
})
export class EditarDifuntoComponent {
  @Input() difunto: any;
  @Output() guardar = new EventEmitter<any>(); // Un evento para guardar los cambios
  cargandoBovedas = false;
  listaBovedas: any[] = [];


  constructor(
    public activeModal: NgbActiveModal,
    private fallecidoService: FallecidoService,
    private nichoService: NichosService
  ) { }

  cargarBovedas(): void {
    this.cargandoBovedas = true;

    this.nichoService.getNichos().subscribe({
      next: (data) => {
        this.listaBovedas = data;
        this.cargandoBovedas = false;
      },
      error: (err) => {
        console.error('Error al cargar bóvedas:', err);
        this.cargandoBovedas = false;
      }
    });
  }
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
          this.guardar.emit(this.difunto);
          // this.activeModal.close(); //cerramos el modal automaticamente al guardar.
        }
      });
    }
  }
