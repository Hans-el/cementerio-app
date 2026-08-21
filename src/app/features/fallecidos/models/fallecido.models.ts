// difunto.model.ts
export interface Fallecido {
    id_fallecido: number;
    nombre_completo: string;
    fecha_fallecimiento: string | null;
    fecha_fallecimiento_raw?: string;
    fecha_inhumacion: string | null;
    fecha_exhumacion: string | null;
    observaciones: string | null;
}
