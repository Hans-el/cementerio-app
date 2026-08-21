import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OcupacionesService } from '../../services/ocupaciones.service';
import { SectoresService } from '../../services/sectores.service';
import { ManzanasService } from '../../services/manzanas.service';
import { BloquesService } from '../../services/bloques.service';
import { Ocupacion } from '../../models/ocupacion.model';
import { EspacioService } from '../../services/espacio.service';
import { CementerioService } from '../../../../features/publico/services/cementerio.service';
import * as QRCode from 'qrcode';
import { GestionBovedasComponent } from '../../components/gestion-bloques/gestion-bovedas.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule, NgbPaginationModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  fechaActual: Date = new Date(); // Variable para mostrar la fecha actual en el HTML
  ocupaciones: Ocupacion[] = [];
  sectores: any[] = [];
  manzanas: any[] = [];
  bloques: any[] = [];
  loading = false;
  ocupacionesAgrupadas: any[] = []; // Variable para almacenar los fallecidos agrupados por numero de espacio
  //propiedas para subir imagenes
  imagenBloqueUrl: string = '';
  imagenError: boolean = false;
  qrUrl: string = '';
  // Resumen de espacios para los badges
  resumenEspacios: {
    bovedas: number;
    nichos: number;
    cruces: number;
    lote: number;
  } = {
    bovedas: 0,
    nichos: 0,
    cruces: 0,
    lote: 0,
  };
  // FILTROS (Se inicializan como vacíos o nulos para que no apliquen al cargar la página)
  filtros = {
    busqueda: '',
    sector: null as number | null,
    manzana: null as number | null,
    bloque: null as number | null,
  };
  // PAGINACIÓN (De 50 en 50)
  page: number = 1;
  limit: number = 50;
  totalOcupaciones: number = 0;
  totalPages: number = 0;

  constructor(
    private ocupacionesService: OcupacionesService,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
    private bloquesService: BloquesService,
    private modalService: NgbModal,
    private espacioService: EspacioService,
    private cementerioService: CementerioService,
  ) {}

  ngOnInit(): void {
    this.cargarSectores();
    this.cargarResumenEspacios();
    this.obtenerTotalOcupaciones();
    this.cargarOcupaciones();
  }

  // para el filtro
  cargarSectores(): void {
    this.sectoresService.getSectores().subscribe({
      next: (data) => {
        this.sectores = data;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los sectores', 'error');
      },
    });
  }
  //aca cargamos las manzana en base al sector seleccionado. Para el filtro tmb
  cargarManzanas(idSector: number): void {
    this.manzanasService.getManzanasid(idSector).subscribe({
      next: (data) => {
        this.manzanas = data;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error');
      },
    });
  }
  //aca cargamos los bloques segun la manzana y el sector seleccionado, usando la nueva funcion creada en bloques.service.ts.
  // recordemos que usamos numero_manzana para los filtros en el componente inicio.component.html, no id_manzana
  cargarBloques(idManzana: number): void {
    this.bloquesService.getBloquesid(idManzana).subscribe({
      next: (data) => {
        this.bloques = data;
      },
      error: (error) => {
        console.error('Error al cargar bloques:', error);
        Swal.fire('Error', 'No se pudieron cargar los bloques', 'error');
      },
    });
  }

  // Función para agrupar ocupaciones por número de espacio y mostrar los fallecidos en un solo registro
  // Es decir, para mostrar una fila por espacio ocupado, aunque haya varios fallecidos en ese mismo espacio, y mostrar los nombres de los fallecidos separados por comas en la misma fila
  agruparOcupaciones(): void {
    const mapa = new Map<string, any>();

    for (const o of this.ocupaciones) {
      // Clave única por espacio: código de bloque + tipo + número de espacio
      const clave = `${o.codigo_bloque}-${o.tipo_ubicacion}-${o.numero}`;

      if (!mapa.has(clave)) {
        mapa.set(clave, {
          ...o, //id_espacio, codigo_bloque, sector_cementerio, manzana, tipo_ubicacion, bloque_lote, numero
          fallecidos: [],
          fechas: [],
        });
      }

      const entrada = mapa.get(clave);

      // Solo añadir si hay un fallecido real (no S/N ni vacío)
      if (o.nombre_fallecido && o.nombre_fallecido !== 'S/N') {
        entrada.fallecidos.push(o.nombre_fallecido);
        entrada.fechas.push(o.fecha_fallecimiento ?? null);
      }
    }

    this.ocupacionesAgrupadas = Array.from(mapa.values());
    console.log('Primer registro agrupado:', this.ocupacionesAgrupadas[0]);
  }
  //aca cargamos las ocupaciones activas, usando la funcion creada en ocupaciones.service.ts
  cargarOcupaciones(): void {
    this.loading = true;
    //añadimos paginacion aquí para no cargar todas las ocupaciones de golpe, sino solo las que correspondan a la página actual
    this.ocupacionesService.getOcupaciones(this.page, this.limit).subscribe({
      next: (data) => {
        this.ocupaciones = data.data;
        this.agruparOcupaciones(); // Agrupamos las ocupaciones por numero de espacio
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar las ocupaciones', 'error');
      },
    });
  }
  // Función para obtener el total de ocupaciones
  obtenerTotalOcupaciones(): void {
    this.ocupacionesService.getTotalOcupaciones().subscribe({
      next: (data) => {
        this.totalOcupaciones = data.total;
        this.totalPages = Math.ceil(this.totalOcupaciones / this.limit);
      },
      error: () => {
        console.error('Error al obtener el total de ocupaciones');
      },
    });
  }
  paginaAnterior(): void {
    if (this.page > 1) {
      this.page--;
      this.cargarOcupaciones();
    }
  }

  siguientePagina(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.cargarOcupaciones();
    }
  }

  // BUSCADOR TEXTO
  buscarTexto(): void {
    if (!this.filtros.busqueda || this.filtros.busqueda.length < 2) {
      this.cargarOcupaciones();
      return;
    }
    this.loading = true;
    this.ocupacionesService
      .buscarOcupaciones(this.filtros.busqueda, this.page, this.limit)
      .subscribe({
        next: (response) => {
          this.ocupaciones = response.data;
          this.agruparOcupaciones(); // Agrupamos las ocupaciones por numero de espacio
          this.totalOcupaciones = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire('Error', 'Error en la búsqueda', 'error');
        },
      });
  }

  // FILTROS DINÁMICOS
  aplicarFiltros(): void {
    this.loading = true;
    this.ocupacionesService
      .filtrarOcupaciones(
        {
          sector: this.filtros.sector?.toString(),
          manzana: this.filtros.manzana?.toString(),
          bloque: this.filtros.bloque?.toString(),
        },
        this.page,
        this.limit,
      )
      .subscribe({
        next: (response) => {
          this.ocupaciones = response.data;
          this.agruparOcupaciones(); // Agrupamos las ocupaciones por numero de espacio
          this.totalOcupaciones = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire('Error', 'Error al aplicar filtros', 'error');
        },
      });
  }

  cargarFotoBloque(): void {
    if (!this.filtros.sector || !this.filtros.manzana || !this.filtros.bloque) {
      this.imagenBloqueUrl = '';
      this.qrUrl = '';
      return;
    }

    const s = String(this.filtros.sector).padStart(2, '0');
    const m = String(this.filtros.manzana).padStart(2, '0');
    const b = String(this.filtros.bloque).padStart(2, '0');

    this.bloquesService.getFotoBloque(s, m, b).subscribe({
      next: (response) => {
        this.imagenBloqueUrl = response.foto_url ?? '';
        this.imagenError = !response.foto_url;
        this.generarQR(); // <-- generar QR al cargar la foto
      },
      error: () => {
        this.imagenBloqueUrl = '';
        this.imagenError = true;
      },
    });
  }
  // Agregar método — llamarlo cuando se selecciona un bloque
  async generarQR(): Promise<void> {
    if (!this.filtros.sector || !this.filtros.manzana || !this.filtros.bloque)
      return;

    const cementerio = this.cementerioService.getCementerioActivoSnapshot();
    const slug = cementerio?.slug ?? 'colon';

    const sector = String(this.filtros.sector).padStart(2, '0');
    const manzana = String(this.filtros.manzana).padStart(2, '0');
    const bloque = String(this.filtros.bloque)
      .replace(/[^0-9a-zA-Z]/g, '')
      .padStart(2, '0');
    const codigo = `${sector}${manzana}${bloque}`;

    const url = `${window.location.origin}/bloque/${slug}/${codigo}`;

    this.qrUrl = await QRCode.toDataURL(url, {
      width: 250,
      margin: 2,
      color: {
        dark: '#163212',
        light: '#ffffff',
      },
    });
  }

  descargarQR(): void {
    if (!this.qrUrl) return;

    const s = String(this.filtros.sector).padStart(2, '0');
    const m = String(this.filtros.manzana).padStart(2, '0');
    const b = String(this.filtros.bloque).padStart(2, '0');

    const link = document.createElement('a');
    link.href = this.qrUrl;
    link.download = `QR_${s}.${m}.${b}.png`;
    link.click();
  }

  verImagenBloque(): void {
    // Abre la imagen en modal — usa el componente image-modal que ya tienes
    // o simplemente abre en una nueva pestaña si no tienes modal
    window.open(this.imagenBloqueUrl, '_blank');
  }

  actualizarImagenBloque(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const archivo = input.files[0];
    const s = String(this.filtros.sector).padStart(2, '0');
    const m = String(this.filtros.manzana).padStart(2, '0');
    const b = String(this.filtros.bloque).padStart(2, '0');

    this.bloquesService.subirImagenBloque(s, m, b, archivo).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Imagen actualizada correctamente.', 'success');
        // Recargar la foto desde la BD en vez de construir la URL manualmente
        this.cargarFotoBloque();
        this.imagenError = false;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar la imagen.', 'error');
      },
    });

    input.value = '';
  }

  // Función para manejar el cambio de sector
  onSectorChange(): void {
    this.imagenBloqueUrl = ''; // limpiamos la URL de la imagen al cambiar de manzana
    this.imagenError = false; // reseteamos el error de imagen al cambiar de manzana
    this.filtros.manzana = null;
    this.filtros.bloque = null;
    this.manzanas = [];
    this.bloques = [];

    if (!this.filtros.sector) {
      this.cargarOcupaciones();
      return;
    }
    // Buscar el id_sector correspondiente al codigo seleccionado
    const sectorSeleccionado = this.sectores.find(
      (s) => s.codigo === this.filtros.sector,
    );
    if (sectorSeleccionado) {
      this.cargarManzanas(sectorSeleccionado.id_sector);
    }
    this.aplicarFiltros();
  }

  // Función para manejar el cambio de manzana
  onManzanaChange(): void {
    this.imagenBloqueUrl = '';
    this.imagenError = false;
    this.filtros.bloque = null;
    this.bloques = [];

    if (!this.filtros.manzana) {
      this.aplicarFiltros();
      return;
    }
    // Obtener el id_manzana correspondiente al número de manzana seleccionado
    const manzanaSeleccionada = this.manzanas.find(
      (m) => m.numero_manzana === this.filtros.manzana,
    );
    if (manzanaSeleccionada) {
      this.cargarBloques(manzanaSeleccionada.id_manzana);
    } else {
      this.aplicarFiltros();
    }
  }

  // Función para manejar el cambio de bloque
  onBloqueChange(): void {
    this.cargarFotoBloque(); // <-- agregar para construir la URL de la imagen del bloque seleccionado
    this.aplicarFiltros();
  }

  //para abrir el modal de gestionar bloque
  editarBovedas() {
    this.modalService.open(GestionBovedasComponent, {
      centered: true,
      size: 'md',
    });
  }

  // CONTADORES DE LOS BADGES ((falta corregir para que se acualizen respectivamente los numeros reales))
  // Conecta con la nueva función creada en bloques.service.ts
  cargarResumenEspacios(): void {
    this.espacioService.getResumenEspacios().subscribe({
      next: (resumen) => {
        const resumenConLote = resumen as {
          bovedas: number;
          nichos: number;
          cruces: number;
          lotes: number;
        };

        this.resumenEspacios = {
          // Asignamremos los valores obtenidos como números para poder sumarlos y obtener el total
          bovedas: Number(resumenConLote.bovedas),
          nichos: Number(resumenConLote.nichos),
          cruces: Number(resumenConLote.cruces),
          lote: Number(resumenConLote.lotes),
        };
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el resumen de estados', 'error');
      },
    });
  }
  //Para obtener el total lo usamos aca, es decir, lo usamos con "resumenEspacios.lo_que_queremos"
  obtenerTotalEspacios(): number {
    return (
      this.resumenEspacios.bovedas +
      this.resumenEspacios.nichos +
      this.resumenEspacios.cruces +
      this.resumenEspacios.lote
    );
  }
  //obtener el total de bovedas
  obtenerTotalBovedas(): number {
    return this.resumenEspacios.bovedas;
  }
  //obtener el total de nichos
  obtenerTotalNichos(): number {
    return this.resumenEspacios.nichos;
  }
  //obtener el total de cruces
  obtenerTotalCruces(): number {
    return this.resumenEspacios.cruces;
  }
  //obtener el total de lotes
  obtenerTotalLotes(): number {
    return this.resumenEspacios.lote;
  }

  // eliminar espacio unicamente, aunque si el espacio tiene fallecidos no se podrá porque el backend no lo permitirá
  // ya que primero necesitar estar el espacio libre.
  eliminar(ocupacion: any): void {
    Swal.fire({
      title: '¿Eliminar espacio?',
      html: `¿Deseas eliminar el espacio <b>${ocupacion.numero}</b> del bloque <b>${ocupacion.codigo_bloque}</b>?<br>
           <small class="text-muted">Esta acción no se puede deshacer.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.espacioService.eliminarEspacio(ocupacion.id_espacio).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'El espacio fue eliminado correctamente.',
              'success',
            );
            // Recargar según el estado actual de los filtros
            if (this.filtros.busqueda) {
              this.buscarTexto();
            } else if (
              this.filtros.sector ||
              this.filtros.manzana ||
              this.filtros.bloque
            ) {
              this.aplicarFiltros();
            } else {
              this.cargarOcupaciones();
            }
          },
          error: (err) => {
            const mensaje =
              err.error?.message || 'No se pudo eliminar el espacio.';
            Swal.fire('Error', mensaje, 'error');
          },
        });
      }
    });
  }
}
