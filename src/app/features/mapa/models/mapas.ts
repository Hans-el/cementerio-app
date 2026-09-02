export interface ManzanaMapaJson {
  sector: number;
  manzana: number;
  coords: string; // "x1,y1,x2,y2,..." tal cual image-map.net
}

export interface CaminoMapaJson {
  coords: string;
}

export interface MapaConfigJson {
  urlMapa: string;
  urlMapaNatural: string;
  anchoImg: number;
  altoImg: number;
  camino: CaminoMapaJson;
  manzanas: ManzanaMapaJson[];
}

export interface ManzanaMapa {
  sector: number;
  manzana: number;
  codigo: string;
  points: string; // ya convertido a "x1,y1 x2,y2 ..." para <polygon points>
}
