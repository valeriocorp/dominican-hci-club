/**
 * Códigos de error para autenticación de customers
 * Basado en la estructura de llovio-dashboard pero simplificado para customer auth
 */

export enum CustomerAuthErrorCodes {
  // Authentication errors (CAUTH_001-020)
  EMAIL_ALREADY_REGISTERED = 'CAUTH_001',
  INVALID_CREDENTIALS = 'CAUTH_002',
  ACCOUNT_LOCKED = 'CAUTH_003',
  SESSION_EXPIRED = 'CAUTH_004',
  UNAUTHORIZED = 'CAUTH_005',
  EMAIL_NOT_VERIFIED = 'CAUTH_006',
  
  // Business API Key errors (CAUTH_021-030)
  BUSINESS_NOT_FOUND = 'CAUTH_021',
  API_KEY_INVALID = 'CAUTH_022',
  API_KEY_INACTIVE = 'CAUTH_023',
  API_KEY_REQUIRED = 'CAUTH_024',
  
  // General errors (CAUTH_031-040)
  VALIDATION_FAILED = 'CAUTH_031',
  SERVICE_UNAVAILABLE = 'CAUTH_032',
  INTERNAL_ERROR = 'CAUTH_033',
}

/**
 * Interfaz para respuestas de error del backend
 */
export interface BackendErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
  errorCode?: string;
}

/**
 * Mapea códigos de error a mensajes amigables en español
 * @param errorCode - Código de error del backend
 * @returns Mensaje de error en español
 */
export function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    // Authentication errors
    [CustomerAuthErrorCodes.EMAIL_ALREADY_REGISTERED]: 'Este correo electrónico ya está registrado.',
    [CustomerAuthErrorCodes.INVALID_CREDENTIALS]: 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.',
    [CustomerAuthErrorCodes.ACCOUNT_LOCKED]: 'Tu cuenta ha sido bloqueada. Contacta al soporte para más información.',
    [CustomerAuthErrorCodes.SESSION_EXPIRED]: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    [CustomerAuthErrorCodes.UNAUTHORIZED]: 'No tienes autorización para realizar esta acción.',
    [CustomerAuthErrorCodes.EMAIL_NOT_VERIFIED]: 'Por favor, verifica tu correo electrónico antes de continuar.',
    
    // Business API Key errors
    [CustomerAuthErrorCodes.BUSINESS_NOT_FOUND]: 'El negocio no fue encontrado.',
    [CustomerAuthErrorCodes.API_KEY_INVALID]: 'La clave de API es inválida.',
    [CustomerAuthErrorCodes.API_KEY_INACTIVE]: 'La clave de API está inactiva.',
    [CustomerAuthErrorCodes.API_KEY_REQUIRED]: 'Se requiere una clave de API válida.',
    
    // General errors
    [CustomerAuthErrorCodes.VALIDATION_FAILED]: 'Los datos proporcionados no son válidos.',
    [CustomerAuthErrorCodes.SERVICE_UNAVAILABLE]: 'El servicio no está disponible. Por favor, intenta más tarde.',
    [CustomerAuthErrorCodes.INTERNAL_ERROR]: 'Ha ocurrido un error interno. Por favor, intenta nuevamente.',
    
    // Legacy backend error codes (AUTH_xxx format from llovio)
    'AUTH_001': 'Este correo electrónico ya está registrado.',
    'AUTH_003': 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.',
    'AUTH_004': 'Tu cuenta ha sido bloqueada. Contacta al soporte para más información.',
    'AUTH_007': 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    
    // Business API Key legacy codes
    'BIZKEY_001': 'La clave de API no fue encontrada.',
    'BIZKEY_002': 'La clave de API es inválida.',
    'BIZKEY_003': 'La clave de API está inactiva.',
    'BIZKEY_006': 'El negocio asociado a esta clave no existe.',
    'BIZKEY_009': 'Se requiere una clave de API válida.',
  };

  return errorMessages[errorCode] || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';
}
