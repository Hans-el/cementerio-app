import { Component, signal, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
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
  imports: [NgClass, RouterLink, RouterLinkActive, CommonModule, NgbDropdownModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole: string = 'Invitado'; // Valor por defecto

  isCollapsed = signal(false);
  @Output() sidebarStateChange = new EventEmitter<boolean>();


  constructor(private authService: AuthService, private router: Router, private modalService: NgbModal) { }
  toggleSidebar() {
    this.isCollapsed.update(value => !value);
    this.sidebarStateChange.emit(this.isCollapsed());
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole(); // Obtiene el rol al inicializar
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
    this.authService.logout(); {
      Swal.fire({
        title: 'Cierre de sesión!',
        text: 'Has cerrado sesión correctamente.',
        timerProgressBar: true,
        timer: 2200,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        localStorage.removeItem('token'); // Eliminamos el token
        this.router.navigate(['/login']);
      });
    }
  }
}
