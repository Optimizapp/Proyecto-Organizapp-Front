export interface processVersion {
  id: number;
  processId: number;
  versionNumber: string;
  description: string;
  createdByUserId: number;
  createdAt: string;
}
export interface processVersionRequest {
  processId: number;
  versionNumber: string;
  description: string;
  createdByUserId: number;
}