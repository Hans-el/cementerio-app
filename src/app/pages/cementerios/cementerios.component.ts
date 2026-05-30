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
  cargando = false;

  constructor(
    private cementerioService: CementerioService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const slugGuardado = this.cementerioService.obtenerSlug();
    if (slugGuardado) {
      this.router.navigate(['/login']); // ya eligió cementerio antes
      return;
    }
    this.cargarCementerios();
  }

  cargarCementerios(): void {
    this.cargando = true;
    this.cementerioService.getCementerios().subscribe({
      next: (data) => {
        this.cementerios = data;
        this.cargando = false;
      },
      error: () => { this.cargando = false; },
    });
  }

  seleccionar(cementerio: Cementerio): void {
    this.cementerioService.guardarSlug(cementerio.slug);
    this.router.navigate(['/login']);
  }
}                             