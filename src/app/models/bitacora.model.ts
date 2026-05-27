export interface RegistroBitacora {
    id_bitacora: number;
    accion: 'CREAR' | 'EDITAR' | 'ELIMINAR' | 'CAMBIAR_ESTADO';
    entidad: string;
    id_entidad: number | null;
    descripcion: string;
    valor_anterior: any | null;
    valor_nuevo: any | null;
    fecha: string;
    nombre_usuario: string;
    cedula_usuario: string;
    rol_usuario: string;
}

export interface BitacoraResponse {
    data: RegistroBitacora[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}