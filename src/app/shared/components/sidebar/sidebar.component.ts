import {
  Component,
  HostListener,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../features/auth/services/auth.service';
import { LocalizarModalComponent } from '../../modals/localizar-modal/localizar-modal.component';
import { DisponibilidadModalComponent } from '../../modals/disponibilidad-modal/disponibilidad-modal.component';
import { GestionBovedasComponent } from '../../../features/espacios/components/gestion-bloques/gestion-bovedas.component';
import { filter } from 'rxjs/operators';
import { CementerioService } from '../../../features/auth/services/cementerio.service';
import { Cementerio } from '../../../features/publico/models/cementerio.model';
import { PushService } from '../../../core/services/push.service';
import { TramiteService } from '../../../features/tramites/services/tramite.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NgbDropdownModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  solicitudesPendientes = 0;
  userRole: string = 'Invitado'; // Valor por defecto si no inicia sesión
  userName: string = ''; // Nombre del usuario para mostrar en el sidebar
  isCollapsed = false; // Estado del sidebar
  isMobile = false; // Estado para dispositivos móviles
  hover: boolean = false;
  cementerioActivo: Cementerio | null = null;

  private intervaloPendientes: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private elementRef: ElementRef,
    private cementerioService: CementerioService,
    private tramiteService: TramiteService,
    private pushService: PushService,
  ) {}

  // Este HostListener escucha los cambios en el tamaño de la ventana para adaptar el sidebar a dispositivos móviles
  @HostListener('window:resize')
  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
  }
  // Cierra el sidebar al tocar fuera de él en móvil
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isMobile || this.isCollapsed) return;

    const clickDentroSidebar = this.elementRef.nativeElement.contains(
      event.target,
    );
    const clickEnBotonToggle = (event.target as HTMLElement).closest(
      '.btn-toggle-sidebar',
    );

    if (!clickDentroSidebar && !clickEnBotonToggle) {
      this.isCollapsed = true;
    }
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole(); // Obtiene el rol al inicializar
    this.checkIfMobile();
    this.cementerioService.getCementerioActivo().subscribe((c) => {
      this.cementerioActivo = c;
    });
    // Cierra el sidebar automáticamente al navegar en móvil
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) {
          this.isCollapsed = true;
        }
      });
    if (this.userRole === 'admin' || this.userRole === 'superadmin') {
      setTimeout(() => {
        this.cargarPendientes();
        this.iniciarPolling();
      }, 500);
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }
    if (this.userRole !== 'Invitado') {
      this.pushService.estasSuscrito().then((suscrito) => {
        if (!suscrito) {
          // Pequeño delay para no interrumpir la carga
          setTimeout(() => this.pushService.suscribir(), 3000);
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.detenerPolling();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private onVisibilityChange = (): void => {
    if (document.hidden) {
      // Pestaña en background — detener el polling, ahorra recursos
      this.detenerPolling();
    } else {
      // Pestaña activa de nuevo — recargar inmediatamente y reanudar
      this.cargarPendientes();
      this.iniciarPolling();
    }
  };

  private iniciarPolling(): void {
    this.detenerPolling(); // evita duplicados si ya había uno corriendo
    this.intervaloPendientes = setInterval(
      () => this.cargarPendientes(),
      60000,
    );
  }

  private detenerPolling(): void {
    if (this.intervaloPendientes) {
      clearInterval(this.intervaloPendientes);
      this.intervaloPendientes = null;
    }
  }

  cargarPendientes(): void {
    this.tramiteService.getPendientesCount().subscribe({
      next: (res) => {
        this.solicitudesPendientes = res.total;
      },
      error: () => {},
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarEnMovil(): void {
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  openLocalizarModal() {
    this.modalService.open(LocalizarModalComponent, {
      centered: true,
      size: 'md',
    });
  }

  openDisponibilidadModal() {
    this.modalService.open(DisponibilidadModalComponent, {
      centered: true,
      size: 'lg',
    });
  }

  editarBovedas() {
    this.modalService.open(GestionBovedasComponent, {
      centered: true,
      size: 'md',
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.cementerioService.limpiar();
    Swal.fire({
      toast: true,
      position: 'top-end',
      title: 'Cierre de sesión!',
      text: 'Has cerrado sesión correctamente.',
      timerProgressBar: true,
      timer: 1000,
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      // Redirige al usuario a la página de inicio después de cerrar sesión
      this.router.navigate(['/cementerios']);
    });
  }
}
