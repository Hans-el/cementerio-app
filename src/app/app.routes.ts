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

//rutas de la aplicación
export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    {
        //Definimos el layout, que es el sidebar, y dentro van las rutas hijas, es decir, todas las rutas que van a tener el sidebar.
        path: '', component: LayoutComponent, children: [
            { path: 'mapa', component: MapaBovedasComponent },
            { path: 'inicio', component: InicioComponent, canActivate: [authGuard, adminGuard] }, //Gestión de bovedas. Uso guardia de admin para que solo el admin pueda acceder.
            { path: 'difuntos', component: InicioDifuntosComponent, canActivate: [authGuard, adminGuard] }, //Gestión de difuntos. Se usa también la guardia de admin.
            { path: 'contacto', component: ContactoComponent }, // para contactarse con la administracion del cementerio
            { path: 'perfil', component: PerfilComponent }, //no puede acceder si no está autenticado, es decir, no podrá editar sus datos ya que no está logueado (si es que quiero usar el authGuard)
            { path: 'reportes', component: ReportesComponent, canActivate: [authGuard, adminGuard] }, //para generar reportes de difuntos y ocupaciones. Uso para auditoría. Solo el admin puede acceder.
            { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] }, //para mostrar un dashboard con estadísticas y gráficos. Solo el admin puede acceder.,
            { path: 'tramites', component: TramitesComponent, canActivate: [authGuard] }, //para mostrar los trámites disponibles (inhumación y exhumación). Solo usuarios autenticados pueden acceder.
            { path: 'exhumaciones', component: SolicitudExhumacionComponent, canActivate: [authGuard] },
            { path: 'inhumaciones', component: SolicitudInhumacionComponent, canActivate: [authGuard] },
            { path: 'admin/solicitudes', component: AdminSolicitudesComponent, canActivate: [authGuard, adminGuard] }

        ]
    },
];
