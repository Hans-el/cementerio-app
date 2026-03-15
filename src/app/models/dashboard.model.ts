export interface DashboardResumen {
  total: number;
  bovedas: number;
  nichos: number;
  cruces: number;
  bovedas_ocup: number;
  nichos_ocup: number;
  cruces_ocup: number;
  fallecidos: number;
  sin_fecha: number;
  sectores: DashboardSector[];
  manzanas: DashboardManzana[];
}

export interface DashboardSector {
  nombre: string;
  total: number;
  ocupados: number;
}

export interface DashboardManzana {
  numero: number;
  total: number;
  ocupados: number;
}

export interface InhumacionAnio {
  anio: number;
  n: number;
}