import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SuperadminService } from '../../services/superadmin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './superadmin.component.html',
  styleUrl: './superadmin.component.css',
})
export class SuperadminComponent implements OnInit {
  tabActivo: 'cementerios' | 'admins' = 'cementerios';

  // Datos
  cementerios: any[] = [];
  admins: any[] = [];
  cargando = false;

  // Modales
  modalCementerio = false;
  modalAdmin = false;
  editandoCementerio: any = null;
  editandoAdmin: any = null;

  // Formularios
  cementerioForm!: FormGroup;
  adminForm!: FormGroup;

  // Filtros
  filtroCementerio = '';
  filtroAdmin = '';

  constructor(
    private fb: FormBuilder,
    private superadminService: SuperadminService,
  ) {}

  ngOnInit(): void {
    this.iniciarForms();
    this.cargarCementerios();
    this.cargarAdmins();
  }

  iniciarForms(): void {
    this.cementerioForm = this.fb.group({
      nombre: ['', Validators.required],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      descripcion: [''],
      direccion: [''],
      telefono: [''],
      correo: ['', Validators.email],
      color_primario: ['#2d5a27'],
    });

    this.adminForm = this.fb.group({
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
      contrasena: ['', Validators.required],
      id_cementerio: [null, Validators.required],
    });
  }

  // ── Cementerios ───────────────────────────────────────────

  cargarCementerios(): void {
    this.cargando = true;
    this.superadminService.getCementerios().subscribe({
      next: (data) => {
        this.cementerios = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  get cementeriosFiltrados(): any[] {
    if (!this.filtroCementerio) return this.cementerios;
    const t = this.filtroCementerio.toLowerCase();
    return this.cementerios.filter(
      (c) =>
        c.nombre.toLowerCase().includes(t) || c.slug.toLowerCase().includes(t),
    );
  }

  abrirModalCementerio(cementerio?: any): void {
    this.editandoCementerio = cementerio ?? null;
    this.cementerioForm.reset({ color_primario: '#2d5a27' });
    if (cementerio) {
      this.cementerioForm.patchValue(cementerio);
      this.cementerioForm.get('slug')?.disable();
    } else {
      this.cementerioForm.get('slug')?.enable();
    }
    this.modalCementerio = true;
  }

  guardarCementerio(): void {
    if (this.cementerioForm.invalid) {
      this.cementerioForm.markAllAsTouched();
      return;
    }

    const datos = this.cementerioForm.getRawValue();
    const obs$ = this.editandoCementerio
      ? this.superadminService.editarCementerio(
          this.editandoCementerio.id_cementerio,
          datos,
        )
      : this.superadminService.crearCementerio(datos);

    obs$.subscribe({
      next: () => {
        this.modalCementerio = false;
        this.cargarCementerios();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: this.editandoCementerio
            ? 'Cementerio actualizado.'
            : 'Cementerio creado.',
          timer: 2500,
          showConfirmButton: false,
        });
      },
      error: (err) =>
        Swal.fire(
          'Error',
          err.error?.mensaje || 'No se pudo guardar.',
          'error',
        ),
    });
  }

  toggleActivo(c: any): void {
    const accion = c.activo ? 'desactivar' : 'activar';
    Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} "${c.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: c.activo ? '#dc3545' : '#2d5a27',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.superadminService.toggleActivoCementerio(c.id_cementerio).subscribe({
        next: () => this.cargarCementerios(),
        error: () =>
          Swal.fire('Error', 'No se pudo cambiar el estado.', 'error'),
      });
    });
  }

  // ── Administradores ───────────────────────────────────────

  cargarAdmins(): void {
    this.superadminService.getAdmins().subscribe({
      next: (data) => {
        this.admins = data;
      },
      error: () => {},
    });
  }

  get adminsFiltrados(): any[] {
    if (!this.filtroAdmin) return this.admins;
    const t = this.filtroAdmin.toLowerCase();
    return this.admins.filter(
      (a) =>
        a.nombre.toLowerCase().includes(t) ||
        a.cedula.includes(t) ||
        a.nombre_cementerio?.toLowerCase().includes(t),
    );
  }

  abrirModalAdmin(admin?: any): void {
    this.editandoAdmin = admin ?? null;
    this.adminForm.reset();

    if (admin) {
      this.adminForm.patchValue(admin);
      this.adminForm.get('contrasena')?.clearValidators();
    } else {
      this.adminForm
        .get('contrasena')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.adminForm.get('contrasena')?.updateValueAndValidity();
    this.modalAdmin = true;
  }

  guardarAdmin(): void {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const datos = this.adminForm.value;
    const obs$ = this.editandoAdmin
      ? this.superadminService.editarAdmin(this.editandoAdmin.id, datos)
      : this.superadminService.crearAdmin(datos);

    obs$.subscribe({
      next: () => {
        this.modalAdmin = false;
        this.cargarAdmins();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: this.editandoAdmin ? 'Admin actualizado.' : 'Admin creado.',
          timer: 2500,
          showConfirmButton: false,
        });
      },
      error: (err) =>
        Swal.fire(
          'Error',
          err.error?.mensaje || 'No se pudo guardar.',
          'error',
        ),
    });
  }

  eliminarAdmin(admin: any): void {
    Swal.fire({
      title: `¿Eliminar a "${admin.nombre}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.superadminService.eliminarAdmin(admin.id).subscribe({
        next: () => {
          this.cargarAdmins();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Admin eliminado.',
            timer: 2000,
            showConfirmButton: false,
          });
        },
        error: (err) =>
          Swal.fire(
            'Error',
            err.error?.mensaje || 'No se pudo eliminar.',
            'error',
          ),
      });
    });
  }

  resetContrasena(admin: any): void {
    Swal.fire({
      title: `Restablecer contraseña`,
      html: `Nueva contraseña para <strong>${admin.nombre}</strong>`,
      input: 'password',
      inputPlaceholder: 'Mínimo 6 caracteres',
      showCancelButton: true,
      confirmButtonText: 'Restablecer',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2d5a27',
      inputValidator: (v) =>
        !v || v.length < 6 ? 'Mínimo 6 caracteres.' : null,
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.superadminService.resetContrasena(admin.id, result.value).subscribe({
        next: () =>
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Contraseña restablecida.',
            timer: 2000,
            showConfirmButton: false,
          }),
        error: () =>
          Swal.fire('Error', 'No se pudo restablecer la contraseña.', 'error'),
      });
    });
  }

  // Helpers
  campo(f: string) {
    return this.cementerioForm.get(f);
  }
  campoAdmin(f: string) {
    return this.adminForm.get(f);
  }
  cerrarModales(): void {
    this.modalCementerio = false;
    this.modalAdmin = false;
  }
}
