// Este modelo considera todos los posibles campos que podemos añadir con respecto al nicho. 
// Es posible que existan posibles campos adicionales, pero con éstos cubirmos lo necesario para el sistema actual.
// Pueden que existan nichos que no tengan todos los campos, por lo que son opcionales.


//posiblemente podemos añadirle numeracion
 
export interface Nicho {
  id: string;
  cedulaPropietario: string;
  nombrePropietario: string;
  sector: string;
  numero: string;
  estado: 'disponible' | 'ocupado' | 'reservado';
  fallecidoId?: string;
}
