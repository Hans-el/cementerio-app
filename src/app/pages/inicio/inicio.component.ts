import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NichosService } from '../../services/nicho.service';
import { Nicho } from '../../models/nicho.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NichoSeleccionadoService } from '../../services/nicho-seleccionado.service';
import { effect } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NgbModalModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  sectores: { [key: string]: Nicho[] } = {};
  selectedNicho: Nicho | null = null;

  constructor(
    private nichosService: NichosService,
    private modalService: NgbModal,
    private nichoSeleccionadoService: NichoSeleccionadoService
  ) { // Escuchar cambios en el nicho seleccionado
    effect(() => {
      const selected = this.nichoSeleccionadoService.getSelectedNicho();
      if (selected) {
        this.selectedNicho = selected;
      }
    });
  }
  

  ngOnInit(): void {
    this.getSectores();
  }

  // Obtener sectores y nichos desde el servicio
  getSectores(): void {
    this.sectores = this.nichosService.getSectores();
  }

  // Manejar clic en un nicho para mostrar información
  onNichoClick(nicho: Nicho, content: any): void {
    this.selectedNicho = nicho;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // Cerrar el modal
  closeModal(): void {
    this.modalService.dismissAll();
  }
    // Método para determinar la clase CSS de un nicho
  getNichoClass(nicho: Nicho): string {
    let baseClass = nicho.estado;
    if (this.selectedNicho?.id === nicho.id) {
      baseClass += ' selected';
    }
    return baseClass;
  }
}
