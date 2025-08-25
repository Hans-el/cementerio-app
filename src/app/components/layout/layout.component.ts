import { Component, OnInit, HostListener } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  isMobile = false;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  // Escuchar cambios en el tamaño de la ventana para ajustar el sidebar
  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }
  
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Bootstrap md breakpoint, funciona para detectar pantallas pequeñas
    if (this.isMobile) {
      this.isSidebarCollapsed = true; // en móviles, iniciar colapsado
    }
  }

  onSidebarStateChange(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}