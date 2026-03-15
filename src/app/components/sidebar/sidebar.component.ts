import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NgbDropdownModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  userRole: string = 'Invitado'; // Valor por defecto si no inicia sesión
  userName: string = ''; // Nombre del usuario para mostrar en el sidebar
  isCollapsed = false; // Estado del sidebar
  isMobile = false; // Estado para dispositivos móviles
  hover: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private usuarioService: UsuarioService,
  ) {}

  // Este HostListener escucha los cambios en el tamaño de la ventana para adaptar el sidebar a dispositivos móviles
  @HostListener('window:resize')
  checkIfMobile(event?: Event) {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole(); // Obtiene el rol al inicializar
    //this.userName = this.usuarioService.getUserName(t
    this.checkIfMobile();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
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

  // Este método es para que el administrador pueda agregar o editar bóvedas
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
      this.router.navigate(['/login']);
    });
  }
}
