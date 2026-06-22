import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

// Interfaz que deben implementar los componentes que quieran protección
export interface PuedeSalir {
  tieneCambiosSinGuardar(): boolean;
}
export const unsavedChangesGuard: CanDeactivateFn<PuedeSalir> = (component) => {
  if (!component.tieneCambiosSinGuardar()) return true;

  return new Promise<boolean>((resolve) => {
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({
        title: '¿Salir sin enviar?',
        html: 'Tienes documentos subidos que <strong>no han sido enviados</strong>.<br>Si sales ahora perderás los archivos seleccionados.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Quedarme',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#2d5a27',
        reverseButtons: true,
      }).then(result => resolve(result.isConfirmed));
    });
  });
};