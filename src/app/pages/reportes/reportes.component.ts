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
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  startDate: string = '';
  endDate: string = '';
  reportType: string = 'ocupaciones';
  reportData: any[] = [];
  useDateRange: boolean = true; // Variable para controlar si se usa rango de fechas, si no, se generan todos los datos


  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void { }

  generateReport(): void {
    if (this.useDateRange && (!this.startDate || !this.endDate)) {
      Swal.fire({
        icon: 'warning',
        title: 'Rango de fechas incompleto',
        text: 'Por favor, selecciona un rango de fechas.'
      });
      return;
    }

    if (this.reportType === 'ocupaciones') {
      if (this.useDateRange) {
        this.reportesService.getReporteOcupaciones(this.startDate, this.endDate).subscribe({
          next: (data) => {
            this.reportData = data;
            this.exportToExcel(data, 'Reporte_Ocupaciones');
          },
          error: () => {
            console.error('Error al obtener el reporte de ocupaciones');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener el reporte de ocupaciones.'
            });
          }
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
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener el reporte total de ocupaciones.'
            });
          }
        });
      }
    } else if (this.reportType === 'fallecidos') {
      if (this.useDateRange) {
        this.reportesService.getReporteFallecidos(this.startDate, this.endDate).subscribe({
          next: (data) => {
            this.reportData = data;
            this.exportToExcel(data, 'Reporte_Fallecidos');
          },
          error: () => {
            console.error('Error al obtener el reporte de fallecidos');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener el reporte de fallecidos.'
            });
          }
        });
      } else {
        this.reportesService.getReporteFallecidos().subscribe({
          next: (data) => {
            this.reportData = data;
            this.exportToExcel(data, 'Reporte_Total_Fallecidos');
          },
          error: () => {
            console.error('Error al obtener el reporte total de fallecidos');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener el reporte total de fallecidos.'
            });
          }
        });
      }
    } else if (this.reportType === 'bloques') {
      if (this.useDateRange) {
        this.reportesService.getReporteBloques(this.startDate, this.endDate).subscribe({
          next: (data) => {
            this.reportData = data;
            this.exportToExcel(data, 'Reporte_Bloques');
          },
          error: () => {
            console.error('Error al obtener el reporte de bloques');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener el reporte de bloques.'
            });
          }
        });
      } else {
        this.reportesService.getReporteBloques().subscribe({
          next: (data) => {
            this.reportData = data;
            this.exportToExcel(data, 'Reporte_Total_Bloques');
          },
          error: () => {
            console.error('Error al obtener el reporte total de bloques');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener el reporte total de bloques.'
            });
          }
        });
      }
    }
  }

  exportToExcel(data: any[], fileName: string): void {
    // Definimos los encabezados del Excel para que quede igual al que ellos usan.
    const headers = [
      ['Código_bloque', 'Sector', 'Manzana', 'Bloque', 'Tipo', 'N°', 'Nombre del Fallecido', 'Fecha de Fallecimiento']
    ];

    // Convertir los datos a un formato que XLSX pueda entender
    const dataForExcel = data.map(item => [
      item.codigo_bloque,
      item.sector_cementerio,
      item.manzana,
      item.bloque_lote,
      item.tipo_ubicacion,
      item.numero,
      item.nombre_fallecido,
      item.fecha_fallecimiento
    ]);

    // Crear una hoja de cálculo con los encabezados y los datos
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([...headers, ...dataForExcel]);

    // Crear un libro de Excel y añadir la hoja de cálculo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ocupaciones');

    // Exportar el archivo de Excel
    XLSX.writeFile(wb, `${fileName}_${this.startDate}_${this.endDate}.xlsx`);
  }
}