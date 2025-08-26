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


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    {
        //Definimos el layout, que es el sidebar, y dentro van las rutas hijas, es decir, todas las rutas que van a tener el sidebar.
        path: '', component: LayoutComponent, children: [
            { path: 'mapa', component: MapaBovedasComponent }, 
            { path: 'inicio', component: InicioComponent , /*canActivate: [adminGuard]*/ }, //Solo los admins pueden ver el inicio, ya que es la gestion de bovedas 
            { path: 'contacto', component: ContactoComponent },
            { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] }, //no puede acceder si no está autenticado, es decir, no podrá editar sus datos ya que no está logueado

        ]
    }, 



];
