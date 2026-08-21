import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CementerioService } from '../../services/cementerio.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  tieneSesion: boolean = false;
  tieneCementerio: boolean = false;

  constructor(
    private router: Router,
    private cementerioService: CementerioService,
  ) {
    this.tieneSesion = !!localStorage.getItem('token');
    this.tieneCementerio =
      !!this.cementerioService.getCementerioActivoSnapshot();
  }

  volver(): void {
    if (this.tieneSesion) {
      this.router.navigate(['/mapa']);
    } else if (this.tieneCementerio) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/cementerios']);
    }
  }
}
