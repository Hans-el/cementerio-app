import { Component, OnInit } from '@angular/core';
import { CementerioService } from './services/cementerio.service';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterOutlet
} from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'cementerio-app';
  isSidebarCollapsed: boolean = false;
  loading = false;

  constructor(
    private cementerioService: CementerioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Restaurar el tema del cementerio al recargar la página
    const cementerio = this.cementerioService.getCementerioActivoSnapshot();
    if (cementerio) {
      this.cementerioService.aplicarTema(cementerio);
    }
    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        this.loading = true;
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.loading = false;
        }, 700);
      }
    });
  }
  onToggleSidebar(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

}
