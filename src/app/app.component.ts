import { Component, OnInit } from '@angular/core';
import { CementerioService } from './features/auth/services/cementerio.service';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'cementerio-app';
  isSidebarCollapsed = false;
  loading = false;
  mostrarBannerInstalar = false;
  mostrarBannerUpdate = false;
  cargando = false;

  private deferredPrompt: any = null;

  constructor(
    private cementerioService: CementerioService,
    private router: Router,
    private swUpdate: SwUpdate,
  ) {}

  ngOnInit(): void {
    // Restaurar tema del cementerio al recargar
    const cementerio = this.cementerioService.getCementerioActivoSnapshot();
    if (cementerio) {
      this.cementerioService.aplicarTema(cementerio);
    }

    // Loader entre navegaciones — igual que antes
    this.router.events.subscribe((event) => {
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

    // Capturar prompt de instalación del navegador
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.mostrarBannerInstalar = true;
    });

    // Detectar nueva versión del Service Worker
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
        .subscribe(() => {
          this.mostrarBannerUpdate = true;
        });
    }
  }

  instalarApp(): void {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then(() => {
      this.deferredPrompt = null;
      this.mostrarBannerInstalar = false;
    });
  }

  actualizarApp(): void {
    window.location.reload();
  }

  cerrarBannerInstalar(): void {
    this.mostrarBannerInstalar = false;
  }
  cerrarBannerUpdate(): void {
    this.mostrarBannerUpdate = false;
  }

  onToggleSidebar(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }
}
