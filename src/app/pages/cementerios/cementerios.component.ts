import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CementerioService } from '../../services/cementerio.service';
import { Cementerio } from '../../models/cementerio.model';


@Component({
  selector: 'app-cementerios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cementerios.component.html',
  styleUrl: './cementerios.component.css'
})
export class CementeriosComponent implements OnInit {

  cementerios: Cementerio[] = [];
  cargando = true;
  error = false;
  anioActual = new Date().getFullYear();

  constructor(
    private cementerioService: CementerioService,
    private router: Router,
  ) { }

  // Agrega este método dentro de export class CementeriosComponent
  getAccentoCard(index: number): string {
    const colores = [
      'rgba(59, 130, 246, 0.35)',  // Azul
      'rgba(20, 184, 166, 0.35)',  // Turquesa
      'rgba(30, 64, 175, 0.35)',   // Azul Oscuro
      'rgba(180, 83, 9, 0.35)',    // Ámbar/Dorado
      'rgba(16, 185, 129, 0.35)',  // Verde Esmeralda
      'rgba(124, 58, 237, 0.35)',  // Violeta
      'rgba(217, 119, 6, 0.35)'    // Dorado
    ];
    return colores[index % colores.length];
  }

  ngOnInit(): void {
    // Si ya hay cementerio seleccionado y hay token, ir directo al mapa
    const token = localStorage.getItem('token');
    const cementerio = this.cementerioService.getCementerioActivoSnapshot();

    if (token && cementerio) {
      this.router.navigate(['/mapa']);
      return;
    }

    this.cementerioService.getCementerios().subscribe({
      next: (data) => {
        this.cementerios = data;
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      },
    });
  }
  recargar() {
    // Tu lógica para recargar los cementerios
    this.cementerioService.getCementerios(); // o el método que uses para cargar
  }

  seleccionar(cementerio: Cementerio): void {
    this.cementerioService.seleccionar(cementerio);
    this.router.navigate(['/login']);
  }
}
