import { Routes } from '@angular/router';
// Solo se importan estáticamente los guards y el Layout principal
import { authGuard } from './guards/auth.guard';
import { cementerioGuard } from './guards/cementerio.guard';
import { adminGuard } from './guards/admin.guard';
import { superadminGuard } from './guards/superadmin.guard';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { LayoutComponent } from './components/layout/layout.component';

//Lazy Loading
export const routes: Routes = [
  // Ruta raíz redirige a selección de cementerio
  { path: '', redirectTo: 'cementerios', pathMatch: 'full' },

  // Pantallas sin sidebar
  {
    path: 'cementerios',
    loadComponent: () =>
      import('./pages/cementerios/cementerios.component').then(
        (m) => m.CementeriosComponent,
      ),
    canActivate: [cementerioGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.component').then(
        (m) => m.RegistroComponent,
      ),
  },
  {
    path: 'informacion',
    loadComponent: () =>
      import('./pages/informacion/informacion.component').then(
        (m) => m.InformacionComponent,
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
  {
    path: 'bloque/:slug/:codigo',
    loadComponent: () =>
      import('./pages/bloque-publico/bloque-publico.component').then(
        (m) => m.BloquePublicoComponent,
      ),
  },

  // Pantallas con sidebar
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'mapa',
        loadComponent: () =>
          import('./pages/mapa-bovedas/mapa-bovedas.component').then(
            (m) => m.MapaBovedasComponent,
          ),
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/inicio/inicio.component').then(
            (m) => m.InicioComponent,
          ),
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'difuntos',
        loadComponent: () =>
          import('./pages/inicio-difuntos/inicio-difuntos.component').then(
            (m) => m.InicioDifuntosComponent,
          ),
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./pages/contacto/contacto.component').then(
            (m) => m.ContactoComponent,
          ),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./pages/perfil/perfil.component').then(
            (m) => m.PerfilComponent,
          ),
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./pages/reportes/reportes.component').then(
            (m) => m.ReportesComponent,
          ),
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        canActivate: [adminGuard],
      },
      {
        path: 'tramites',
        loadComponent: () =>
          import('./pages/tramites/tramites.component').then(
            (m) => m.TramitesComponent,
          ),
      },
      {
        path: 'tramites/:id_tipo',
        loadComponent: () =>
          import('./pages/solicitud-tramite/solicitud-tramite.component').then(
            (m) => m.SolicitudTramiteComponent,
          ),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'exhumaciones',
        loadComponent: () =>
          import('./pages/solicitud-exhumacion/solicitud-exhumacion.component').then(
            (m) => m.SolicitudExhumacionComponent,
          ),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'inhumaciones',
        loadComponent: () =>
          import('./pages/solicitud-inhumacion/solicitud-inhumacion.component').then(
            (m) => m.SolicitudInhumacionComponent,
          ),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'admin/solicitudes',
        loadComponent: () =>
          import('./pages/admin-solicitudes/admin-solicitudes.component').then(
            (m) => m.AdminSolicitudesComponent,
          ),
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'superadmin',
        loadComponent: () =>
          import('./pages/superadmin/superadmin.component').then(
            (m) => m.SuperadminComponent,
          ),
        canActivate: [authGuard, superadminGuard],
      },
    ],
  },

  // Ruta comodín — redirige a selección si no existe la ruta
  { path: '**', redirectTo: '404' },
];
