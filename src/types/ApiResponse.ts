/**
 * Tipos para respuestas de la API del backend larimar
 * Basado en la estructura de respuesta de /auth/customer/* endpoints
 */

/**
 * Usuario retornado por el backend (modelo users sin password)
 */
export interface User {
  id: string;
  email: string;
  name: string;
  lastname?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  user_type: string;
  is_active?: boolean | null;
  email_verified?: boolean | null;
  phone_verified?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  last_login?: string | null;
  mfa_enabled: boolean;
  mfa_preferred_method?: string | null;
  preferences?: Record<string, unknown> | null;
  account_locked?: boolean | null;
  role_id?: string | null;
}

/**
 * Negocio asociado al customer
 */
export interface Business {
  id: string;
  name: string;
  is_active?: boolean;
}

/**
 * Respuesta de registro de customer
 * POST /auth/customer/register
 */
export interface RegisterCustomerResponse {
  user: User;
  token: string;
  businesses: Business[];
}

/**
 * Respuesta de login de customer
 * POST /auth/customer/login
 */
export interface LoginCustomerResponse {
  user: User;
  token: string;
  businesses: Business[];
}

/**
 * Respuesta genérica de éxito
 */
export interface SuccessResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Respuesta de error del backend
 */
export interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
  errorCode?: string;
}

/**
 * Respuesta de verificación de sesión
 * GET /auth/llovio/session/status
 */
export interface SessionStatusResponse {
  valid: boolean;
  user?: User;
}
