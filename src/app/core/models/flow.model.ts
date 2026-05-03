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
  /**
   * Compatibility fields in case the backend still emits legacy node names.
   * Prefer sourceNodeId and targetNodeId in new frontend code.
   */
  originNodeId?: number;
  destinationNodeId?: number;
}
