import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfilService } from '../../services/perfil.service';
import { CementerioService } from '../../../../features/publico/services/cementerio.service';
import { Cementerio } from '../../models/cementerio.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbNavModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  tabActivo: 'datos' | 'contrasena' = 'datos';
  guardando = false;
  cambiando = false;
  cargando = true;
  userId: number = 0;
  userRol = '';
  cementerioActivo: Cementerio | null = null;

  // Mostrar/ocultar contraseñas
  verActual = false;
  verNueva = false;
  verConfirm = false;

  datosForm!: FormGroup;
  contrasenaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private authService: AuthService,
    private cementerioService: CementerioService,
  ) {}

  ngOnInit(): void {
    this.cementerioActivo =
      this.cementerioService.getCementerioActivoSnapshot();
    this.userRol = this.authService.getUserRole();

    this.datosForm = this.fb.group({
      nombre: ['', Validators.required],
      cedula: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      contactoEmergencia: [''],
      telefonoEmergencia: [''],
    });

    this.contrasenaForm = this.fb.group(
      {
        contrasenaActual: ['', Validators.required],
        contrasenaNueva: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContrasena: ['', Validators.required],
      },
      { validators: this.contrasenasIguales },
    );

    const user = this.authService.getUserFromToken();
    if (user?.id) {
      this.userId = user.id;
      this.cargarPerfil(user.id);
    }
  }

  cargarPerfil(id: number): void {
    this.cargando = true;
    this.perfilService.getPerfil(id).subscribe({
      next: (data) => {
        this.datosForm.patchValue(data);
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudo cargar el perfil.', 'error');
      },
    });
  }

  // Validador personalizado — contraseñas deben coincidir
  contrasenasIguales(form: FormGroup) {
    const nueva = form.get('contrasenaNueva')?.value;
    const confirmar = form.get('confirmarContrasena')?.value;
    return nueva === confirmar ? null : { noCoinciden: true };
  }

  guardarDatos(): void {
    if (this.datosForm.invalid) {
      this.datosForm.markAllAsTouched();
      return;
    }

    Swal.fire({
      title: '¿Guardar cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.guardando = true;

      this.perfilService
        .updatePerfil(this.userId, this.datosForm.value)
        .subscribe({
          next: () => {
            this.guardando = false;
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Perfil actualizado correctamente.',
              timer: 2500,
              showConfirmButton: false,
            });
          },
          error: (err) => {
            this.guardando = false;
            Swal.fire(
              'Error',
              err.error?.mensaje || 'No se pudo actualizar el perfil.',
              'error',
            );
          },
        });
    });
  }

  cambiarContrasena(): void {
    if (this.contrasenaForm.invalid) {
      this.contrasenaForm.markAllAsTouched();
      return;
    }

    const { contrasenaActual, contrasenaNueva } = this.contrasenaForm.value;
    this.cambiando = true;

    this.perfilService
      .cambiarContrasena(contrasenaActual, contrasenaNueva)
      .subscribe({
        next: () => {
          this.cambiando = false;
          this.contrasenaForm.reset();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Contraseña actualizada correctamente.',
            timer: 2500,
            showConfirmButton: false,
          });
        },
        error: (err) => {
          this.cambiando = false;
          Swal.fire(
            'Error',
            err.error?.mensaje || 'No se pudo cambiar la contraseña.',
            'error',
          );
        },
      });
  }

  // Helpers para validación en el HTML
  campo(nombre: string) {
    return this.datosForm.get(nombre);
  }
  campoClave(nombre: string) {
    return this.contrasenaForm.get(nombre);
  }

  get rolLabel(): string {
    switch (this.userRol) {
      case 'admin':
        return 'Administrador';
      case 'superadmin':
        return 'Super Administrador';
      default:
        return 'Usuario';
    }
  }

  get inicialesNombre(): string {
    const nombre = this.datosForm.get('nombre')?.value || '';
    return (
      nombre
        .split(' ')
        .slice(0, 2)
        .map((n: string) => n[0])
        .join('')
        .toUpperCase() || '?'
    );
  }
  get seguridadPorcentaje(): number {
    const val = this.contrasenaForm.get('contrasenaNueva')?.value || '';
    let puntos = 0;
    if (val.length >= 6) puntos += 25;
    if (val.length >= 10) puntos += 25;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) puntos += 25;
    if (/[0-9]/.test(val) || /[^a-zA-Z0-9]/.test(val)) puntos += 25;
    return puntos;
  }

  get seguridadClase(): string {
    const p = this.seguridadPorcentaje;
    if (p <= 25) return 'seg-debil';
    if (p <= 50) return 'seg-media';
    if (p <= 75) return 'seg-buena';
    return 'seg-fuerte';
  }

  get seguridadTexto(): string {
    const p = this.seguridadPorcentaje;
    if (p <= 25) return 'Débil';
    if (p <= 50) return 'Media';
    if (p <= 75) return 'Buena';
    return 'Fuerte';
  }
}
