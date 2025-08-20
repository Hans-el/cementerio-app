import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import moment from 'moment';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbAlertModule, RouterModule,],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/[A-Za-záéíóúÁÉÍÓÚñÑüÜ ]+/)]],
      cedula: ['', [Validators.required, Validators.pattern(/[0-9]{10}/), Validators.maxLength(10)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      genero: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  limitCedulaLength(): void {
    const cedulaControl = this.registroForm.get('cedula');
    if (cedulaControl && cedulaControl.value.length > 10) {
      cedulaControl.setValue(cedulaControl.value.slice(0, 10));
    }
  }

  checkAdult(): boolean {
    const fechaNacimiento = this.registroForm.get('fechaNacimiento')?.value;
    if (!fechaNacimiento) {
      return false;
    }
    const birthDate = moment(fechaNacimiento, 'YYYY-MM-DD');
    const today = moment();
    const age = today.diff(birthDate, 'years');
    return age >= 18;
  }

  isValidEmailDomain(): boolean {
    const correo = this.registroForm.get('correo')?.value;
    const allowedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'email.com', 'icloud.com', 'utm.edu.ec'];
    const emailDomain = correo.split('@')[1];
    return typeof emailDomain === 'string' && allowedDomains.includes(emailDomain);
  }

  onSubmit(): void {
    if (this.registroForm.invalid || !this.registroForm.get('acceptTerms')?.value) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    // Validamos si el usuario es mayor de edad
    if (!this.checkAdult()) {
      Swal.fire({
        title: 'Error!',
        text: 'Debes ser mayor de edad para registrarte.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validamos si la cédula tiene 10 dígitos
    if (this.registroForm.get('cedula')?.value.length !== 10) {
      Swal.fire({
        title: 'Error!',
        text: 'La cédula debe tener exactamente 10 dígitos.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validamos correos válidos
    if (!this.isValidEmailDomain()) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, introduce un correo electrónico válido.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Creamos el objeto de datos del usuario
    const userData = {
      nombre: this.registroForm.get('nombre')?.value,
      cedula: this.registroForm.get('cedula')?.value,
      correo: this.registroForm.get('correo')?.value,
      contrasena: this.registroForm.get('contrasena')?.value,
      genero: this.registroForm.get('genero')?.value,
      fechaNacimiento: this.registroForm.get('fechaNacimiento')?.value,
      rol: 'usuario'
    };

    // Mandamos los datos al servicio de API para registrar el usuario
    this.apiService.register(userData).subscribe(
      (response) => {
        Swal.fire({
          title: 'Registro exitoso!',
          text: 'Usuario registrado correctamente.',
          icon: 'success',
          timerProgressBar: true,
          timer: 3000,
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      (error) => {
        let errorMessage = 'Error al registrar usuario.';
        if (error.error && error.error.mensaje) {
          errorMessage = error.error.mensaje;
        }
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Error al registrar usuario:', error);
      }
    );
  }
}
