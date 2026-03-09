import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';
import { BloquesService } from '../../services/bloques.service';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { environment } from '../../../environments/environment'; // Para acceder a la URL del API en el template

@Component({
  selector: 'app-disponibilidad-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disponibilidad-modal.component.html',
  styleUrls: ['./disponibilidad-modal.component.css'],
})
export class DisponibilidadModalComponent {
  userRole: string = 'Invitado'; // Valor por defecto si no inicia sesión
  @Input() admin: boolean = false; // Indica si el usuario es admin o no
  // Selectores
  sectores: any[] = [];
  manzanas: any[] = [];
  bloques: any[] = [];
  // Valores seleccionados
  selectedSector: number | null = null;
  selectedManzana: number | null = null;
  selectedBloque: number | null = null;
  environment = environment; // Para acceder a la URL del API en el template

  espaciosDisponibles: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
    private bloquesService: BloquesService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole(); // Obtiene el rol al inicializar, si sí es...
    this.cargarSectores(); //... carga los sectores. Luego de seleccionar sector y manzana se cargan los demás.
    this.cargarBloquesEnVenta(); // Carga los bloques en venta al iniciar el modal en caso de que sea admin
  }

  cargarSectores(): void {
    this.sectoresService.getSectores().subscribe({
      // Sin parámetros
      next: (sectores) => {
        this.sectores = sectores;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los sectores', 'error');
      },
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
      },
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
      },
    });
  }

  formatoDosDigitos(value: number | string): string {
    const strValue = value.toString();
    return strValue.length === 1 ? `0${strValue}` : strValue;
  }

  ponerEnVenta(): void {
    if (!this.selectedSector || !this.selectedManzana || !this.selectedBloque) {
      Swal.fire(
        'Error',
        'Por favor, seleccione un sector, manzana y bloque.',
        'error',
      );
      return;
    }
    //usamos sweetalert2 para pedir una descripcion del bloque
    Swal.fire({
      title: 'Descripción del Bloque',
      input: 'textarea',
      inputLabel: 'Ingrese una breve descripción del bloque',
      inputPlaceholder: 'Ej: Contacto para más información...',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar una descripción';
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const descripcion = result.value;
        const bloqueData = {
          id_bloque: this.selectedBloque,
          descripcion: descripcion,
        };

        this.bloquesService.ponerEnVenta(bloqueData).subscribe({
          next: () => {
            this.cargarBloquesEnVenta();
            Swal.fire('Éxito', 'El bloque ha sido puesto en venta.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'No se pudo poner el bloque en venta.', 'error');
          },
        });
      }
    });
  }

  cargarBloquesEnVenta(): void {
    this.bloquesService.getBloquesEnVenta().subscribe({
      next: (bloques) => {
        this.espaciosDisponibles = bloques.map((bloque) => ({
          id_bloque_venta: bloque.id_bloque_venta,
          sector: bloque.sector,
          manzana: bloque.numero_manzana,
          bloque: bloque.numero_bloque,
          descripcion: bloque.descripcion,
          imagenUrl: `${this.environment.apiUrl}/images/bloques/${this.formatoDosDigitos(bloque.sector)}${this.formatoDosDigitos(bloque.numero_manzana)}/${this.formatoDosDigitos(bloque.sector)}${this.formatoDosDigitos(bloque.numero_manzana)}${this.formatoDosDigitos(bloque.numero_bloque)}.jpg`,
        }));
      },
      //ponemos el error en un sweetalert2, pero dentro de un toast para que no moleste tanto al usuario, ya que no es algo tan grave como para mostrar un modal
      error: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'No se pudieron cargar los bloques en venta',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      },
    });
  }
  borrarBloqueEnVenta(id_bloque_venta: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#008f39 ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bloquesService.borrarBloqueEnVenta(id_bloque_venta).subscribe({
          next: () => {
            Swal.fire(
              '¡Borrado!',
              'El bloque ha sido eliminado de la venta.',
              'success',
            );
            this.cargarBloquesEnVenta(); // Recargar la lista de bloques en venta
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo borrar el bloque en venta.',
              'error',
            );
          },
        });
      }
    });
  }
  // Función para visualizar imagen en modal, usando ImageModalComponent que se usa tambiene en localizar
  visualizarImagen(imagenUrl: string): void {
    const modalRef = this.modalService.open(ImageModalComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.selectedImageUrl = imagenUrl;
  }
}
