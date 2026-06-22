import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { authGuard } from './guards/auth.guard';
import { cementerioGuard } from './guards/cementerio.guard';
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
import { InformacionComponent } from './pages/informacion/informacion.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SuperadminComponent } from './pages/superadmin/superadmin.component';
import { superadminGuard } from './guards/superadmin.guard';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

//rutas de la aplicación
export const routes: Routes = [
    // Ruta raíz redirige a selección de cementerio
    { path: '', redirectTo: 'cementerios', pathMatch: 'full' },

    // Pantallas sin sidebar
    { path: 'cementerios', component: CementeriosComponent, canActivate: [cementerioGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'informacion', component: InformacionComponent },
    { path: '404', component: NotFoundComponent },



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
            { path: 'tramites', component: TramitesComponent },
            { path: 'exhumaciones', component: SolicitudExhumacionComponent, canDeactivate: [unsavedChangesGuard] },
            { path: 'inhumaciones', component: SolicitudInhumacionComponent, canDeactivate: [unsavedChangesGuard] },
            { path: 'admin/solicitudes', component: AdminSolicitudesComponent, canActivate: [authGuard, adminGuard] },
            { path: 'superadmin', component: SuperadminComponent, canActivate: [authGuard, superadminGuard] },

        ]
    },

    // Ruta comodín — redirige a selección si no existe la ruta
    { path: '**', redirectTo: '404' },
];