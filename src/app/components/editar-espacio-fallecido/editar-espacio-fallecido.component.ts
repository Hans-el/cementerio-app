import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';
import { BloquesService } from '../../services/bloques.service';
import { EspacioService } from '../../services/espacio.service';
import { FallecidoService } from '../../services/fallecido.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-espacio-fallecido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-espacio-fallecido.component.html',
  styleUrl: './editar-espacio-fallecido.component.css',
})
export class EditarEspacioFallecidoComponent {
  nombreFallecido: string = '';
  fallecidoSeleccionado: any = null;
  sugerenciasFallecidos: any[] = [];
  environment = environment; // Para acceder a la URL del API en el template

  sectores: any[] = [];
  nuevasManzanas: any[] = [];
  nuevosBloques: any[] = [];
  nuevosEspacios: any[] = [];

  nuevoSector: number = 0;
  nuevaManzana: number = 0;
  nuevoBloque: number = 0;
  nuevoEspacio: number = 0;

  private searchTerms = new Subject<string>();

  constructor(
    public activeModal: NgbActiveModal,
    private fallecidoService: FallecidoService,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
    private bloquesService: BloquesService,
    private espaciosService: EspacioService,
  ) {}

  ngOnInit(): void {
    this.cargarSectores();
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

  cargarSectores(): void {
    this.sectoresService.getSectores().subscribe((sectores) => {
      this.sectores = sectores;
    });
  }

  buscarFallecido(): void {
    this.searchTerms.next(this.nombreFallecido);
  }

  seleccionarFallecido(fallecido: any): void {
    this.fallecidoSeleccionado = {
      id_fallecido: fallecido.id_fallecido,
      nombre_completo: fallecido.nombre_completo,
      codigo_bloque: fallecido.codigo_bloque,
      sector: fallecido.codigo_bloque.split('.')[0],
      manzana: fallecido.codigo_bloque.split('.')[1],
      bloque: fallecido.codigo_bloque.split('.')[2],
      espacio: fallecido.numero,
    };
    this.sugerenciasFallecidos = [];
  }

  onNuevoSectorChange(): void {
    this.nuevaManzana = 0;
    this.nuevoBloque = 0;
    this.nuevoEspacio = 0;
    this.nuevasManzanas = [];
    this.nuevosBloques = [];
    this.nuevosEspacios = [];

    if (this.nuevoSector) {
      this.manzanasService
        .getManzanasid(this.nuevoSector)
        .subscribe((manzanas) => {
          this.nuevasManzanas = manzanas;
        });
    }
  }

  onNuevaManzanaChange(): void {
    this.nuevoBloque = 0;
    this.nuevoEspacio = 0;
    this.nuevosBloques = [];
    this.nuevosEspacios = [];

    if (this.nuevaManzana) {
      this.bloquesService
        .getBloquesid(this.nuevaManzana)
        .subscribe((bloques) => {
          this.nuevosBloques = bloques;
        });
    }
  }

  onNuevoBloqueChange(): void {
    this.nuevoEspacio = 0;
    this.nuevosEspacios = [];

    if (this.nuevoBloque) {
      this.espaciosService
        .getEspacios(this.nuevoBloque)
        .subscribe((espacios) => {
          this.nuevosEspacios = espacios;
        });
    }
  }

  formatoDosDigitos(value: number | string): string {
    const strValue = value.toString();
    return strValue.length === 1 ? `0${strValue}` : strValue;
  }
  //usamos Swal alert para mostrar mensajes de éxito o error al guardar los cambios. En caso de éxito, se cierra el modal y se muestra un mensaje de confirmación. En caso de error, se muestra un mensaje con el detalle del error.
  guardarCambios(): void {
    if (!this.fallecidoSeleccionado || !this.nuevoEspacio) {
      Swal.fire(
        'Error',
        'Por favor, seleccione un fallecido y un nuevo espacio.',
        'error',
      );
      return;
    }

    const data = {
      id_fallecido: this.fallecidoSeleccionado.id_fallecido,
      id_espacio_nuevo: this.nuevoEspacio,
    };

    Swal.fire({
      title: '¿Confirmar cambio de espacio?',
      text: `¿Desea cambiar el espacio del fallecido ${this.fallecidoSeleccionado.nombre_completo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fallecidoService.editarEspacioFallecido(data).subscribe({
          next: () => {
            Swal.fire(
              'Éxito',
              'El espacio del fallecido ha sido actualizado correctamente.',
              'success',
            );
            this.activeModal.close();
          },
          error: (error) => {
            let errorMessage =
              'No se pudo actualizar el espacio del fallecido.';
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            Swal.fire('Error', errorMessage, 'error');
          },
        });
      }
    });
  }
}
