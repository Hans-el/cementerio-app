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
import { GestionBovedasComponent } from '../../components/gestion-bloques/gestion-bovedas.component';
import { Ocupacion } from '../../models/ocupacion.model';
import { EspacioService } from '../../services/espacio.service';

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

  // Resumen de espacios para los badges
  resumenEspacios: { bovedas: number; nichos: number; cruces: number } = {
    bovedas: 0,
    nichos: 0,
    cruces: 0,
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
  ) { }

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
    console.log('Primer registro agrupado:', this.ocupacionesAgrupadas[0]); // <-- verificar

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

  // Función para manejar el cambio de sector
  onSectorChange(): void {
    this.filtros.manzana = null;
    this.filtros.bloque = null;
    this.manzanas = [];
    this.bloques = [];

    if (!this.filtros.sector) {
      this.cargarOcupaciones();
      return;
    }

    this.cargarManzanas(this.filtros.sector);
    this.aplicarFiltros();
  }

  // Función para manejar el cambio de manzana
  onManzanaChange(): void {
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
        this.resumenEspacios = {
          // Asignamremos los valores obtenidos como números para poder sumarlos y obtener el total
          bovedas: Number(resumen.bovedas),
          nichos: Number(resumen.nichos),
          cruces: Number(resumen.cruces),
        };
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el resumen de estados', 'error');
      },
    });
  }
  //Para obtener el total lo usamos aca, es decir, lo usamos con "resumenEspacios.lo_que_queremos"
  obtenerTotalLotes(): number {
    return (
      this.resumenEspacios.bovedas +
      this.resumenEspacios.nichos +
      this.resumenEspacios.cruces
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

  // eliminar registro, aunque no sé si ponerlo acá
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
            Swal.fire('Eliminado', 'El espacio fue eliminado correctamente.', 'success');
            // Recargar según el estado actual de los filtros
            if (this.filtros.busqueda) {
              this.buscarTexto();
            } else if (this.filtros.sector || this.filtros.manzana || this.filtros.bloque) {
              this.aplicarFiltros();
            } else {
              this.cargarOcupaciones();
            }
          },
          error: (err) => {
            const mensaje = err.error?.message || 'No se pudo eliminar el espacio.';
            Swal.fire('Error', mensaje, 'error');
          },
        });
      }
    });
  }

  //editar ocupacion, aunque no sé si ponerlo acá tambien
  editar(ocupacion: any): void {
    Swal.fire('Pendiente', 'La edición se realizará desde el backend', 'info');
  }
}
