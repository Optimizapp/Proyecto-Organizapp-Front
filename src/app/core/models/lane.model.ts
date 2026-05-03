export interface CreateLaneRequest {
  name: string;
  poolId: number;
  description?: string;
}

export interface UpdateLaneRequest extends Partial<CreateLaneRequest> {}

export interface LaneResponse {
  id: number;
  name: string;
  poolId: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
