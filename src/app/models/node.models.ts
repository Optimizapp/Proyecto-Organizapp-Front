export interface Node {
    id: number;
    versionId: number;
    tipo: string;
    nombre: string;
    descripcion: string;
    x: number;
    y: number;
}
export interface NodeRequest {
    versionId: number;
    tipo: string;
    nombre: string;
    descripcion?: string;
    x: number;
    y: number;
}