import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FallecidoService } from '../../services/fallecido.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-traslado-fallecido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './traslado-fallecido.component.html',
  styleUrl: './traslado-fallecido.component.css',
})
export class TrasladoFallecidoComponent implements OnInit {
  nombreFallecido: string = '';
  fallecidoSeleccionado: any = null;
  sugerenciasFallecidos: any[] = [];
  destino: string = '';
  guardando: boolean = false;

  private searchTerms = new Subject<string>();

  constructor(
    public activeModal: NgbActiveModal,
    private fallecidoService: FallecidoService,
  ) {}

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.fallecidoService.buscarFallecidos(term),
        ),
      )
      .subscribe((fallecidos) => {
        this.sugerenciasFallecidos = fallecidos;
      });
  }

  buscarFallecido(): void {
    this.fallecidoSeleccionado = null;
    this.searchTerms.next(this.nombreFallecido);
  }

  seleccionarFallecido(fallecido: any): void {
    this.fallecidoSeleccionado = fallecido;
    this.nombreFallecido = fallecido.nombre_completo;
    this.sugerenciasFallecidos = [];
  }

  limpiarSeleccion(): void {
    this.fallecidoSeleccionado = null;
    this.nombreFallecido = '';
    this.destino = '';
  }

  guardarTraslado(): void {
    if (!this.fallecidoSeleccionado) {
      Swal.fire('Error', 'Debes seleccionar un fallecido.', 'warning');
      return;
    }
    if (!this.destino.trim()) {
      Swal.fire('Error', 'Debes indicar el destino del traslado.', 'warning');
      return;
    }

    Swal.fire({
      title: '¿Confirmar traslado?',
      html: `Se registrará el traslado de <strong>${this.fallecidoSeleccionado.nombre_completo}</strong> hacia:<br><strong>${this.destino}</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.guardando = true;
      this.fallecidoService
        .registrarTraslado(
          this.fallecidoSeleccionado.id_fallecido,
          this.destino.trim(),
        )
        .subscribe({
          next: () => {
            this.guardando = false;
            Swal.fire(
              'Registrado',
              'El traslado fue registrado correctamente.',
              'success',
            );
            this.activeModal.close();
          },
          error: (err) => {
            this.guardando = false;
            Swal.fire(
              'Error',
              err.error?.message || 'No se pudo registrar el traslado.',
              'error',
            );
          },
        });
    });
  }
}
