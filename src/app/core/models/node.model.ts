export type NodeType =
  | 'START_EVENT'
  | 'END_EVENT'
  | 'TASK'
  | 'GATEWAY'
  | 'MESSAGE_THROW'
  | 'MESSAGE_CATCH'
  | 'SUBPROCESS';

export type GatewayType = 'EXCLUSIVE' | 'PARALLEL' | 'INCLUSIVE' | 'EVENT_BASED';

export interface NodeRequest {
  versionId: number;
  laneId?: number;
  type: NodeType;
  gatewayType?: GatewayType;
  name: string;
  description?: string;
  x: number;
  y: number;
}

export interface NodeResponse extends NodeRequest {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}
