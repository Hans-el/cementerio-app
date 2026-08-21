import { Routes } from '@angular/router';
// Solo se importan estáticamente los guards y el Layout principal
import { authGuard } from './core/guards/auth.guard';
import { cementerioGuard } from './core/guards/cementerio.guard';
import { adminGuard } from './core/guards/admin.guard';
import { superadminGuard } from './core/guards/superadmin.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

//Lazy Loading
export const routes: Routes = [
  // Ruta raíz redirige a selección de cementerio
  { path: '', redirectTo: 'cementerios', pathMatch: 'full' },

  // Pantallas sin sidebar
  {
    path: 'cementerios',
    loadComponent: () =>
      import('./features/auth/pages/cementerios/cementerios.component').then(
        (m) => m.CementeriosComponent,
      ),
    canActivate: [cementerioGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/pages/registro/registro.component').then(
        (m) => m.RegistroComponent,
      ),
  },
  {
    path: 'informacion',
    loadComponent: () =>
      import('./features/publico/pages/informacion/informacion.component').then(
        (m) => m.InformacionComponent,
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/publico/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
  {
    path: 'bloque/:slug/:codigo',
    loadComponent: () =>
      import('./features/publico/pages/bloque-publico/bloque-publico.component').then(
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
          import('./features/mapa/pages/mapa-bovedas/mapa-bovedas.component').then(
            (m) => m.MapaBovedasComponent,
          ),
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/espacios/pages/inicio/inicio.component').then(
            (m) => m.InicioComponent,
          ),
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'difuntos',
        loadComponent: () =>
          import('./features/fallecidos/pages/inicio-difuntos/inicio-difuntos.component').then(
            (m) => m.InicioDifuntosComponent,
          ),
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./features/publico/pages/contacto/contacto.component').then(
            (m) => m.ContactoComponent,
          ),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/publico/pages/perfil/perfil.component').then(
            (m) => m.PerfilComponent,
          ),
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/admin/pages/reportes/reportes.component').then(
            (m) => m.ReportesComponent,
          ),
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        canActivate: [adminGuard],
      },
      {
        path: 'tramites',
        loadComponent: () =>
          import('./features/tramites/pages/tramites/tramites.component').then(
            (m) => m.TramitesComponent,
          ),
      },
      {
        path: 'tramites/:id_tipo',
        loadComponent: () =>
          import('./features/tramites/pages/solicitud-tramite/solicitud-tramite.component').then(
            (m) => m.SolicitudTramiteComponent,
          ),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'exhumaciones',
        loadComponent: () =>
          import('./features/tramites/pages/solicitud-exhumacion/solicitud-exhumacion.component').then(
            (m) => m.SolicitudExhumacionComponent,
          ),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'inhumaciones',
        loadComponent: () =>
          import('./features/tramites/pages/solicitud-inhumacion/solicitud-inhumacion.component').then(
            (m) => m.SolicitudInhumacionComponent,
          ),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'admin/solicitudes',
        loadComponent: () =>
          import('./features/admin/pages/admin-solicitudes/admin-solicitudes.component').then(
            (m) => m.AdminSolicitudesComponent,
          ),
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'superadmin',
        loadComponent: () =>
          import('./features/superadmin/pages/superadmin/superadmin.component').then(
            (m) => m.SuperadminComponent,
          ),
        canActivate: [authGuard, superadminGuard],
      },
    ],
  },

  // Ruta comodín — redirige a selección si no existe la ruta
  { path: '**', redirectTo: '404' },
];
