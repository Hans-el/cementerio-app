// esto se usa en el componente html de inicio 
// Esta interfaz es para definir la estructura de una ocupación 
// Es decir, son los datos corretos de nuestra pantalla de inicio. 
//ESTO SE USA EN LA PAGINA INICIO
export interface Ocupacion {
    id_espacio: number;  // <-- agregar
    codigo_bloque: string;
    sector_cementerio: number;
    manzana: number;
    tipo_ubicacion: string;
    bloque_lote: number;
    numero: number;
    nombre_fallecido: string | null;
    fecha_fallecimiento: string | null;
}
