import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ReportesService } from '../../services/reportes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent {
  startDate: string = '';
  endDate: string = '';
  reportType: string = 'Espacios';
  reportData: any[] = [];
  useDateRange: boolean = false; // Variable para controlar si se usa rango de fechas, en caso de no haber pues que se generan todos los datos
  fechaActual: Date = new Date(); // Variable para mostrar la fecha actual en el HTML
  filtroTipoSolicitud: string = 'TODOS';   // TODOS | inhumacion | exhumacion
  filtroEstadoSolicitud: string = 'TODOS'; // TODOS | PENDIENTE | APROBADA | RECHAZADA

  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void { }

  generateReport(): void {
    if (this.useDateRange && (!this.startDate || !this.endDate)) {
      Swal.fire({
        icon: 'warning',
        title: 'Rango de fechas incompleto',
        text: 'Por favor, selecciona un rango de fechas.',
      });
      return;
    }

    if (this.reportType === 'Espacios') {
      if (this.useDateRange) {
        this.reportesService
          .getReporteOcupaciones(this.startDate, this.endDate)
          .subscribe({
            next: (data) => {
              this.reportData = data;
              this.exportToExcel(data, 'Reporte_Ocupaciones');
            },
            error: () => {
              console.error('Error al obtener el reporte de ocupaciones');
              Swal.fire({
                toast: true,
                position: 'top-end',
                timer: 3000,
                icon: 'error',
                title: 'Error',
                text: 'No se pudo obtener el reporte de ocupaciones.',
              });
            },
          });
      } else {
        this.reportesService.getReporteOcupaciones().subscribe({
          next: (data) => {
            this.reportData = data;
            this.exportToExcel(data, 'Reporte_Total_Ocupaciones');
          },
          error: () => {
            console.error('Error al obtener el reporte total de ocupaciones');
            Swal.fire({
              toast: true,
              position: 'top-end',
              timer: 3000,
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener el reporte total de ocupaciones.',
            });
          },
        });
      }
    } else if (this.reportType === 'Fallecidos') {
      if (this.useDateRange) {
        this.reportesService
          .getReporteFallecidos(this.startDate, this.endDate)
          .subscribe({
            next: (data) => {
              this.exportToExcel(data, 'Reporte_Fallecidos');
            },
            error: () => {
              console.error('Error al obtener el reporte de fallecidos');
            },
          });
      } else {
        this.reportesService.getReporteFallecidos().subscribe({
          next: (data) => {
            this.exportToExcel(data, 'Reporte_Total_Fallecidos');
          },
          error: () => {
            console.error('Error al obtener el reporte total de fallecidos');
          },
        });
      }
    } else if (this.reportType === 'Solicitudes') {
      if (this.useDateRange) {
        this.reportesService
          .getReporteSolicitudes(this.startDate, this.endDate)
          .subscribe({
            next: (data) => {
              this.exportToExcel(data, 'Reporte_Solicitudes');
            },
            error: () => {
              console.error('Error al obtener el reporte de solicitudes');
            },
          });
      } else {
        this.reportesService.getReporteSolicitudes().subscribe({
          next: (data) => {
            this.exportToExcel(data, 'Reporte_Total_Solicitudes');
          },
          error: () => {
            console.error('Error al obtener el reporte total de solicitudes');
          },
        });
      }
    }
  }

  //Este método se encarga de exportar los datos a un archivo de Excel, dependiendo del tipo de reporte seleccionado..
  //se definen los encabezados y los datos que se van a exportar,
  // luego se crea una hoja de cálculo con esos datos y se exporta el archivo con un nombre que incluye el tipo de reporte y las fechas seleccionadas (si es que se seleccionaron).
  exportToExcel(data: any[], fileName: string): void {
    // Definir los encabezados según el tipo de reporte
    let headers: string[][] = [];
    let dataForExcel: any[][] = [];

    // para cada tipo de reporte, definir los encabezados correspondientes, en este caso son tres tipos de reportes: ocupaciones, fallecidos y bloques
    // empezamos con el de ocupaciones, que sería el excel tal cual ellos han estado usado.
    if (this.reportType === 'Espacios') {
      headers = [
        [
          'Código Bloque',
          'Sector',
          'Manzana',
          'Bloque',
          'Tipo',
          'Espacio',
          'Nombre del Fallecido',
          'Fecha de Fallecimiento',
        ],
      ];
      dataForExcel = data.map((item) => [
        item.codigo_bloque,
        item.sector_cementerio,
        item.manzana,
        item.bloque_lote,
        item.tipo_ubicacion,
        item.numero,
        item.nombre_fallecido || 'S/N', // Aseguramos que muestre "S/N" si no hay fallecido para que el excel quede igual que el de ellos originalmente
        item.fecha_fallecimiento || 'S/F', // Aseguramos que muestre "S/F" si no hay fecha de fallecimiento para que el excel quede igual que el de ellos originalmente
      ]);
    } else if (this.reportType === 'Fallecidos') {
      headers = [
        [
          'Fecha Registro',
          'Nombre Completo',
          'Fecha Fallecimiento',
          'Fecha Inhumación',
          'Fecha Exhumación',
          'Ubicación',
          'Espacio',
          'Observaciones',
        ],
      ];
      dataForExcel = data.map((item) => [
        item.fecha_creacion
          ? new Date(item.fecha_creacion).toLocaleDateString('es-EC')
          : '—',
        item.nombre_completo,
        item.fecha_fallecimiento
          ? new Date(item.fecha_fallecimiento).toLocaleDateString('es-EC')
          : 'S/F',
        item.fecha_inhumacion
          ? new Date(item.fecha_inhumacion).toLocaleDateString('es-EC')
          : 'S/F',
        item.fecha_exhumacion
          ? new Date(item.fecha_exhumacion).toLocaleDateString('es-EC')
          : 'S/F',
        item.codigo_bloque,
        item.espacio,
        item.observaciones ?? '—',
      ]);
    } else if (this.reportType === 'Solicitudes') {
      headers = [[
        'Tipo Trámite',
        'ID Solicitud',
        'Estado',
        'Nombre',
        'Cédula',
        'Correo',
        'Teléfono',
        'Fecha Solicitud',
        'Fecha Resolución',
        'Total Documentos',
        'Costo ($)',
        'Observaciones',
      ]];
      dataForExcel = data.map(item => [
        item.tipo_tramite,
        item.id_solicitud,
        item.estado,
        item.nombre_usuario,
        item.cedula_usuario,
        item.correo_usuario,
        item.telefono_usuario || '—',
        item.fecha_solicitud
          ? new Date(item.fecha_solicitud).toLocaleDateString('es-EC')
          : '—',
        item.fecha_actualizacion
          ? new Date(item.fecha_actualizacion).toLocaleDateString('es-EC')
          : '—',
        item.total_documentos,
        item.costo,
        item.observaciones || '—',
      ]);
    }

    // Crear una hoja de cálculo con los encabezados y los datos
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ...headers,
      ...dataForExcel,
    ]);

    // Crear un libro de Excel y añadir la hoja de cálculo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      this.reportType === 'Espacios'
        ? 'Espacios'
        : this.reportType === 'Fallecidos'
          ? 'Fallecidos'
          : 'Solicitudes',
    );
    // Exportar el archivo de Excel
    const dateRange = this.useDateRange
      ? `_${this.startDate}_${this.endDate}`
      : '';
    XLSX.writeFile(wb, `${fileName}${dateRange}.xlsx`);
  }
}
