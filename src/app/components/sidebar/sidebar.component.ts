import { Component, HostListener, ElementRef } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalizarModalComponent } from '../localizar-modal/localizar-modal.component';
import { DisponibilidadModalComponent } from '../disponibilidad-modal/disponibilidad-modal.component';
import { GestionBovedasComponent } from '../gestion-bloques/gestion-bovedas.component';
import { UsuarioService } from '../../services/usuario.service';
import { ExhumacionService } from '../../services/exhumacion.service';
import { InhumacionService } from '../../services/inhumacion.service';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CementerioService } from '../../services/cementerio.service';
import { Cementerio } from '../../models/cementerio.model';
import { TramiteService } from '../../services/tramite.service';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NgbDropdownModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  solicitudesPendientes = 0;
  userRole: string = 'Invitado'; // Valor por defecto si no inicia sesión
  userName: string = ''; // Nombre del usuario para mostrar en el sidebar
  isCollapsed = false; // Estado del sidebar
  isMobile = false; // Estado para dispositivos móviles
  hover: boolean = false;
  cementerioActivo: Cementerio | null = null;


  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private elementRef: ElementRef,
    private cementerioService: CementerioService,
    private tramiteService: TramiteService
  ) { }

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

    const clickDentroSidebar = this.elementRef.nativeElement.contains(event.target);
    const clickEnBotonToggle = (event.target as HTMLElement).closest('.btn-toggle-sidebar');

    if (!clickDentroSidebar && !clickEnBotonToggle) {
      this.isCollapsed = true;
    }
  }


  ngOnInit(): void {
    this.userRole = this.authService.getUserRole(); // Obtiene el rol al inicializar
    this.checkIfMobile();
    this.cementerioService.getCementerioActivo().subscribe(c => {
      this.cementerioActivo = c;
    });
    // Cierra el sidebar automáticamente al navegar en móvil
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) {
          this.isCollapsed = true;
        }
      });
    if (this.userRole === 'admin' || this.userRole === 'superadmin') {
      setTimeout(() => {
        this.cargarPendientes();
        // Refrescar cada 60 segundos para mantener el badge actualizado
        setInterval(() => this.cargarPendientes(), 60000);
      }, 500);
    }

  }

  cargarPendientes(): void {
    this.tramiteService.getPendientesCount().subscribe({
      next: (res) => {
        this.solicitudesPendientes = res.total;
      },
      error: () => { }
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
