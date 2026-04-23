export interface Flow {
  id: number;
  versionId: number;
  originNodeId: number;
  destinationNodeId: number;
  condicion: string;
  etiqueta: string;
}

export interface FlowRequest {
  versionId: number;
  originNodeId: number;
  destinationNodeId: number;
  condicion?: string;
  etiqueta?: string;
}