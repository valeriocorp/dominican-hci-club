import type React from "react"
import { useState, useRef } from "react"
import { actions } from "astro:actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  validateEmail, 
  validatePassword, 
  isNetworkError, 
  isRetryableError,
  getActionErrorMessage,
  getActionErrorCode
} from "@/utils/validation"

const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 2000, 4000] // Exponential backoff

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [retryCount, setRetryCount] = useState(0)
  
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const clearFieldError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const validateField = (field: string, value: string): boolean => {
    let result
    switch (field) {
      case 'email':
        result = validateEmail(value)
        break
      case 'password':
        result = validatePassword(value)
        break
      default:
        return true
    }
    
    if (!result.isValid && result.error) {
      setErrors(prev => ({ ...prev, [field]: result.error! }))
      return false
    }
    return true
  }

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const emailResult = validateEmail(email)
    const passwordResult = validatePassword(password)
    
    const newErrors: Record<string, string> = {}
    
    if (!emailResult.isValid && emailResult.error) {
      newErrors.email = emailResult.error
    }
    if (!passwordResult.isValid && passwordResult.error) {
      newErrors.password = passwordResult.error
    }
    
    setErrors(newErrors)
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors }
  }

  const performLogin = async (): Promise<boolean> => {
    const normalizedEmail = email.trim()
    const result = await actions.auth.loginCustomer({ email: normalizedEmail, password })
    
    if (result.error) {
      throw result.error
    }
    
    toast.success("Inicio de sesión exitoso", {
      description: "Redirigiendo a tu perfil..."
    })
    
    // Small delay for toast to be visible
    setTimeout(() => {
      window.location.href = "/profile"
    }, 500)
    
    return true
  }

  const handleRetry = async (attempt: number, toastId?: string | number): Promise<boolean> => {
    if (attempt > MAX_RETRIES) {
      if (toastId) toast.dismiss(toastId)
      return false
    }
    
    // Update state for UI display
    setRetryCount(attempt)
    
    const delayIndex = attempt - 1
    const delay = RETRY_DELAYS[delayIndex] || RETRY_DELAYS[RETRY_DELAYS.length - 1]
    
    // Create or update the loading toast
    const currentToastId = toastId ?? toast.loading(`Reintentando... (${attempt}/${MAX_RETRIES})`)
    if (toastId) {
      toast.loading(`Reintentando... (${attempt}/${MAX_RETRIES})`, { id: toastId })
    }
    
    await new Promise(resolve => setTimeout(resolve, delay))
    
    try {
      const result = await performLogin()
      // Dismiss loading toast on success
      toast.dismiss(currentToastId)
      return result
    } catch (error) {
      const errorCode = getActionErrorCode(error)
      if ((isRetryableError(errorCode) || isNetworkError(error)) && attempt < MAX_RETRIES) {
        return handleRetry(attempt + 1, currentToastId)
      }
      // Dismiss loading toast before throwing error
      toast.dismiss(currentToastId)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    const validation = validateForm()
    if (!validation.isValid) {
      const firstErrorField = Object.keys(validation.errors)[0]
      if (firstErrorField === 'email') {
        emailInputRef.current?.focus()
      } else if (firstErrorField === 'password') {
        passwordInputRef.current?.focus()
      }
      return
    }
    
    setIsLoading(true)
    setRetryCount(0)

    try {
      await performLogin()
    } catch (error) {
      const errorCode = getActionErrorCode(error)
      const errorMessage = getActionErrorMessage(error)
      
      // Check if retryable
      if (isRetryableError(errorCode) || isNetworkError(error)) {
        try {
          const success = await handleRetry(1)
          if (success) return
        } catch (retryError) {
          toast.error("Error de conexión", {
            description: "No pudimos conectar con el servidor. Por favor, verifica tu conexión e intenta nuevamente."
          })
          setIsLoading(false)
          return
        }
      }
      
      // Handle specific error codes
      // Covers both HTTP-style codes and CAUTH_* enums for consistency
      switch (errorCode) {
        case 'UNAUTHORIZED':
        case 'CAUTH_002': // INVALID_CREDENTIALS
        case 'CAUTH_005': // UNAUTHORIZED (enum)
        case 'AUTH_003':  // Legacy: INVALID_CREDENTIALS
          toast.error("Credenciales inválidas", {
            description: "Por favor, verifica tu correo y contraseña."
          })
          emailInputRef.current?.focus()
          break
          
        case 'CAUTH_004': // SESSION_EXPIRED
        case 'AUTH_007':  // Legacy: SESSION_EXPIRED
          toast.error("Sesión expirada", {
            description: "Por favor, inicia sesión nuevamente."
          })
          break
          
        case 'CAUTH_003': // ACCOUNT_LOCKED
        case 'AUTH_004':  // Legacy: ACCOUNT_LOCKED
          toast.error("Cuenta bloqueada", {
            description: "Tu cuenta ha sido bloqueada. Contacta a soporte: info@dominicanhciclub.com"
          })
          break
          
        case 'BAD_REQUEST':
        case 'CAUTH_031': // VALIDATION_FAILED
          toast.error("Datos inválidos", {
            description: errorMessage
          })
          break
          
        default:
          toast.error("Error al iniciar sesión", {
            description: errorMessage
          })
      }
      
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (!isLoading) return "Iniciar sesión"
    if (retryCount > 0) return `Reintentando (${retryCount}/${MAX_RETRIES})...`
    return "Iniciando sesión..."
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/">
            <h1 className="text-2xl font-bold mb-2 text-[rgba(25,42,110,1)]">Dominican HCI Club </h1>
          </a>
          <p className="text-muted-foreground">Bienvenido/a de vuelta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[rgba(25,42,110,1)]">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="email">Correo Electrónico</Label>
                <Input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearFieldError('email')
                  }}
                  onBlur={() => validateField('email', email)}
                  disabled={isLoading}
                  aria-invalid={!!errors.email}
                  className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500" role="alert">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="password">Contraseña</Label>
                <Input
                  ref={passwordInputRef}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    clearFieldError('password')
                  }}
                  onBlur={() => validateField('password', password)}
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                  className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500" role="alert">{errors.password}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-[rgba(25,42,110,1)]" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {getButtonText()}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-center">
              ¿No tienes una cuenta?{" "}
              <a href="/register" className="hover:underline text-[rgba(25,42,110,1)] font-medium">
                Regístrate aquí
              </a>
            </p>
          </CardFooter>
        </Card>
        
        {/* Screen reader announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {Object.values(errors).join('. ')}
        </div>
      </div>
    </div>
  )
}
