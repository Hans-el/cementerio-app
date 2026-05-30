import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { authGuard } from './guards/auth.guard';
import { MapaBovedasComponent } from './pages/mapa-bovedas/mapa-bovedas.component';
import { LayoutComponent } from './components/layout/layout.component';
import { adminGuard } from './guards/admin.guard';
import { InicioDifuntosComponent } from './pages/inicio-difuntos/inicio-difuntos.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminSolicitudesComponent } from './pages/admin-solicitudes/admin-solicitudes.component';
import { SolicitudInhumacionComponent } from './pages/solicitud-inhumacion/solicitud-inhumacion.component';
import { SolicitudExhumacionComponent } from './pages/solicitud-exhumacion/solicitud-exhumacion.component';
import { TramitesComponent } from './pages/tramites/tramites.component';
import { CementeriosComponent } from './pages/cementerios/cementerios.component';

//rutas de la aplicación
export const routes: Routes = [
    // Ruta raíz redirige a selección de cementerio
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Pantallas sin sidebar
    { path: 'cementerios', component: CementeriosComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },

    // Pantallas con sidebar
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'mapa', component: MapaBovedasComponent },
            { path: 'inicio', component: InicioComponent, canActivate: [authGuard, adminGuard] },
            { path: 'difuntos', component: InicioDifuntosComponent, canActivate: [authGuard, adminGuard] },
            { path: 'contacto', component: ContactoComponent },
            { path: 'perfil', component: PerfilComponent },
            { path: 'reportes', component: ReportesComponent, canActivate: [authGuard, adminGuard] },
            { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
            { path: 'tramites', component: TramitesComponent, canActivate: [authGuard] },
            { path: 'exhumaciones', component: SolicitudExhumacionComponent, canActivate: [authGuard] },
            { path: 'inhumaciones', component: SolicitudInhumacionComponent, canActivate: [authGuard] },
            { path: 'admin/solicitudes', component: AdminSolicitudesComponent, canActivate: [authGuard, adminGuard] },
        ]
    },

    // Ruta comodín — redirige a selección si no existe la ruta
    { path: '**', redirectTo: 'login' },
];