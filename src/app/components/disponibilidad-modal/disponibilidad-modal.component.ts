import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NichosService } from '../../services/nicho.service';
import { Nicho } from '../../models/nicho.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-disponibilidad-modal',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './disponibilidad-modal.component.html',
  styleUrl: './disponibilidad-modal.component.css'
})
export class DisponibilidadModalComponent {
  nichosDisponibles: Nicho[] = [];
  // Ejemplo de tipos de nichos con características y precios
  // Estos datos los traemos desde nuestra base de datos real.
  tiposDisponibles = [
    { id: 'familiar', nombre: 'Bóveda Familiar', disponibles: 0, precio: '$15,000 - $25,000', capacidad: '4-8 personas', caracteristicas: ['Espacio amplio', 'Decoración personalizable', 'Acceso vehicular'] },
    { id: 'individual', nombre: 'Nicho Individual', disponibles: 0, precio: '$3,000 - $8,000', capacidad: '1 persona', caracteristicas: ['Ubicación en altura', 'Placa personalizada', 'Mantenimiento incluido'] },
  ];
  tipoSeleccionado: string = 'todos';

  constructor(
    public activeModal: NgbActiveModal,
    private nichosService: NichosService
  ) { }

  ngOnInit(): void {
    this.cargarNichosDisponibles();
  }

  cargarNichosDisponibles(): void {
    const sectores = this.nichosService.getSectores();
    this.nichosDisponibles = Object.values(sectores)
      .flat()
      .filter(nicho => nicho.estado === 'disponible');

    // Contar disponibles por tipo (ejemplo: aquí puedes ajustar la lógica según tus datos reales)
    this.tiposDisponibles[0].disponibles = this.nichosDisponibles.filter(n => n.sector === '1').length;
    this.tiposDisponibles[1].disponibles = this.nichosDisponibles.filter(n => n.sector === '2').length;
    this.tiposDisponibles[2].disponibles = this.nichosDisponibles.filter(n => n.sector === '3').length;
    this.tiposDisponibles[3].disponibles = this.nichosDisponibles.filter(n => n.sector === '4').length;
  }

  filtrarPorTipo(tipo: string): void {
    this.tipoSeleccionado = tipo;
  }

  
}