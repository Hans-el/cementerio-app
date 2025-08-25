import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NgbNavModule  } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
   activeTab = 1;

  perfil = {
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    direccion: '',
    contactoEmergencia: '',
    telefonoEmergencia: ''
  };

  guardarCambios() {
    console.log('Datos guardados:', this.perfil);
    alert('Cambios guardados correctamente ✅');
  }
}
