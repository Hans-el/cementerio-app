import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PerfilService } from '../../services/perfil.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbNavModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  activeTab = 1;
  perfilForm!: FormGroup;  // Aquí guardamos el formulario reactivo
  private userId: number = 0;

  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    //Inicializamos el formulario con valores vacíos
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      contactoEmergencia: [''],
      telefonoEmergencia: ['']
    });

    //Cargamos datos del usuario autenticado
    const user = this.authService.getUserFromToken();
    if (user && user.id) {
      this.userId = user.id;
      this.cargarPerfil(user.id);
    } else {
      Swal.fire('Error', 'Para editar primero debes iniciar sesión', 'error');
    }
  }

  cargarPerfil(id: number): void {
    this.perfilService.getPerfil(id).subscribe({
      next: (data) => {
        // Rellenamos el formulario con los datos del backend
        this.perfilForm.patchValue(data);
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        Swal.fire('Error', 'No se pudo cargar la información del perfil', 'error');
      }
    });
  }

  guardarCambios(): void {
    if (!this.userId) return;

    if (this.perfilForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    // Con esto enviamos los valores del formulario al backend clicqueando en guardar cambios.
    this.perfilService.updatePerfil(this.userId, this.perfilForm.value).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        Swal.fire('Error', 'No se pudieron guardar los cambios', 'error');
      }
    });
  }
}
