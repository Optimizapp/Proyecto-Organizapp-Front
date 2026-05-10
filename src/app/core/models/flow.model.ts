export type FlowType = 'SEQUENCE' | 'MESSAGE';

export interface FlowRequest {
  versionId: number;
  sourceNodeId: number;
  targetNodeId: number;
  type: FlowType;
  name?: string;
  conditionExpression?: string;
}

export interface FlowResponse extends FlowRequest {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  originNodeId?: number;
  destinationNodeId?: number;
}
