export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string; // "Bearer"
  id: number;
  email: string;
  roles: string[];
}