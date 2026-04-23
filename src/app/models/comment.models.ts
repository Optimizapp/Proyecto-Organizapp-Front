export interface Comment {
  id: number;
  versionId: number;
  userId: number;
  contenido: string;
  createdAt: string;
}

export interface CommentRequest {
  versionId: number;
  userId: number;
  contenido: string;
}