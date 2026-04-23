export interface NodeAttribute {
  id: number;
  nodeId: number;
  clave: string;
  valor: string;
  tipo: string;
}
export interface NodeAttributeRequest {
  nodeId: number;
  clave: string;
  valor?: string;
  tipo: string;
}