import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';
import { BloquesService } from '../../services/bloques.service';
import { FallecidoService } from '../../services/fallecido.service';


@Component({
  selector: 'app-disponibilidad-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disponibilidad-modal.component.html',
  styleUrls: ['./disponibilidad-modal.component.css']
})
export class DisponibilidadModalComponent {
  userRole: string = 'Invitado'; // Valor por defecto si no inicia sesión
  @Input() admin: boolean = false;
  // Selectores
  sectores: any[] = [];
  manzanas: any[] = [];
  bloques: any[] = [];
  // Valores seleccionados
  selectedSector: number | null = null;
  selectedManzana: number | null = null;
  selectedBloque: number | null = null;

  espaciosDisponibles: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
    private bloquesService: BloquesService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole(); // Obtiene el rol al inicializar
    this.cargarSectores();
    this.cargarBloquesEnVenta();

  }

  cargarSectores(): void {
    this.sectoresService.getSectores().subscribe({ // Sin parámetros
      next: (sectores) => {
        this.sectores = sectores;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los sectores', 'error');
      }
    });
  }

  onSectorChange(): void {
    if (!this.selectedSector) return;
    this.manzanasService.getManzanasid(this.selectedSector).subscribe({
      next: (manzanas) => {
        this.manzanas = manzanas;
        this.selectedManzana = null;
        this.bloques = [];
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error');
      }
    });
  }

  onManzanaChange(): void {
    if (!this.selectedManzana) return;
    this.bloquesService.getBloquesid(this.selectedManzana).subscribe({
      next: (bloques) => {
        this.bloques = bloques;
        this.selectedBloque = null;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los bloques', 'error');
      }
    });
  }


  formatoDosDigitos(value: number | string): string {
    const strValue = value.toString();
    return strValue.length === 1 ? `0${strValue}` : strValue;
  }

  ponerEnVenta(): void {
    if (!this.selectedSector || !this.selectedManzana || !this.selectedBloque) {
      Swal.fire('Error', 'Por favor, seleccione un sector, manzana y bloque.', 'error');
      return;
    }

    Swal.fire({
      title: 'Descripción del Bloque',
      input: 'textarea',
      inputLabel: 'Ingrese una breve descripción del bloque',
      inputPlaceholder: 'Ej: Bloque con vista al jardín, recién renovado...',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar una descripción';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const descripcion = result.value;
        const bloqueData = {
          id_bloque: this.selectedBloque,
          descripcion: descripcion
        };

        this.bloquesService.ponerEnVenta(bloqueData).subscribe({
          next: () => {
            this.cargarBloquesEnVenta();
            Swal.fire('Éxito', 'El bloque ha sido puesto en venta.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'No se pudo poner el bloque en venta.', 'error');
          }
        });
      }
    });
  }

  cargarBloquesEnVenta(): void {
    this.bloquesService.getBloquesEnVenta().subscribe({
      next: (bloques) => {
        this.espaciosDisponibles = bloques.map(bloque => ({
          id_bloque_venta: bloque.id_bloque_venta,
          sector: bloque.sector,
          manzana: bloque.numero_manzana,
          bloque: bloque.numero_bloque,
          imagenUrl: `http://localhost:3000/images/bloques/${this.formatoDosDigitos(bloque.sector)}${this.formatoDosDigitos(bloque.numero_manzana)}/${this.formatoDosDigitos(bloque.sector)}${this.formatoDosDigitos(bloque.numero_manzana)}${this.formatoDosDigitos(bloque.numero_bloque)}.jpg`
        }));
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los bloques en venta.', 'error');
      }
    });
  }
  borrarBloqueEnVenta(id_bloque_venta: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bloquesService.borrarBloqueEnVenta(id_bloque_venta).subscribe({
          next: () => {
            Swal.fire('¡Borrado!', 'El bloque ha sido eliminado de la venta.', 'success');
            this.cargarBloquesEnVenta(); // Recargar la lista de bloques en venta
          },
          error: () => {
            Swal.fire('Error', 'No se pudo borrar el bloque en venta.', 'error');
          }
        });
      }
    });
  }

}