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

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal, // Servicio para abrir modales
    private fallecidoService: FallecidoService, // Servicio para buscar fallecidos
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
    if (!this.resultadoBusqueda || this.resultadoBusqueda.length === 0) {
      this.mensajeError = 'No hay resultados para mostrar la imagen.';
      return;
    }
    // Construye la URL de la imagen basada en los datos del resultado de búsqueda, nos sirve perfecto para localizar la carpeta correcta
    const url = `${environment.apiUrl}/images/bloques/${this.formatoDosDigitos(this.resultadoBusqueda[0].sector)}${this.formatoDosDigitos(this.resultadoBusqueda[0].manzana)}/${this.formatoDosDigitos(this.resultadoBusqueda[0].sector)}${this.formatoDosDigitos(this.resultadoBusqueda[0].manzana)}${this.formatoDosDigitos(this.resultadoBusqueda[0].bloque)}.jpg`;
    const modalRef = this.modalService.open(ImageModalComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.selectedImageUrl = url;
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
          } else {
            this.mensajeError =
              'No se encontró ninguna bóveda para el fallecido ingresado.';
          }
          this.cargando = false;
        },
        error: () => {
          this.mensajeError = 'Ocurrió un error al buscar la bóveda.';
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

          <div style="display:flex; gap:.75rem; margin-bottom:1rem;">
            <div style="flex:1; background:#f8f9fa; border:1px solid #e9ecef; border-radius:14px; padding:1rem; text-align:center;">
              <div style="font-size:.75rem; font-weight:700; letter-spacing:.08em; color:#6c757d; text-transform:uppercase;">Sector.Manzana</div>
              <div style="font-size:2rem; font-weight:800; color:#198754; line-height:1.1;">${sector}.${manzana}</div>
            </div>            
          </div>

          <div style="background:#e9f7ef; border:1px solid #cdebd8; border-radius:14px; padding:.9rem 1rem; margin-bottom:1rem;">
            <div style="font-size:.75rem; font-weight:700; letter-spacing:.08em; color:#198754; text-transform:uppercase; margin-bottom:.35rem;">Código completo</div>
            <div style="font-size:1.25rem; font-weight:800; color:#14532d;">${codigoBoveda}</div>
          </div>

          <p style="margin:0; font-size:.92rem; color:#6c757d;">El primer código hace referencia a tu lugar en el mapa.<br>El codigo completo corresponde a tu ubicacion precisa.</p>
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
