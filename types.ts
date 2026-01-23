
export type AsuntoType = 'Comentario' | 'Opinión' | 'Colaboración';

export interface Submission {
  id: number | string;
  fecha_hora: string;
  direccion_ip: string;
  nombre: string;
  email: string;
  asunto: AsuntoType;
  comentario: string;
  revisado: boolean;
}

export interface FormData {
  nombre: string;
  email: string;
  asunto: AsuntoType;
  comentario: string;
}
