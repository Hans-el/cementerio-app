import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ContactoService } from '../../services/contacto.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent {
  formData = {
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  };

  mensajeEnviado: string | null = null;
  error: string | null = null;

  constructor(private contactoService: ContactoService) {}

  enviarMensaje() {
    this.mensajeEnviado = null;
    this.error = null;

    this.contactoService.enviarMensaje(this.formData).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: 'Enviado!',
          text: 'Correo enviado exitosamente.',
          timerProgressBar: true,
          timer: 3000,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.mensajeEnviado = res.mensaje;
        this.formData = {
          nombre: '',
          email: '',
          telefono: '',
          asunto: '',
          mensaje: '',
        }; // Limpiar formulario
      },
      error: (err) => {
        this.error = 'Error al enviar el mensaje. Inténtalo de nuevo.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.error,
          confirmButtonText: 'Aceptar',
        });
        console.error(err);
      },
    });
  }
}
