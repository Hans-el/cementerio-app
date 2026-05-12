export interface SolicitudInhumacion {
    id_solicitud: number;
    estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
    observaciones: string | null;
    fecha_solicitud: string;
    fecha_actualizacion: string | null;
    nombre_usuario: string;
    cedula_usuario: string;
    correo_usuario: string;
    total_documentos: number;
}

export interface DocumentoInhumacion {
    id_documento: number;
    id_solicitud: number;
    nombre_documento: string;
    ruta_archivo: string;
    fecha_subida: string;
}