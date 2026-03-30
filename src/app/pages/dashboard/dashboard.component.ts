import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardResumen, InhumacionAnio } from '../../models/dashboard.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  fechaActual = new Date();
  loading = true;

  resumen: DashboardResumen | null = null;
  inhumaciones: InhumacionAnio[] = [];

  totalOcupados = 0;
  totalDisponibles = 0;
  pctOcupacion = 0;

  private charts: Chart[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;

    forkJoin({
      resumen: this.dashboardService.getDashboardResumen(),
      inhumaciones: this.dashboardService.getInhumacionesPorAnio(),
    }).subscribe({
      next: ({ resumen, inhumaciones }) => {
        this.resumen = resumen;
        this.inhumaciones = inhumaciones;
        this.calcularKPIs();
        this.loading = false;
        setTimeout(() => this.renderizarGraficos(), 0);
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.loading = false;
      },
    });
  }

  private calcularKPIs(): void {
    if (!this.resumen) return;
    this.totalOcupados =
      this.resumen.bovedas_ocup +
      this.resumen.nichos_ocup +
      this.resumen.cruces_ocup;
    this.totalDisponibles = this.resumen.total - this.totalOcupados;
    this.pctOcupacion = this.resumen.total
      ? Math.round((this.totalOcupados / this.resumen.total) * 100)
      : 0;
  }

  pct(n: number, total: number): number {
    return total ? Math.round((n / total) * 100) : 0;
  }

  private destruirGraficos(): void {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }

  private renderizarGraficos(): void {
    this.destruirGraficos();
    if (!this.resumen) return;
    const r = this.resumen;

    const ctxTipos = document.getElementById(
      'chart-tipos',
    ) as HTMLCanvasElement;
    if (ctxTipos) {
      this.charts.push(
        new Chart(ctxTipos, {
          type: 'bar',
          data: {
            labels: ['Bóvedas', 'Nichos', 'Cruces'],
            datasets: [
              {
                label: 'Ocupados',
                data: [r.bovedas_ocup, r.nichos_ocup, r.cruces_ocup],
                backgroundColor: ['#E07B39', '#3B8BD4', '#C84B6B'],
                borderRadius: 4,
                borderSkipped: false,
              },
              {
                label: 'Disponibles',
                data: [
                  r.bovedas - r.bovedas_ocup,
                  r.nichos - r.nichos_ocup,
                  r.cruces - r.cruces_ocup,
                ],
                backgroundColor: '#d3d1c7',
                borderRadius: 4,
                borderSkipped: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
              x: {
                stacked: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { size: 11 } },
              },
              y: {
                stacked: true,
                grid: { display: false },
                ticks: { font: { size: 12 } },
              },
            },
          },
        }),
      );
    }

    const ctxDonut = document.getElementById(
      'chart-donut',
    ) as HTMLCanvasElement;
    if (ctxDonut) {
      this.charts.push(
        new Chart(ctxDonut, {
          type: 'doughnut',
          data: {
            labels: ['Ocupados', 'Disponibles'],
            datasets: [
              {
                data: [this.totalOcupados, this.totalDisponibles],
                backgroundColor: ['#E24B4A', '#639922'],
                borderWidth: 0,
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: { legend: { display: false } },
          },
        }),
      );
    }

    const ctxSectores = document.getElementById(
      'chart-sectores',
    ) as HTMLCanvasElement;
    if (ctxSectores) {
      this.charts.push(
        new Chart(ctxSectores, {
          type: 'bar',
          data: {
            labels: r.sectores.map((s) => s.nombre.replace('Cementerio ', '')),
            datasets: [
              {
                label: 'Ocupados',
                data: r.sectores.map((s) => s.ocupados),
                backgroundColor: ['#185FA5', '#3B6D11'],
                borderRadius: 4,
              },
              {
                label: 'Disponibles',
                data: r.sectores.map((s) => s.total - s.ocupados),
                backgroundColor: '#d3d1c7',
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                stacked: true,
                grid: { display: false },
                ticks: { font: { size: 11 } },
              },
              y: {
                stacked: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { size: 10 } },
              },
            },
          },
        }),
      );
    }

    const ctxAnios = document.getElementById(
      'chart-anios',
    ) as HTMLCanvasElement;
    if (ctxAnios) {
      this.charts.push(
        new Chart(ctxAnios, {
          type: 'line',
          data: {
            labels: this.inhumaciones.map((i) => i.anio),
            datasets: [
              {
                label: 'Inhumaciones',
                data: this.inhumaciones.map((i) => i.n),
                borderColor: '#185FA5',
                backgroundColor: 'rgba(24,95,165,0.08)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#185FA5',
                tension: 0.35,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 10 } } },
              y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { size: 10 } },
              },
            },
          },
        }),
      );
    }
  }
}
