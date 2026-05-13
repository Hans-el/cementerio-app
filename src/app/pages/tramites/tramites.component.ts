import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tramites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tramites.component.html',
  styleUrl: './tramites.component.css'
})
export class TramitesComponent {
  constructor(private router: Router) { }

  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
