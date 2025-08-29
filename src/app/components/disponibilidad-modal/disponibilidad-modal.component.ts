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
  tiposDisponibles = [
    { id: 'familiar', nombre: 'Bóveda Familiar', disponibles: 0, precio: '$15,000 - $25,000', capacidad: '4-8 personas', caracteristicas: ['Espacio amplio', 'Decoración personalizable', 'Acceso vehicular'] },
    { id: 'individual', nombre: 'Nicho Individual', disponibles: 0, precio: '$3,000 - $8,000', capacidad: '1 persona', caracteristicas: ['Ubicación en altura', 'Placa personalizada', 'Mantenimiento incluido'] },
    { id: 'premium', nombre: 'Bóveda Premium', disponibles: 0, precio: '$30,000 - $50,000', capacidad: '4-8 personas', caracteristicas: ['Espacio exclusivo', 'Servicios adicionales', 'Acceso privado'] },
    { id: 'infantil', nombre: 'Memorial Infantil', disponibles: 0, precio: '$5,000 - $10,000', capacidad: '1-2 personas', caracteristicas: ['Diseño especial', 'Ambiente acogedor', 'Decoración temática'] },
  ]; tipoSeleccionado: string = 'todos';

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
    this.tiposDisponibles[0].disponibles = this.nichosDisponibles.filter(n => n.sector === 'A').length;
    this.tiposDisponibles[1].disponibles = this.nichosDisponibles.filter(n => n.sector === 'B').length;
    this.tiposDisponibles[2].disponibles = this.nichosDisponibles.filter(n => n.sector === 'C').length;
    this.tiposDisponibles[3].disponibles = this.nichosDisponibles.filter(n => n.sector === 'D').length;
  }

  filtrarPorTipo(tipo: string): void {
    this.tipoSeleccionado = tipo;
  }

  reservar(nicho: Nicho): void {
    // Lógica para reservar el nicho (puedes abrir otro modal o mostrar un mensaje)
    alert(`Reservando nicho ${nicho.sector}${nicho.numero}`);
  }
}