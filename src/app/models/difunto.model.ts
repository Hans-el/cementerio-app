// para definir la estructura de un difunto que usamos en la administracion de /difuntos
export interface Difunto {
  id: number;
  nombreCompleto: string;
  cedula: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  fechaNacimiento: string;
  fechaFallecimiento: string;
  causaFallecimiento: string;
  observaciones: string;
}
