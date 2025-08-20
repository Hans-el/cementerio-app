import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',  
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  contactForm: any;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      asunto: [''],
      mensaje: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Formulario enviado:', this.contactForm.value);
      Swal.fire({
        title: '¡Mensaje enviado!',
        text: 'Gracias por contactarnos, nos pondremos en contacto contigo pronto.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.contactForm.reset();
    } else {
      alert('Por favor completa los campos obligatorios.');
    }
  }
}
