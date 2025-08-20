import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalizarModalComponent } from '../localizar-modal/localizar-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, CommonModule, NgbDropdownModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = signal(false);

  constructor(private authService: AuthService, private router: Router, private modalService:NgbModal) { }
  toggleSidebar() {
    this.isCollapsed.update(value => !value);
  }

   openLocalizarModal() {
    const modalRef = this.modalService.open(LocalizarModalComponent, {
      centered: true,
      size: 'md'
    });
  }
  logout(): void {
    this.authService.logout(); {
      Swal.fire({
        title: 'Cierre se sesión!',
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
