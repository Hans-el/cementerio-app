import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { BloquesService } from '../../services/bloques.service';
import { ManzanasService } from '../../services/manzanas.service';
import { SectoresService } from '../../services/sectores.service';

@Component({
  selector: 'app-anadir-boveda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anadir-boveda.component.html',
  styleUrl: './anadir-boveda.component.css',
})
export class AnadirBovedaComponent implements OnInit {
  // Objeto para almacenar los datos de la nueva bóveda. Esto lo definimos segun la base de datos que me de el señor, por ahora lo dejamos así.
  // esto irá en /models/boveda.model.ts
  nuevoBloque: any = {
    id_sector: null,
    id_manzana: null,
    numero_bloque: null,
    cantidad_espacios: null,
    id_tipo_espacio: 1,
    observaciones: '',
  };
  //
  sectores: any[] = [];
  manzanas: any[] = [];
  bloquesExistentes: any[] = [];
  tiposEspacio: any[] = [
    { id_tipo_espacio: 1, nombre: 'Bóveda' },
    { id_tipo_espacio: 2, nombre: 'Nicho' },
    { id_tipo_espacio: 4, nombre: 'Lote' },
  ]; //

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private sectoresService: SectoresService,
    private manzanasService: ManzanasService,
    private bloquesService: BloquesService,
  ) { }
  // Al inicializar el componente, cargamos los sectores disponibles
  ngOnInit(): void {
    this.cargarSectores();
  }
  // Getter para saber si el tipo seleccionado es LOTE
  get esLote(): boolean {
    return this.tiposEspacio.find(t => t.id_tipo_espacio === this.nuevoBloque.id_tipo_espacio)?.nombre === 'Lote';
  }
  // Cuando cambia el tipo, si es LOTE forzamos cantidad = 1
  onTipoEspacioChange(): void {
    if (this.esLote) {
      this.nuevoBloque.cantidad_espacios = 1;
    } else {
      this.nuevoBloque.cantidad_espacios = null;
    }
  }
  // Función para cargar los sectores desde el servicio
  cargarSectores(): void {
    this.sectoresService.getSectores().subscribe({
      next: (sectores) => {
        this.sectores = sectores;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error');
      },
    });
  }
  // una vez obtenidos los sectores anteriormente, cargamos las manzanas correspondientes y seleccionamos la que queremos
  onSectorChange(): void {
    if (!this.nuevoBloque.id_sector) return;
    this.manzanasService.getManzanasid(this.nuevoBloque.id_sector).subscribe({
      next: (manzanas) => {
        this.manzanas = manzanas;
        this.nuevoBloque.id_manzana = null;
        this.bloquesExistentes = [];
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las manzanas', 'error');
      },
    });
  }

  // una vez seleccionada la manzana, cargamos los bloques existentes para determinar el siguiente número de bloque
  onManzanaChange(): void {
    if (!this.nuevoBloque.id_manzana) return;
    this.bloquesService.getBloquesid(this.nuevoBloque.id_manzana).subscribe({
      next: (bloques) => {
        this.bloquesExistentes = bloques;
        this.nuevoBloque.numero_bloque = this.obtenerSiguienteNumeroBloque();
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los bloques', 'error');
      },
    });
  }

  // Función para obtener el siguiente número de bloque disponible basado en los bloques existentes en la manzana seleccionada
  obtenerSiguienteNumeroBloque(): string {
    if (this.bloquesExistentes.length === 0) {
      return '1';
    }

    // Extraemos solo la parte numérica de cada numero_bloque (ej: "36-A" → 36, "36" → 36)
    const numerosBloque = this.bloquesExistentes
      .map((b) => parseInt(b.numero_bloque, 10))
      .filter((n) => !isNaN(n));

    if (numerosBloque.length === 0) return '1';

    const maxNumeroBloque = Math.max(...numerosBloque);
    return (maxNumeroBloque + 1).toString();
  }

  // Función para manejar el envío del formulario
  //usamos swal para mostrar mensajes de éxito o error para que se vea mejor
  onSubmit(): void {
    if (
      !this.nuevoBloque.id_sector ||
      !this.nuevoBloque.id_manzana ||
      !this.nuevoBloque.numero_bloque ||
      !this.nuevoBloque.cantidad_espacios
    ) {
      Swal.fire(
        'Error',
        'Por favor, complete todos los campos obligatorios',
        'error',
      );
      return;
    }
    Swal.fire({
      title: '¿Guardar nuevo bloque?',
      text: '¿Desea guardar el nuevo bloque?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bloquesService.createBloque(this.nuevoBloque).subscribe({
          next: (response) => {
            Swal.fire('Éxito', 'Bloque creado correctamente', 'success');
            this.activeModal.close(response);
          },
          error: () => {
            Swal.fire('Error', 'Error al crear el bloque', 'error');
          },
        });
      }
    });
  }
}
