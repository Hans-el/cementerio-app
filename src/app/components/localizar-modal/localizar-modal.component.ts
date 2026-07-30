import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DisponibilidadModalComponent } from '../disponibilidad-modal/disponibilidad-modal.component';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FallecidoService } from '../../services/fallecido.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'; // para el autocompletado
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { BloquesService } from '../../services/bloques.service';

@Component({
  selector: 'app-localizar-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './localizar-modal.component.html',
  styleUrls: ['./localizar-modal.component.css'],
})
export class LocalizarModalComponent implements OnInit {
  nombreFallecido: string = ''; // Nombre del fallecido a buscar
  cargando: boolean = false; // Indicador de carga
  resultadoBusqueda: any[] = []; // Resultados de la búsqueda
  mensajeError: string = ''; // Mensaje de error en caso de fallo
  sugerencias: string[] = []; // Sugerencias para autocompletado
  selectedImageUrl: string | null = null; // URL de la imagen seleccionada para el modal
  private searchTerms = new Subject<string>(); // Para el autocompletado, sugerido por angular docs
  environment = environment; // Para acceder a la URL del API en el template
  imagenBloqueUrl: string = '';
  imagenError: boolean = false;

  filtros = {
    busqueda: '',
    sector: null as number | null,
    manzana: null as number | null,
    bloque: null as number | null,
  };

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal, // Servicio para abrir modales
    private fallecidoService: FallecidoService,
    private bloquesService: BloquesService,
  ) { }

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        debounceTime(300), // Espera 300ms después de cada tecla
        distinctUntilChanged(), // Ignora si el término de búsqueda no ha cambiado
        switchMap((term: string) =>
          this.fallecidoService.obtenerSugerenciasNombres(term),
        ),
      )
      .subscribe((sugerencias) => {
        this.sugerencias = sugerencias;
      });
  }

  // Llama a este método cada vez que cambia el input
  onInputChange(): void {
    this.searchTerms.next(this.nombreFallecido);
  }

  // Selecciona una sugerencia del autocompletado
  seleccionarSugerencia(sugerencia: string): void {
    this.nombreFallecido = sugerencia;
    this.sugerencias = [];
  }

  openImageModal() {
    if (!this.imagenBloqueUrl) {
      this.mensajeError = 'No hay imagen disponible para este bloque.';
      return;
    }
    const modalRef = this.modalService.open(ImageModalComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.selectedImageUrl = this.imagenBloqueUrl;
  }

  cargarFotoBloque(
    sector: number | string,
    manzana: number | string,
    bloque: number | string
  ): void {

    const s = String(sector).padStart(2, '0');
    const m = String(manzana).padStart(2, '0');
    const b = String(bloque).padStart(2, '0');

    this.bloquesService.getFotoBloque(s, m, b).subscribe({
      next: (response) => {
        this.imagenBloqueUrl = response.foto_url ?? '';
        this.imagenError = !response.foto_url;
      },
      error: () => {
        this.imagenBloqueUrl = '';
        this.imagenError = true;
        this.mensajeError = 'Ocurrió un error al buscar la bóveda.';
        this.cargando = false;
      }
    });
  }

  // Método para buscar la ubicación por el nombre del fallecido
  buscar(): void {
    if (!this.nombreFallecido) {
      this.mensajeError = 'Por favor, ingrese el nombre del fallecido.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.resultadoBusqueda = [];

    this.fallecidoService
      .buscarBovedaPorNombre(this.nombreFallecido)
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.resultadoBusqueda = data.map((item) => ({
              nombresector: item.sector_nombre,
              sector: item.sector_cementerio,
              manzana: item.manzana,
              bloque: item.bloque_lote,
              espacio: item.numero,
            }));

            // Cargar imagen del bloque desde Supabase
            const boveda = this.resultadoBusqueda[0];

            this.cargarFotoBloque(
              boveda.sector,
              boveda.manzana,
              boveda.bloque
            );

          } else {
            this.resultadoBusqueda = [];
            this.imagenBloqueUrl = '';
            this.imagenError = true;

            this.mensajeError =
              'No se encontró ninguna bóveda para el fallecido ingresado.';
          }

          this.cargando = false;
        },
      });
  }


  openDisponibilidadModal() {
    // Abre el modal de disponibilidad que está puesto en el localizar para agilizar la adquisición de una bóveda
    this.modalService.open(DisponibilidadModalComponent, {
      centered: true,
      size: 'lg',
    });
  }

  // Esta funcion formatea un número o string para que tenga al menos dos dígitos (añade un cero delante si es necesario)
  // esto es importante para la correcta lectura de las imágenes de los bloques, ya que todas siguen un formato de dos dígitos
  // lo que hace es verificar la longitud del valor convertido a string, y si es 1, añade un '0' delante, fin.
  formatoDosDigitos(value: number | string): string {
    const strValue = value.toString();
    return strValue.length === 1 ? `0${strValue}` : strValue;
  }
  //La siguiente funcion es para localizar la busqeuda pero en el mapa. Por ahora solo es un mensaje de consola y una alerta
  //pero queremos mostrarlo en el mapa
  localizarEnMapa(boveda: any) {
    // Cerrar el modal actual
    this.activeModal.dismiss();
    const sector = this.formatoDosDigitos(boveda.sector);
    const manzana = this.formatoDosDigitos(boveda.manzana);
    const bloque = this.formatoDosDigitos(boveda.bloque);
    const codigoBoveda = `${sector}.${manzana}.${bloque}`;

    // Mostramos la ubicación con jerarquía visual clara: código completo, sector y manzana.
    Swal.fire({
      title: 'Ubicación encontrada',
      html: `
        <div style="text-align:left;">
          <p style="margin:0 0 1rem 0; color:#6c757d;">El fallecido se encuentra en:</p>

          <div style="display:flex; gap:.75rem; ">
            <div style="flex:1; background:#f8f9fa; border:1px solid #e9ecef; border-radius:14px; padding:1rem; text-align:center;">
              <div style="font-size:.75rem; font-weight:700; letter-spacing:.08em; color:#6c757d; text-transform:uppercase;">Sector.Manzana</div>
              <div style="font-size:2rem; font-weight:800; color:#198754; line-height:1.1;">${sector}.${manzana}</div>
            </div>            
          </div>
          <p style="margin-bottom:1rem; font-size:.92rem; color:#6c757d;">Este código hace referencia a tu lugar en el mapa.</p>


          <div style="background:#e9f7ef; border:1px solid #cdebd8; border-radius:14px; padding:.9rem 1rem;">
            <div style="font-size:.75rem; font-weight:700; letter-spacing:.08em; color:#198754; text-transform:uppercase; margin-bottom:.35rem;">Código completo</div>
            <div style="font-size:1.25rem; font-weight:800; color:#14532d;">${codigoBoveda}</div>
          </div>

          <p style="margin:0; font-size:.92rem; color:#6c757d;">El codigo completo corresponde a tu ubicacion precisa.</p>
        </div>
      `,
      icon: 'success',
      width: '34rem',
      padding: '1.5rem',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745',
    });
  }
}
