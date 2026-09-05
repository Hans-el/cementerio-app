import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';
import { BloquesService } from '../../services/bloques.service';
import { ImageModalComponent } from '../../../../shared/components/image-modal/image-modal.component';
import { AuthService } from '../../../auth/services/auth.service';
import Swal from 'sweetalert2';

const CORREO_INSTITUCION = 'coloncementerio@gmail.com';

@Component({
  selector: 'app-adquisicion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adquisicion.component.html',
  styleUrl: './adquisicion.component.css',
})
export class AdquisicionComponent implements OnInit {
  userRole = 'Invitado';
  cargando = true;

  // Selectores — solo admin
  sectores: any[] = [];
  manzanas: any[] = [];
  bloques: any[] = [];

  selectedSector: number | null = null;
  selectedManzana: number | null = null;
  selectedBloque: number | null = null;

  mostrarFormAdmin = false;

  // Filtro de búsqueda en la grilla
  filtroTexto = '';

  espaciosDisponibles: any[] = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
    private bloquesService: BloquesService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.cargarBloquesEnVenta();

    if (this.esAdmin) {
      this.cargarSectores();
    }
  }

  get esAdmin(): boolean {
    return this.userRole === 'admin' || this.userRole === 'superadmin';
  }

  get espaciosFiltrados(): any[] {
    if (!this.filtroTexto.trim()) return this.espaciosDisponibles;
    const t = this.filtroTexto.toLowerCase();
    return this.espaciosDisponibles.filter(
      (e) =>
        e.codigo.toLowerCase().includes(t) ||
        e.descripcion?.toLowerCase().includes(t),
    );
  }

  // ── Admin — formulario para poner en venta ────────────────

  toggleFormAdmin(): void {
    this.mostrarFormAdmin = !this.mostrarFormAdmin;
  }

  cargarSectores(): void {
    this.sectoresService.getSectores().subscribe({
      next: (sectores) => {
        this.sectores = sectores;
      },
      error: () =>
        Swal.fire('Error', 'No se pudieron cargar los sectores', 'error'),
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
      error: () =>
        Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error'),
    });
  }

  onManzanaChange(): void {
    if (!this.selectedManzana) return;
    this.bloquesService.getBloquesid(this.selectedManzana).subscribe({
      next: (bloques) => {
        this.bloques = bloques;
        this.selectedBloque = null;
      },
      error: () =>
        Swal.fire('Error', 'No se pudieron cargar los bloques', 'error'),
    });
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

    Swal.fire({
      title: 'Descripción del Bloque',
      input: 'textarea',
      inputLabel: 'Ingrese una breve descripción del bloque',
      inputPlaceholder:
        'Ej: Espacio disponible, contactar para más información...',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
      inputValidator: (value) =>
        !value ? 'Debe ingresar una descripción' : null,
    }).then((result) => {
      if (!result.isConfirmed) return;

      const bloqueData = {
        id_bloque: this.selectedBloque,
        descripcion: result.value,
      };

      this.bloquesService.ponerEnVenta(bloqueData).subscribe({
        next: () => {
          this.cargarBloquesEnVenta();
          this.mostrarFormAdmin = false;
          this.selectedSector =
            this.selectedManzana =
            this.selectedBloque =
              null;
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Bloque puesto en venta correctamente.',
            timer: 2500,
            showConfirmButton: false,
          });
        },
        error: () =>
          Swal.fire('Error', 'No se pudo poner el bloque en venta.', 'error'),
      });
    });
  }

  // ── Listado de espacios disponibles ────────────────────────

  cargarBloquesEnVenta(): void {
    this.cargando = true;
    this.bloquesService.getBloquesEnVenta().subscribe({
      next: (bloques) => {
        this.espaciosDisponibles = bloques.map((bloque) => ({
          id_bloque_venta: bloque.id_bloque_venta,
          sector: bloque.sector,
          manzana: bloque.numero_manzana,
          bloque: bloque.numero_bloque,
          codigo: `${this.formatoDosDigitos(bloque.sector)}.${this.formatoDosDigitos(bloque.numero_manzana)}.${this.formatoDosDigitos(bloque.numero_bloque)}`,
          descripcion: bloque.descripcion,
          imagenUrl: '',
          cargandoImg: true,
        }));

        this.cargando = false;

        this.espaciosDisponibles.forEach((espacio) => {
          const s = String(espacio.sector).padStart(2, '0');
          const m = String(espacio.manzana).padStart(2, '0');
          const b = String(espacio.bloque).padStart(2, '0');

          this.bloquesService.getFotoBloque(s, m, b).subscribe({
            next: (response) => {
              espacio.imagenUrl = response.foto_url ?? '';
              espacio.cargandoImg = false;
            },
            error: () => {
              espacio.imagenUrl = '';
              espacio.cargandoImg = false;
            },
          });
        });
      },
      error: () => {
        this.cargando = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'No se pudieron cargar los espacios disponibles',
          timer: 3000,
          showConfirmButton: false,
        });
      },
    });
  }

  formatoDosDigitos(value: number | string): string {
    const strValue = value.toString();
    return strValue.length === 1 ? `0${strValue}` : strValue;
  }

  // ── Acciones por card ───────────────────────────────────────

  localizarEnMapa(espacio: any): void {
    this.router.navigate(['/mapa'], {
      queryParams: {
        sector: espacio.sector,
        manzana: espacio.manzana,
      },
    });
  }

  visualizarImagen(imagenUrl: string): void {
    if (!imagenUrl) {
      Swal.fire(
        'Sin imagen',
        'Este bloque no tiene una imagen disponible.',
        'info',
      );
      return;
    }
    const modalRef = this.modalService.open(ImageModalComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.selectedImageUrl = imagenUrl;
  }

  contactarDueno(espacio: any): void {
    const asunto = encodeURIComponent(
      `Consulta sobre espacio disponible ${espacio.codigo}`,
    );
    const cuerpo = encodeURIComponent(
      `Hola,\n\nEstoy interesado/a en el espacio con código ${espacio.codigo}.\n\n` +
        `Descripción: ${espacio.descripcion}\n\n` +
        `Quisiera solicitar más información y agendar una revisión.\n\nGracias.`,
    );
    window.location.href = `mailto:${CORREO_INSTITUCION}?subject=${asunto}&body=${cuerpo}`;
  }

  borrarBloqueEnVenta(id_bloque_venta: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2d5a27',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.bloquesService.borrarBloqueEnVenta(id_bloque_venta).subscribe({
        next: () => {
          Swal.fire(
            'Eliminado',
            'El espacio fue retirado de la venta.',
            'success',
          );
          this.cargarBloquesEnVenta();
        },
        error: () =>
          Swal.fire('Error', 'No se pudo eliminar el espacio.', 'error'),
      });
    });
  }
}
