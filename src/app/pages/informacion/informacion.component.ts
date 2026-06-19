import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CementerioService } from '../../services/cementerio.service';
import { FallecidoService } from '../../services/fallecido.service';
import { Cementerio } from '../../models/cementerio.model';

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.css'
})
export class InformacionComponent implements OnInit {

  anioActual = new Date().getFullYear();
  cementerioActivo: Cementerio | null = null;

  // Buscador
  terminoBusqueda = '';
  sugerencias: string[] = [];
  mostrarSugerencias = false;
  mostrarResultadoBloqueado = false;
  buscando = false;

  // Modal
  modalVisible = false;
  modalConfig = {
    icono: '',
    titulo: '',
    descripcion: '',
    esLibre: false,
  };

  // FAQ
  faqAbierto: number | null = null;

  faqs = [
    {
      pregunta: '¿Necesito registro para ver el mapa?',
      respuesta: 'No. El mapa del cementerio y la consulta de espacios disponibles son de acceso libre. No necesita crear una cuenta para verlos.',
    },
    {
      pregunta: '¿Cuánto demora en aprobarse una solicitud?',
      respuesta: 'El tiempo depende de la administración del cementerio. Una vez que usted realice el pago presencial, la solicitud será aprobada y recibirá una notificación por correo electrónico.',
    },
    {
      pregunta: '¿Puedo registrarme si no tengo correo electrónico?',
      respuesta: 'El correo electrónico es requerido para el registro. Si no tiene uno, puede solicitar ayuda en la administración del cementerio para orientarle en el proceso.',
    },
    {
      pregunta: '¿El pago se realiza en línea?',
      respuesta: 'No. Los pagos se realizan de forma presencial en las oficinas del cementerio. El sistema le permite gestionar los documentos digitalmente, pero el pago se confirma en persona.',
    },
    {
      pregunta: '¿Mis datos están seguros?',
      respuesta: 'Sí. El sistema utiliza cifrado de datos y sus documentos se almacenan de forma segura. Solo la administración autorizada puede acceder a su información.',
    },
  ];

  readonly servicios = [
    {
      key: 'mapa',
      icono: 'bi-map',
      tipo: 'Acceso libre',
      tipoIcono: 'bi-eye',
      esLibre: true,
      titulo: 'Mapa del cementerio',
      descripcion: 'Visualice el plano completo del cementerio. Navegue por sectores, manzanas y bloques de forma visual e intuitiva.',
      tag: 'Sin registro',
      tagIcono: 'bi-check-circle',
      tagClase: 'tag-free',
    },
    {
      key: 'localizacion',
      icono: 'bi-pin-map',
      tipo: 'Requiere sesión',
      tipoIcono: 'bi-lock',
      esLibre: false,
      titulo: 'Localizar fallecido',
      descripcion: 'Encuentre la ubicación exacta de su familiar dentro del cementerio con código de bloque y espacio preciso.',
      tag: 'Iniciar sesión',
      tagIcono: 'bi-box-arrow-in-right',
      tagClase: 'tag-login',
    },
    {
      key: 'inhumacion',
      icono: 'bi-file-earmark-arrow-up',
      tipo: 'Requiere sesión',
      tipoIcono: 'bi-lock',
      esLibre: false,
      titulo: 'Solicitud de inhumación',
      descripcion: 'Suba los 7 documentos requeridos y gestione su solicitud desde casa. Costo del trámite: $10.90.',
      tag: 'Iniciar sesión',
      tagIcono: 'bi-box-arrow-in-right',
      tagClase: 'tag-login',
    },
    {
      key: 'exhumacion',
      icono: 'bi-file-earmark-arrow-down',
      tipo: 'Requiere sesión',
      tipoIcono: 'bi-lock',
      esLibre: false,
      titulo: 'Solicitud de exhumación',
      descripcion: 'Presente los 4 documentos necesarios de forma digital. Costo del trámite: $27.03.',
      tag: 'Iniciar sesión',
      tagIcono: 'bi-box-arrow-in-right',
      tagClase: 'tag-login',
    },
    {
      key: 'disponibilidad',
      icono: 'bi-building',
      tipo: 'Acceso libre',
      tipoIcono: 'bi-eye',
      esLibre: true,
      titulo: 'Espacios disponibles',
      descripcion: 'Consulte los bloques disponibles para adquisición. Conozca ubicación, tipo y características de cada espacio.',
      tag: 'Sin registro',
      tagIcono: 'bi-check-circle',
      tagClase: 'tag-free',
    },
    {
      key: 'estado',
      icono: 'bi-bell',
      tipo: 'Requiere sesión',
      tipoIcono: 'bi-lock',
      esLibre: false,
      titulo: 'Estado de solicitudes',
      descripcion: 'Revise el estado de sus trámites en tiempo real y reciba notificaciones cuando sean aprobados o rechazados.',
      tag: 'Iniciar sesión',
      tagIcono: 'bi-box-arrow-in-right',
      tagClase: 'tag-login',
    },
  ];

  readonly pasos = [
    { num: '01', titulo: 'Seleccione su cementerio', desc: 'Elija el cementerio al que pertenece su trámite desde la pantalla de inicio.' },
    { num: '02', titulo: 'Cree su cuenta', desc: 'Regístrese con su nombre, cédula y correo electrónico. Es rápido y gratuito.' },
    { num: '03', titulo: 'Inicie sesión', desc: 'Ingrese con su cédula y contraseña para acceder a todos los servicios disponibles.' },
    { num: '04', titulo: 'Gestione su trámite', desc: 'Suba sus documentos, haga seguimiento y reciba notificaciones por correo.' },
  ];

  readonly modalConfigs: Record<string, { icono: string; titulo: string; descripcion: string; esLibre: boolean }> = {
    mapa: { icono: 'bi-map', titulo: 'Ver mapa', esLibre: true, descripcion: 'El mapa es de acceso libre. Puede verlo sin iniciar sesión.' },
    localizacion: { icono: 'bi-pin-map', titulo: 'Localizar fallecido', esLibre: false, descripcion: 'Para ver la ubicación exacta de un fallecido debe iniciar sesión en su cementerio.' },
    inhumacion: { icono: 'bi-file-earmark-arrow-up', titulo: 'Solicitud de inhumación', esLibre: false, descripcion: 'Para enviar una solicitud de inhumación debe iniciar sesión. El trámite tiene un costo de $10.90 que se paga presencialmente.' },
    exhumacion: { icono: 'bi-file-earmark-arrow-down', titulo: 'Solicitud de exhumación', esLibre: false, descripcion: 'Para enviar una solicitud de exhumación debe iniciar sesión. El trámite tiene un costo de $27.03 que se paga presencialmente.' },
    disponibilidad: { icono: 'bi-building', titulo: 'Espacios disponibles', esLibre: true, descripcion: 'La consulta de espacios disponibles es libre. Puede verla sin iniciar sesión.' },
    estado: { icono: 'bi-bell', titulo: 'Estado de solicitudes', esLibre: false, descripcion: 'Para revisar el estado de sus trámites debe iniciar sesión en su cementerio.' },
  };

  constructor(
    private fallecidoService: FallecidoService,
    private cementerioService: CementerioService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.cementerioActivo = this.cementerioService.getCementerioActivoSnapshot();
  }

  // ── Buscador ────────────────────────────────────────────────────────

  onBusquedaChange(): void {
    this.mostrarResultadoBloqueado = false;

    if (this.terminoBusqueda.length < 2) {
      this.sugerencias = [];
      this.mostrarSugerencias = false;
      return;
    }

    // Usa el endpoint público de sugerencias — no requiere token
    this.fallecidoService.obtenerSugerenciasNombres(this.terminoBusqueda).subscribe({
      next: (nombres) => {
        this.sugerencias = nombres;
        this.mostrarSugerencias = nombres.length > 0;
      },
      error: () => {
        this.sugerencias = [];
        this.mostrarSugerencias = false;
      },
    });
  }

  seleccionarSugerencia(nombre: string): void {
    this.terminoBusqueda = nombre;
    this.sugerencias = [];
    this.mostrarSugerencias = false;
    this.mostrarResultadoBloqueado = true;
  }

  buscar(): void {
    if (!this.terminoBusqueda.trim()) return;
    this.mostrarSugerencias = false;
    this.mostrarResultadoBloqueado = true;
  }

  // ── Modal ───────────────────────────────────────────────────────────

  abrirModal(key: string): void {
    const config = this.modalConfigs[key];
    if (!config) return;
    this.modalConfig = config;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  irALogin(): void {
    this.cerrarModal();
    // Si hay cementerio activo va al login, si no va a seleccionar cementerio
    if (this.cementerioActivo) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/cementerios']);
    }
  }

  // ── FAQ ─────────────────────────────────────────────────────────────

  toggleFaq(index: number): void {
    this.faqAbierto = this.faqAbierto === index ? null : index;
  }
}
