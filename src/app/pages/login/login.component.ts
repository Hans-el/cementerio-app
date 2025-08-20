import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbAlertModule, RouterModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router

  ) {
    this.loginForm = this.fb.group({
      cedula: ['', Validators.required],
      contrasena: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    const savedCedula = localStorage.getItem('rememberedCedula');
    const savedContrasena = localStorage.getItem('rememberedContrasena');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (rememberMe && savedCedula && savedContrasena) {
      this.loginForm.patchValue({
        cedula: savedCedula,
        contrasena: savedContrasena,
        rememberMe: true
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { cedula, contrasena, rememberMe } = this.loginForm.value;

      this.apiService.login(cedula, contrasena).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);

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
            title: 'Inicio de sesión exitoso!',
            text: 'Has iniciado sesión correctamente.',
            timerProgressBar: true,
            timer: 2200,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/inicio']);
          });
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'Cédula o contraseña incorrectos.',
            timerProgressBar: true,
            timer: 2200,
            icon: 'error',
            confirmButtonText: 'OK'
          });
          console.error('Error al iniciar sesión:', error);
        }
      );
    } else {
      this.errorMessage = 'Por favor, completa todos los campos.';
    }
  }
}
