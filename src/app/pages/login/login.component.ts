import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { CementerioService } from '../../services/cementerio.service';
import { Cementerio } from '../../models/cementerio.model';

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
  error = false;



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
    const cementerio = this.cementerioService.getCementerioActivoSnapshot();

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

          Swal.fire({
            toast: true, //Con este atributo se muestra como una notificación en la esquina, es mucho más elegante que un alert tradicional
            position: 'top-end',
            title: 'Inicio de sesión exitoso!',
            text: 'Has iniciado sesión correctamente.',
            timerProgressBar: true,
            timer: 1000,
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
            title: 'Error!',
            text: 'Credenciales inválidas. Por favor, intenta de nuevo.',
            timerProgressBar: true,
            timer: 1000,
            icon: 'error',
          });
          console.error('Error al iniciar sesión:', error);
        },
      );
    } else {
      this.errorMessage = 'Por favor, completa todos los campos.';
    }
  }
}
