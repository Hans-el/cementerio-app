import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
//usaremos date-fns en vez de moment.js porque es más ligero y moderno
import { parseISO, differenceInYears } from 'date-fns';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgbAlertModule,
    RouterModule,
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';
  model: any; // Para el datepicker
  loading = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registroForm = this.fb.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern(/[A-Za-záéíóúÁÉÍÓÚñÑüÜ ]+/)],
      ],
      cedula: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      genero: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  onlyNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/\D/g, '');

    this.registroForm.patchValue({
      cedula: input.value,
    });
  }

  // Función de validar cédula matemáticamente. Me la pasó Anderson por whatsapp.
  public validar_cedula(cedula: string) {
    // Créditos: Victor Diaz De La Gasca.
    // Autor: Adrián Egüez
    // Url autor: https://gist.github.com/vickoman/7800717
    // Preguntamos si la cedula consta de 10 digitos
    if (cedula.length === 10) {
      // Obtenemos el digito de la region que sonlos dos primeros digitos
      const digitoRegion = cedula.substring(0, 2);

      // Pregunto si la region existe ecuador se divide en 24 regiones
      if (digitoRegion >= String(0) && digitoRegion <= String(24)) {
        // Extraigo el ultimo digito
        const ultimoDigito = Number(cedula.substring(9, 10));

        // Agrupo todos los pares y los sumo
        const pares =
          Number(cedula.substring(1, 2)) +
          Number(cedula.substring(3, 4)) +
          Number(cedula.substring(5, 6)) +
          Number(cedula.substring(7, 8));

        // Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
        let numeroUno: any = cedula.substring(0, 1);
        numeroUno = numeroUno * 2;
        if (numeroUno > 9) {
          numeroUno = numeroUno - 9;
        }

        let numeroTres: any = cedula.substring(2, 3);
        numeroTres = numeroTres * 2;
        if (numeroTres > 9) {
          numeroTres = numeroTres - 9;
        }

        let numeroCinco: any = cedula.substring(4, 5);
        numeroCinco = numeroCinco * 2;
        if (numeroCinco > 9) {
          numeroCinco = numeroCinco - 9;
        }

        let numeroSiete: any = cedula.substring(6, 7);
        numeroSiete = numeroSiete * 2;
        if (numeroSiete > 9) {
          numeroSiete = numeroSiete - 9;
        }

        let numeroNueve: any = cedula.substring(8, 9);
        numeroNueve = numeroNueve * 2;
        if (numeroNueve > 9) {
          numeroNueve = numeroNueve - 9;
        }

        const impares =
          numeroUno + numeroTres + numeroCinco + numeroSiete + numeroNueve;

        // Suma total
        const sumaTotal = pares + impares;

        // extraemos el primero digito
        const primerDigitoSuma = String(sumaTotal).substring(0, 1);

        // Obtenemos la decena inmediata
        const decena = (Number(primerDigitoSuma) + 1) * 10;

        // Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
        let digitoValidador = decena - sumaTotal;

        // Si el digito validador es = a 10 toma el valor de 0
        if (digitoValidador === 10) {
          digitoValidador = 0;
        }

        // Validamos que el digito validador sea igual al de la cedula
        if (digitoValidador === ultimoDigito) {
          return true;
        } else {
          console.log('numero incorrecto.');
          return false;
        }
      } else {
        // imprimimos en consola si la region no pertenece
        console.log('numero incorrecto 2.');
        return false;
      }
    } else {
      // Imprimimos en consola si la cedula tiene mas o menos de 10 digitos
      console.log('numero incorrecto.');
      return false;
    }
  }
  // establecer un límite de 10 caracteres para el campo cédula
  limitCedulaLength(): void {
    const cedulaControl = this.registroForm.get('cedula');
    if (cedulaControl && cedulaControl.value.length > 10) {
      cedulaControl.setValue(cedulaControl.value.slice(0, 10));
    }
  }

  checkAdult(): boolean {
    const fechaNacimiento = this.registroForm.get('fechaNacimiento')?.value;
    if (!fechaNacimiento) return false;

    const birthDate = parseISO(fechaNacimiento);
    const age = differenceInYears(new Date(), birthDate);
    return age >= 18;
  }

  isValidEmailDomain(): boolean {
    const correo = this.registroForm.get('correo')?.value;
    if (!correo || !correo.includes('@')) return false;

    const allowedDomains = [
      'gmail.com',
      'outlook.com',
      'yahoo.com',
      'hotmail.com',
      'email.com',
      'icloud.com',
      'utm.edu.ec',
    ];

    const emailDomain = correo.split('@')[1];
    return allowedDomains.includes(emailDomain);
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    // Validar cédula ecuatoriana
    const cedulaValue = this.registroForm.get('cedula')?.value;

    if (!this.validar_cedula(cedulaValue)) {
      Swal.fire({
        title: 'Error',
        text: 'La cédula ingresada no es válida.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Validar mayoría de edad
    if (!this.checkAdult()) {
      Swal.fire({
        title: 'Error',
        text: 'Debes ser mayor de edad para registrarte.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Validar dominio del correo
    if (!this.isValidEmailDomain()) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, introduce un correo electrónico válido.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const userData = {
      nombre: this.registroForm.get('nombre')?.value,
      cedula: cedulaValue,
      correo: this.registroForm.get('correo')?.value,
      contrasena: this.registroForm.get('contrasena')?.value,
      genero: this.registroForm.get('genero')?.value,
      fechaNacimiento: this.registroForm.get('fechaNacimiento')?.value,
      rol: 'usuario',
    };

    // Limpiar mensajes anteriores
    this.errorMessage = '';
    this.successMessage = '';

    // Activar spinner
    this.loading = true;

    // Evitar doble envío
    this.registroForm.disable();

    this.authService.registrar(userData).subscribe({
      next: (response) => {
        console.log('Usuario registrado:', response);

        this.loading = false;

        this.successMessage =
          'Cuenta creada correctamente. Serás redirigido al inicio de sesión.';

        // Esperar 2.5 segundos antes de redirigir
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },

      error: (error) => {
        this.loading = false;

        this.registroForm.enable();

        let mensaje = 'Error al registrar usuario.';

        if (error.error?.mensaje) {
          mensaje = error.error.mensaje;
        }

        Swal.fire({
          title: 'Error',
          text: mensaje,
          icon: 'error',
          confirmButtonText: 'OK',
        });

        console.error('Error al registrar usuario:', error);
      },
    });
  }
}
