import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
//para los modales 
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: NgbModalConfig, useValue: { animation: true, backdrop: 'static' } },
  // Inyectar un interceptor de http que añada el token de autenticación a las solicitudes salientes
  ]
};