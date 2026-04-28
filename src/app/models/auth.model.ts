export interface AuthResponse {
  token: string;         // El JWT que usaremos para autenticarnos
  userId: number;
  email: string;
  role: string;          // Para saber qué puede hacer el usuario (ADMIN, EDITOR, etc.)
  companyId: number;     // Para aislar el pool/espacio de la empresa
}

// También definimos el modelo de credenciales para el formulario de Login
export interface LoginRequest {
  email: string;
  password: string;
}