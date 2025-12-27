// Authentication types

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  tenantId: string;
  roles: string[];
  expiresAt: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  userId?: string;
  username?: string;
  tenantId?: string;
  roles?: string[];
}
