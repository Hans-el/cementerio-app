import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Difunto } from '../../models/difunto.model';
import { GestionDifuntosComponent } from '../../components/gestion-difuntos/gestion-difuntos.component';

@Component({
  selector: 'app-inicio-difuntos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-difuntos.component.html',
  styleUrl: './inicio-difuntos.component.css'
})
export class InicioDifuntosComponent {
  // Datos de ejemplo de difuntos. Luego los debemos conectar con el backend.
  difuntos: Difunto[] = [
    { id: 1, nombreCompleto: 'Juan Pérez García', cedula: '1234567890', genero: 'Masculino', fechaNacimiento: '1950-05-15', fechaFallecimiento: '2020-10-20', causaFallecimiento: 'Enfermedad', observaciones: 'Ninguna' },
    { id: 2, nombreCompleto: 'María López Martínez', cedula: '0987654321', genero: 'Femenino', fechaNacimiento: '1965-08-25', fechaFallecimiento: '2022-03-12', causaFallecimiento: 'Accidente', observaciones: 'Familiar notificado' },

  ];
  filtros = {
    busqueda: '',
    genero: 'Todos',
  };

  constructor(private modalService: NgbModal) { }

  // Filtrar difuntos según los filtros seleccionados
  get difuntosFiltrados(): Difunto[] {
    return this.difuntos.filter(difunto => {
      const coincideBusqueda =
        difunto.nombreCompleto.toLowerCase().includes(this.filtros.busqueda.toLowerCase()) ||
        difunto.cedula.includes(this.filtros.busqueda);
      const coincideGenero = this.filtros.genero === 'Todos' || difunto.genero === this.filtros.genero;
      return coincideBusqueda && coincideGenero;
    });
  }

  // Contadores de difuntos para mayor claridad en la UI
  get totalDifuntos(): number {
    return this.difuntos.length;
  }

  // Función para abrir el modal de añadir difunto
  abrirModalAnadirDifunto() {
    const modalRef = this.modalService.open(GestionDifuntosComponent);
    modalRef.componentInstance.guardar.subscribe((nuevoDifunto: Difunto) => {
      nuevoDifunto.id = this.difuntos.length > 0 ? Math.max(...this.difuntos.map(d => d.id)) + 1 : 1; // Con esto asignamos un ID único
      this.difuntos.push(nuevoDifunto); // Añadimos el nuevo difunto a la lista
    });
  }

  // Función para abrir el modal de editar difunto
  abrirModalEditarDifunto(difunto: Difunto) {
    const modalRef = this.modalService.open(GestionDifuntosComponent);
    modalRef.componentInstance.difunto = { ...difunto }; // Pasamos una copia del difunto a editar
    modalRef.componentInstance.guardar.subscribe((difuntoEditado: Difunto) => { // Actualizamos el difunto en la lista
      const index = this.difuntos.findIndex(d => d.id === difuntoEditado.id); // Buscamos el índice del difunto editado
      if (index !== -1) { // Si lo encontramos, actualizamos la información
        this.difuntos[index] = difuntoEditado; // Actualizamos el difunto en la lista
      }
    });
  }
}