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
import { GestionBovedasComponent } from '../gestion-bovedas/gestion-bovedas.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NgbDropdownModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
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
  ) { }



  @HostListener('window:resize', ['$event'])
  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole(); // Obtiene el rol al inicializar
    //this.userName = this.authService.getUserFromToken()?.nombre || ''; // para mostrar el nombre del usuario en el sidebar
    this.checkIfMobile();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  openLocalizarModal() {
    this.modalService.open(LocalizarModalComponent, { centered: true, size: 'md' });
  }

  openDisponibilidadModal() {
    this.modalService.open(DisponibilidadModalComponent, { centered: true, size: 'lg' });
  }

  // Este método es para que el administrador pueda agregar o editar bóvedas
  editarBovedas() {
    this.modalService.open(GestionBovedasComponent, { centered: true, size: 'md' });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    Swal.fire({
      title: 'Cierre de sesión!',
      text: 'Has cerrado sesión correctamente.',
      timerProgressBar: true,
      timer: 2200,
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      // localStorage.removeItem('token');  *NOTA: No hace falta porque ya lo hace el authService.logout(). Se pone a manera de entendimiento*
      this.router.navigate(['/login']);
    });
  }
}
