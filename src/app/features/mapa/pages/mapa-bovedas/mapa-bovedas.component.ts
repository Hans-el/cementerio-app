import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ManzanaMapa,
  ManzanaMapaJson,
  MapaConfigJson,
} from '../../models/mapas';
import { CementerioService } from '../../../auth/services/cementerio.service';

@Component({
  selector: 'app-mapa-bovedas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-bovedas.component.html',
  styleUrl: './mapa-bovedas.component.css',
})
export class MapaBovedasComponent implements OnInit {
  cargando = true;
  errorCarga = false;

  urlMapa = '';
  anchoImg = 0;
  altoImg = 0;
  manzanas: ManzanaMapa[] = [];
  caminoPoints = '';
  caminoActivo = false;

  manzanaActiva: ManzanaMapa | null = null;
  manzanaPulsando: boolean = false; // controla la animación de pulso

  fallecidoLocalizado: {
    nombre: string;
    codigo: string;
    espacio: string | null;
  } | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private cementerioService: CementerioService,
  ) {}

  ngOnInit(): void {
    this.cargarMapaDelCementerio();

    this.route.queryParams.subscribe((params) => {
      if (params['sector'] && params['manzana']) {
        // Guardar datos del fallecido si vienen en la URL
        if (params['nombre'] && params['codigo']) {
          this.fallecidoLocalizado = {
            nombre: params['nombre'],
            codigo: params['codigo'],
            espacio: params['espacio'] ?? null,
          };
        } else {
          this.fallecidoLocalizado = null;
        }

        if (!this.cargando) {
          this.resaltarYScrollear(
            parseInt(params['sector'], 10),
            parseInt(params['manzana'], 10),
          );
        } else {
          this.pendienteResaltar = {
            sector: parseInt(params['sector'], 10),
            manzana: parseInt(params['manzana'], 10),
          };
        }
      }
    });
  }

  private pendienteResaltar: { sector: number; manzana: number } | null = null;

  cargarMapaDelCementerio(): void {
    const cementerio = this.cementerioService.getCementerioActivoSnapshot();
    const slug = cementerio?.slug ?? 'colon';

    this.http.get<MapaConfigJson>(`assets/mapas/${slug}.json`).subscribe({
      next: (config) => {
        this.urlMapa = config.urlMapa;
        this.anchoImg = config.anchoImg;
        this.altoImg = config.altoImg;
        this.caminoPoints = this.convertirCoords(config.camino.coords);

        this.manzanas = config.manzanas.map((m) => ({
          sector: m.sector,
          manzana: m.manzana,
          codigo: `${String(m.sector).padStart(2, '0')}.${String(m.manzana).padStart(2, '0')}`,
          points: this.convertirCoords(m.coords),
        }));

        this.cargando = false;

        // Si llegó un query param mientras cargaba, resaltamos ahora
        if (this.pendienteResaltar) {
          setTimeout(
            () =>
              this.resaltarYScrollear(
                this.pendienteResaltar!.sector,
                this.pendienteResaltar!.manzana,
              ),
            100,
          );
          this.pendienteResaltar = null;
        }
      },
      error: () => {
        this.errorCarga = true;
        this.cargando = false;
      },
    });
  }

  // Convierte "x1,y1,x2,y2,..." → "x1,y1 x2,y2 x3,y3"
  private convertirCoords(coords: string): string {
    const nums = coords.split(',').map((n) => parseInt(n.trim(), 10));
    const puntos: string[] = [];
    for (let i = 0; i < nums.length; i += 2) {
      puntos.push(`${nums[i]},${nums[i + 1]}`);
    }
    return puntos.join(' ');
  }

  resaltarYScrollear(sector: number, manzana: number): void {
    const item = this.manzanas.find(
      (m) => m.sector === sector && m.manzana === manzana,
    );
    if (!item) return;

    this.manzanaActiva = item;
    this.manzanaPulsando = true;

    // Apagar el pulso después de la animación (3 ciclos de ~1s)
    setTimeout(() => {
      this.manzanaPulsando = false;
    }, 3000);

    setTimeout(() => {
      const svgElement = this.elRef.nativeElement.querySelector(
        `polygon[data-codigo="${item.codigo}"]`,
      ) as SVGPolygonElement;

      if (svgElement) {
        svgElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }, 150);
  }

  seleccionarManzana(manzana: ManzanaMapa): void {
    this.manzanaActiva = manzana;
    this.manzanaPulsando = false; // click manual no necesita pulso
    this.caminoActivo = false;
    this.fallecidoLocalizado = null; // click manual limpia la info de localización
  }
  seleccionarCamino(): void {
    this.manzanaActiva = null;
    this.manzanaPulsando = false;
    this.caminoActivo = true;
    this.fallecidoLocalizado = null;
  }

  cerrarPopup(): void {
    this.manzanaActiva = null;
    this.caminoActivo = false;
    this.fallecidoLocalizado = null;
  }

  irABloques(): void {
    if (!this.manzanaActiva) return;
    this.router.navigate(['/bloques'], {
      queryParams: {
        sector: this.manzanaActiva.sector,
        manzana: this.manzanaActiva.manzana,
      },
    });
  }

  nombreSector(sector: number): string {
    return sector === 1 ? 'Cementerio Viejo' : 'Cementerio Nuevo';
  }
}
