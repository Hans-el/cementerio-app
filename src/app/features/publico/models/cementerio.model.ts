export interface Cementerio {
    id_cementerio: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
    direccion: string | null;
    telefono: string | null;
    correo: string | null;
    logo_url: string | null;
    mapa_url: string | null;
    color_primario: string;
}