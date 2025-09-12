// Definimos los datos para las bovedas.

export interface Boveda {
  codigo: string;
  ubicacion: string;
  sector: string;
  capacidad: number;
  estado: 'Disponible' | 'Ocupada' | 'Mantenimiento' | 'Inactiva';
  actualizado: string;
}