import { Component, OnInit } from '@angular/core';
import { CementerioService } from './services/cementerio.service';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  template: `
      <router-outlet></router-outlet>
`,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'cementerio-app';
  isSidebarCollapsed: boolean = false;

  constructor(private cementerioService: CementerioService) { }

  ngOnInit(): void {
    // Restaurar el tema del cementerio al recargar la página
    const cementerio = this.cementerioService.getCementerioActivoSnapshot();
    if (cementerio) {
      this.cementerioService.aplicarTema(cementerio);
    }
  }
  onToggleSidebar(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

}
