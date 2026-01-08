// esto se usa en el componente html de inicio 
// Esta interfaz es para definir la estructura de una ocupación
export interface Ocupacion {
    codigo: string;
    sector: number;
    manzana: number;
    bloque: number;
    espacio: number;
    tipo: string;
    fallecido: string;
    fecha_fallecimiento: string | null;
}
