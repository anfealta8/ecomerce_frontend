export interface LoginRequest {
  username: string;
  password?: string; 
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface UsuarioRequest {
  username: string;
  password?: string; 
  email: string;
  roles?: string[]; 
}

export interface UsuarioResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
}