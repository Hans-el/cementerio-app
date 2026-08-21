import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { CementerioService } from '../../../../features/publico/services/cementerio.service';
import { Cementerio } from '../../../publico/models/cementerio.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbAlertModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';
  cementerios: Cementerio[] = [];
  cargando = false;
  loading = false;
  error = false;
  cementerioActivo: Cementerio | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cementerioService: CementerioService,
  ) {
    this.loginForm = this.fb.group({
      cedula: ['', Validators.required],
      contrasena: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.cementerioActivo =
      this.cementerioService.getCementerioActivoSnapshot();

    const savedCedula = localStorage.getItem('rememberedCedula');
    const savedContrasena = localStorage.getItem('rememberedContrasena');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (rememberMe && savedCedula && savedContrasena) {
      this.loginForm.patchValue({
        cedula: savedCedula,
        contrasena: savedContrasena,
        rememberMe: true,
      });
    }
    this.cementerioService.getCementerios().subscribe({
      next: (data) => {
        this.cementerios = data;
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loading = true;
    if (this.loginForm.valid) {
      const { cedula, contrasena, rememberMe } = this.loginForm.value;

      this.authService.login(cedula, contrasena).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
          this.authService.getUserRole(); // Guarda el rol en localStorage
          // Si el usuario eligió "Recuérdame", guarda sus credenciales en localStorage

          if (rememberMe) {
            localStorage.setItem('rememberedCedula', cedula);
            localStorage.setItem('rememberedContrasena', contrasena);
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberedCedula');
            localStorage.removeItem('rememberedContrasena');
            localStorage.removeItem('rememberMe');
          }
          this.loading = false;

          Swal.fire({
            toast: true, //Con este atributo se muestra como una notificación en la esquina, es mucho más elegante que un alert tradicional
            position: 'top-end',
            title: 'Bienvenido!',
            text: 'Has iniciado sesión correctamente.',
            timerProgressBar: true,
            timer: 1200,
            icon: 'success',
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/mapa']);
          });
        },
        (error) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            title: 'Ups!',
            text: 'Usuario o contraseña incorrecta.',
            timerProgressBar: true,
            timer: 2200,
            icon: 'error',
          });
          console.error('Error al iniciar sesión:', error);
          this.loading = false;
        },
      );
    } else {
      this.errorMessage = 'Por favor, completa todos los campos.';
    }
  }
}
