export interface TipoTramite {
    id_tipo_tramite: number;
    nombre: string;
    descripcion: string | null;
    costo: number;
    es_gratuito: boolean;
    orden: number;
}

export interface DocumentoTipo {
    id_documento_tipo: number;
    nombre: string;
    descripcion: string | null;
    orden: number;
    obligatorio: boolean;
}

export interface Solicitud {
    id_solicitud: number;
    estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
    observaciones: string | null;
    documento_respuesta: string | null;
    fecha_solicitud: string;
    fecha_actualizacion: string | null;
    id_tipo_tramite: number;
    tipo_tramite: string;
    costo: number;
    es_gratuito: boolean;
    nombre_usuario: string;
    cedula_usuario: string;
    correo_usuario: string;
    telefono_usuario: string | null;
    total_documentos: number;
}

export interface DocumentoSolicitud {
    id_documento: number;
    id_solicitud: number;
    nombre_documento: string;
    ruta_archivo: string;
    url_firmada: string | null;
    fecha_subida: string;
}