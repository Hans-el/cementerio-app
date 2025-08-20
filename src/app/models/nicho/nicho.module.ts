// nicho.model.ts
export interface Nicho {
  id: string;
  cedulaPropietario: string;
  nombrePropietario: string;
  sector: string;
  numero: string;
  estado: 'disponible' | 'ocupado' | 'reservado';
  fallecidoId?: string;
}
