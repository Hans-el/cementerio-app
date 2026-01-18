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

  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void { }

  generateReport(): void {
    if (!this.startDate || !this.endDate) {
      Swal.fire('Aviso', 'Por favor, selecciona un rango de fechas.', 'warning');
      return;
    }

    if (this.reportType === 'ocupaciones') {
      this.reportesService.getReporteOcupaciones(this.startDate, this.endDate).subscribe({
        next: (data) => {
          this.reportData = data;
          this.exportToExcel(data, 'Reporte_Ocupaciones');
        },
        error: () => {
          console.error('Error al obtener el reporte de ocupaciones');
        }
      });
    } else if (this.reportType === 'fallecidos') {
      this.reportesService.getReporteFallecidos(this.startDate, this.endDate).subscribe({
        next: (data) => {
          this.reportData = data;
          this.exportToExcel(data, 'Reporte_Fallecidos');
        },
        error: () => {
          console.error('Error al obtener el reporte de fallecidos');
        }
      });
    } else if (this.reportType === 'bloques') {
      this.reportesService.getReporteBloques(this.startDate, this.endDate).subscribe({
        next: (data) => {
          this.reportData = data;
          this.exportToExcel(data, 'Reporte_Bloques');
        },
        error: () => {
          console.error('Error al obtener el reporte de bloques');
        }
      });
    }
  }

  exportToExcel(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}_${this.startDate}_${this.endDate}.xlsx`);
  }
}