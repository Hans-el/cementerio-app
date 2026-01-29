import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DisponibilidadModalComponent } from '../disponibilidad-modal/disponibilidad-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FallecidoService } from '../../services/fallecido.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'; // para el autocompletado
import { Subject } from 'rxjs';

@Component({
  selector: 'app-localizar-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './localizar-modal.component.html',
  styleUrls: ['./localizar-modal.component.css']
})
export class LocalizarModalComponent implements OnInit {
  nombreFallecido: string = ''; // Nombre del fallecido a buscar
  cargando: boolean = false; // Indicador de carga
  resultadoBusqueda: any[] = []; // Resultados de la búsqueda
  mensajeError: string = ''; // Mensaje de error en caso de fallo
  sugerencias: string[] = []; // Sugerencias para autocompletado
  private searchTerms = new Subject<string>(); // Para el autocompletado, sugerido por angular docs

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal, // Servicio para abrir modales
    private fallecidoService: FallecidoService // Servicio para buscar fallecidos
  ) { }


  ngOnInit(): void {
    this.searchTerms.pipe(
      debounceTime(300), // Espera 300ms después de cada tecla
      distinctUntilChanged(), // Ignora si el término de búsqueda no ha cambiado
      switchMap((term: string) => this.fallecidoService.obtenerSugerenciasNombres(term))
    ).subscribe(sugerencias => {
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

  // Método para buscar la ubicación por el nombre del fallecido
  buscar(): void {
    if (!this.nombreFallecido) {
      this.mensajeError = 'Por favor, ingrese el nombre del fallecido.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.resultadoBusqueda = [];

    this.fallecidoService.buscarBovedaPorNombre(this.nombreFallecido).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.resultadoBusqueda = data.map(item => ({
            sector: item.sector_cementerio,
            manzana: item.manzana,
            bloque: item.bloque_lote,
            espacio: item.numero,
          }));
        } else {
          this.mensajeError = 'No se encontró ninguna bóveda para el fallecido ingresado.';
        }
        this.cargando = false;
      },
      error: () => {
        this.mensajeError = 'Ocurrió un error al buscar la bóveda.';
        this.cargando = false;
      }
    });
  }

  openDisponibilidadModal() { // Abre el modal de disponibilidad que está puesto en el localizar para agilizar la adquisición de una bóveda
    this.modalService.open(DisponibilidadModalComponent, { centered: true, size: 'lg' });
  }

  // Esta funcion formatea un número o string para que tenga al menos dos dígitos (añade un cero delante si es necesario)
  // esto es importante para la correcta lectura de las imágenes de los bloques, ya que todas siguen un formato de dos dígitos
  // lo que hace es verificar la longitud del valor convertido a string, y si es 1, añade un '0' delante, fin.
  formatTwoDigits(value: number | string): string {
    const strValue = value.toString();
    return strValue.length === 1 ? `0${strValue}` : strValue;
  }


}