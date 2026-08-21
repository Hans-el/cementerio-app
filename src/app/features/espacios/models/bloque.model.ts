export interface Bloque {
    id_bloque: number;
    id_manzana: number;
    numero_bloque: number;
    cantidad_espacios: number;
    observaciones?: string;
    fecha_creacion: Date;
}
