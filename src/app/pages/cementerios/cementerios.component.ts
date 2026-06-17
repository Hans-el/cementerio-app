import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CementerioService } from '../../services/cementerio.service';
import { Cementerio } from '../../models/cementerio.model';


@Component({
  selector: 'app-cementerios',
  standalone: true,
  imports: [CommonModule],
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
