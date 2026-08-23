import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CementerioService } from '../../../auth/services/cementerio.service';

@Component({
  selector: 'app-mapa-bovedas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-bovedas.component.html',
  styleUrl: './mapa-bovedas.component.css',
})
export class MapaBovedasComponent {
  scale = 1;
  minScale = 1;
  maxScale = 4;
  translateX = 0;
  translateY = 0;
  mapaUrl: string = 'assets/sinmapa.webp';

  // Para arrastrar con mouse
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  // Para touch (pinch)
  private lastTouchDist = 0;

  constructor(private cementerioService: CementerioService) {}

  ngOnInit(): void {
    const cementerio = this.cementerioService.getCementerioActivoSnapshot();
    if (cementerio?.mapa_url) {
      this.mapaUrl = cementerio.mapa_url;
    }
  }
  get transform(): string {
    return `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }
  // El zoomLevel es solo para mostrar el porcentaje actual de zoom en la UI, no afecta la lógica de zoom
  get zoomLevel(): number {
    return Math.round(this.scale * 100);
  }
  // Métodos para los botones de zoom
  zoomIn(): void {
    this.applyZoom(this.scale * 1.25);
  }
  zoomOut(): void {
    this.applyZoom(this.scale * 0.8);
  }
  resetZoom(): void {
    this.scale = 1;
    const clamped = this.clampTranslate(0, 0);
    this.translateX = clamped.x;
    this.translateY = clamped.y;
  }
  // Aplica el nuevo nivel de zoom asegurándose de que esté dentro de los límites definidos
  private applyZoom(newScale: number): void {
    this.scale = Math.min(this.maxScale, Math.max(this.minScale, newScale));
  }
  // Métodos para arrastrar la imagen con mouse o touch
  onMouseDown(event: MouseEvent): void {
    this.dragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }
  onMouseMove(event: MouseEvent): void {
    if (!this.dragging) return;
    const newX = this.translateX + (event.clientX - this.lastX);
    const newY = this.translateY + (event.clientY - this.lastY);
    const clamped = this.clampTranslate(newX, newY);
    this.translateX = clamped.x;
    this.translateY = clamped.y;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }
  onMouseUp(): void {
    this.dragging = false;
  }
  // Métodos para manejar el zoom con gestos táctiles (pinch) y arrastrar con un dedo
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      this.lastTouchDist = this.getTouchDist(event);
    } else if (event.touches.length === 1) {
      this.lastX = event.touches[0].clientX;
      this.lastY = event.touches[0].clientY;
    }
  }
  // El método onTouchMove maneja tanto el zoom con dos dedos (pinch) como el arrastre con un solo dedo.
  onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    if (event.touches.length === 2) {
      const dist = this.getTouchDist(event);
      this.applyZoom(this.scale * (dist / this.lastTouchDist));
      this.lastTouchDist = dist;
    } else if (event.touches.length === 1) {
      const newX = this.translateX + (event.touches[0].clientX - this.lastX);
      const newY = this.translateY + (event.touches[0].clientY - this.lastY);
      const clamped = this.clampTranslate(newX, newY);
      this.translateX = clamped.x;
      this.translateY = clamped.y;
      this.lastX = event.touches[0].clientX;
      this.lastY = event.touches[0].clientY;
    }
  }
  onTouchEnd(): void {
    this.lastTouchDist = 0;
  }

  private getTouchDist(event: TouchEvent): number {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  //para calcular los limites segun el scale actual
  //La lógica de clampTranslate funciona así:
  // si la imagen (con zoom aplicado) es más grande que el viewport, el usuario puede arrastrar solo hasta el borde de la imagen — nunca más allá.
  // Si la imagen es más pequeña que el viewport (scale muy reducido), la centra automáticamente.
  private clampTranslate(x: number, y: number): { x: number; y: number } {
    const el = document.querySelector('.mapa-viewport') as HTMLElement;
    const img = document.querySelector('.mapa-canvas img') as HTMLElement;
    if (!el || !img) return { x, y };

    const viewW = el.clientWidth;
    const viewH = el.clientHeight;
    const imgW = img.clientWidth * this.scale;
    const imgH = img.clientHeight * this.scale;

    const minX = imgW > viewW ? -(imgW - viewW) : 0;
    const maxX = imgW > viewW ? 0 : (viewW - imgW) / 2;
    const minY = imgH > viewH ? -(imgH - viewH) : 0;
    const maxY = imgH > viewH ? 0 : (viewH - imgH) / 2;

    return {
      x: Math.min(maxX, Math.max(minX, x)),
      y: Math.min(maxY, Math.max(minY, y)),
    };
  }
}
