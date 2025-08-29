//Aquí definimos el modelo de datos para un usuario
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string; // este dato se completan unicamente actualizando el perfil, una vaz ya logueado.
  direccion: string; // este dato se completan unicamente actualizando el perfil, una vaz ya logueado.
  contactoEmergencia: string;   // este dato se completan unicamente actualizando el perfil, una vaz ya logueado.
  telefonoEmergencia: string;   // este dato se completan unicamente actualizando el perfil, una vaz ya logueado.
}


// este archivo no se usa actualmente, pero se deja para futuras ampliaciones en este proyecto.
