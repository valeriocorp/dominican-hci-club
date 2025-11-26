/**
 * Utilidades de validación del lado del cliente
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, error: 'El correo electrónico es requerido.' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Ingresa un correo electrónico válido.' }
  }
  
  return { isValid: true }
}

/**
 * Valida contraseña y retorna feedback de fortaleza
 */
export function validatePassword(password: string): ValidationResult & { strength?: 'weak' | 'medium' | 'strong' } {
  if (!password) {
    return { isValid: false, error: 'La contraseña es requerida.' }
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'La contraseña debe tener al menos 8 caracteres.', strength: 'weak' }
  }
  
  // Calcular fortaleza
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (score >= 4) strength = 'medium'
  if (score >= 5) strength = 'strong'
  
  return { isValid: true, strength }
}

/**
 * Valida nombre (mínimo 2 caracteres, sin números)
 */
export function validateName(name: string): ValidationResult {
  if (!name.trim()) {
    return { isValid: false, error: 'El nombre es requerido.' }
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres.' }
  }
  
  if (/\d/.test(name)) {
    return { isValid: false, error: 'El nombre no debe contener números.' }
  }
  
  return { isValid: true }
}

/**
 * Valida teléfono (solo dígitos, campo opcional)
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone.trim()) {
    return { isValid: true } // Campo opcional
  }
  
  const digitsOnly = phone.replace(/\D/g, '')
  if (digitsOnly.length < 7) {
    return { isValid: false, error: 'El número de teléfono debe tener al menos 7 dígitos.' }
  }
  
  if (digitsOnly.length > 15) {
    return { isValid: false, error: 'El número de teléfono es demasiado largo.' }
  }
  
  return { isValid: true }
}

/**
 * Detecta si el error es de red/conexión
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true
  }
  
  if (error && typeof error === 'object' && 'name' in error) {
    const name = (error as { name: string }).name
    if (name === 'NetworkError' || name === 'AbortError') {
      return true
    }
  }
  
  return false
}

/**
 * Identifica errores temporales que deberían activar reintentos
 */
export function isRetryableError(errorCode?: string): boolean {
  const retryableCodes = [
    'SERVICE_UNAVAILABLE',
    'GATEWAY_TIMEOUT',
    'CAUTH_032', // SERVICE_UNAVAILABLE
  ]
  
  return errorCode ? retryableCodes.includes(errorCode) : false
}

/**
 * Obtiene el mensaje de error de un ActionError
 */
export function getActionErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
  }
  return 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
}

/**
 * Obtiene el código de error de un ActionError
 */
export function getActionErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    return error.code as string
  }
  return undefined
}
