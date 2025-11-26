import type React from "react"
import { useState, useEffect, useRef } from "react"
import { actions } from "astro:actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  isNetworkError,
  isRetryableError,
  getActionErrorMessage,
  getActionErrorCode
} from "@/utils/validation"

const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 2000, 4000] // Exponential backoff

type PasswordStrength = 'weak' | 'medium' | 'strong' | null

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [whatsapp, setWhatsapp] = useState("")
  const [plan, setPlan] = useState("free")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [retryCount, setRetryCount] = useState(0)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(null)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const whatsappInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const planParam = params.get("plan")
    if (planParam?.toLowerCase() === "premium") {
      setPlan("premium")
    }
  }, [])

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
      case 'name':
        result = validateName(value)
        break
      case 'email':
        result = validateEmail(value)
        break
      case 'password':
        result = validatePassword(value)
        if (result.strength) {
          setPasswordStrength(result.strength)
        }
        break
      case 'whatsapp':
        result = validatePhone(value)
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
    const nameResult = validateName(name)
    const emailResult = validateEmail(email)
    const passwordResult = validatePassword(password)
    const phoneResult = validatePhone(whatsapp)

    const newErrors: Record<string, string> = {}

    if (!nameResult.isValid && nameResult.error) {
      newErrors.name = nameResult.error
    }
    if (!emailResult.isValid && emailResult.error) {
      newErrors.email = emailResult.error
    }
    if (!passwordResult.isValid && passwordResult.error) {
      newErrors.password = passwordResult.error
    }
    if (!phoneResult.isValid && phoneResult.error) {
      newErrors.whatsapp = phoneResult.error
    }

    setErrors(newErrors)
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors }
  }

  const performRegistration = async (): Promise<boolean> => {
    // Formatear teléfono completo (código país + número)
    const fullPhone = whatsapp.trim() ? `${countryCode}${whatsapp}` : undefined

    // Determinar plan_id basado en la selección del usuario
    // TODO: Reemplazar con ID real del plan premium desde configuración
    const PREMIUM_PLAN_ID = 'premium-plan-id'
    const planId: string | undefined = plan === 'premium' ? PREMIUM_PLAN_ID : undefined

    const payload = {
      email: email.trim(),
      password,
      name: name.trim(),
      phone: fullPhone,
      plan_id: planId
    }

    const result = await actions.auth.registerCustomer(payload)
    if (result.error) {
      throw result.error
    }

    toast.success("Cuenta creada exitosamente", {
      description: "Bienvenido/a al Dominican HCI Club. Redirigiendo..."
    })

    // Small delay for toast to be visible
    setTimeout(() => {
      window.location.href = "/confirmation"
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
      const result = await performRegistration()
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

  const focusFirstErrorField = (validationErrors: Record<string, string>) => {
    const errorFields = Object.keys(validationErrors)
    if (errorFields.includes('name')) {
      nameInputRef.current?.focus()
    } else if (errorFields.includes('email')) {
      emailInputRef.current?.focus()
    } else if (errorFields.includes('password')) {
      passwordInputRef.current?.focus()
    } else if (errorFields.includes('whatsapp')) {
      whatsappInputRef.current?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    const validation = validateForm()
    if (!validation.isValid) {
      focusFirstErrorField(validation.errors)
      return
    }

    setIsLoading(true)
    setRetryCount(0)

    try {
      await performRegistration()
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
        case 'CONFLICT':
        case 'CAUTH_001': // EMAIL_ALREADY_REGISTERED
        case 'AUTH_001':  // Legacy: EMAIL_ALREADY_REGISTERED
          toast.error("Correo ya registrado", {
            description: (
              <span>
                Este correo ya está registrado.{' '}
                <a href="/login" className="underline font-medium">
                  Inicia sesión aquí
                </a>
              </span>
            )
          })
          emailInputRef.current?.focus()
          setErrors(prev => ({ ...prev, email: 'Este correo ya está registrado.' }))
          break

        case 'BAD_REQUEST':
        case 'CAUTH_031': // VALIDATION_FAILED
          toast.error("Datos inválidos", {
            description: errorMessage
          })
          break

        case 'CAUTH_006': // EMAIL_NOT_VERIFIED
          toast.info("Verificación requerida", {
            description: "Por favor, revisa tu bandeja de entrada para verificar tu correo electrónico."
          })
          break

        case 'CAUTH_022': // API_KEY_INVALID
        case 'CAUTH_023': // API_KEY_INACTIVE
        case 'BIZKEY_002': // Legacy: API_KEY_INVALID
        case 'BIZKEY_003': // Legacy: API_KEY_INACTIVE
          toast.error("Servicio no disponible", {
            description: "Estamos experimentando problemas técnicos. Por favor, intenta más tarde."
          })
          break

        case 'CAUTH_033': // INTERNAL_ERROR
        case 'INTERNAL_SERVER_ERROR':
          toast.error("Error del servidor", {
            description: "Ha ocurrido un error interno. Por favor, intenta nuevamente."
          })
          break

        default:
          toast.error("Error al crear cuenta", {
            description: errorMessage
          })
      }

      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (!isLoading) return "Crear cuenta"
    if (retryCount > 0) return `Reintentando (${retryCount}/${MAX_RETRIES})...`
    return "Creando cuenta..."
  }

  const getStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
      default: return 'bg-gray-200'
    }
  }

  const getStrengthText = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak': return 'Débil'
      case 'medium': return 'Media'
      case 'strong': return 'Fuerte'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/">
            <h1 className="text-2xl font-bold mb-2 text-[rgba(25,42,110,1)]">Dominican HCI CLub </h1>
          </a>
          <p className="text-muted-foreground">Crea tu cuenta y comienza a aprender</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[rgba(25,42,110,1)]">Registro</CardTitle>
            <CardDescription>Completa el formulario para crear tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="name">
                  Nombre completo
                </Label>
                <Input
                  ref={nameInputRef}
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    clearFieldError('name')
                  }}
                  onBlur={() => validateField('name', name)}
                  disabled={isLoading}
                  aria-invalid={!!errors.name}
                  className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-500" role="alert">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="email">
                  Correo electrónico
                </Label>
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
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="whatsapp">
                  WhatsApp (opcional)
                </Label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={isLoading}
                    className="h-10 w-[90px] rounded-md border border-input bg-white px-2 py-2 text-sm appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.5rem center",
                    }}
                  >
                    <option value="+1">+1</option>
                    <option value="+52">+52</option>
                    <option value="+34">+34</option>
                    <option value="+54">+54</option>
                    <option value="+56">+56</option>
                    <option value="+57">+57</option>
                    <option value="+51">+51</option>
                    <option value="+58">+58</option>
                    <option value="+507">+507</option>
                    <option value="+506">+506</option>
                  </select>
                  <Input
                    ref={whatsappInputRef}
                    id="whatsapp"
                    type="tel"
                    placeholder="8091234567"
                    value={whatsapp}
                    onChange={(e) => {
                      setWhatsapp(e.target.value.replace(/\D/g, ""))
                      clearFieldError('whatsapp')
                    }}
                    onBlur={() => whatsapp && validateField('whatsapp', whatsapp)}
                    disabled={isLoading}
                    aria-invalid={!!errors.whatsapp}
                    className={`flex-1 ${errors.whatsapp ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                </div>
                {errors.whatsapp && (
                  <p className="text-sm text-red-500" role="alert">{errors.whatsapp}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="password">
                  Contraseña
                </Label>
                <Input
                  ref={passwordInputRef}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    clearFieldError('password')
                    // Update strength indicator as user types
                    const result = validatePassword(e.target.value)
                    setPasswordStrength(result.strength || null)
                  }}
                  onBlur={() => validateField('password', password)}
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                  className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  required
                  minLength={8}
                />
                {/* Password strength indicator */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      <div className={`h-1 flex-1 rounded ${passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-200'}`} />
                      <div className={`h-1 flex-1 rounded ${passwordStrength === 'medium' || passwordStrength === 'strong' ? getStrengthColor(passwordStrength) : 'bg-gray-200'}`} />
                      <div className={`h-1 flex-1 rounded ${passwordStrength === 'strong' ? getStrengthColor(passwordStrength) : 'bg-gray-200'}`} />
                    </div>
                    {passwordStrength && (
                      <p className={`text-xs ${
                        passwordStrength === 'weak' ? 'text-red-500' :
                        passwordStrength === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        Fortaleza: {getStrengthText(passwordStrength)}
                      </p>
                    )}
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-red-500" role="alert">{errors.password}</p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-[rgba(25,42,110,1)]">Selecciona tu plan</Label>
                <RadioGroup value={plan} onValueChange={setPlan} disabled={isLoading}>
                  <div className="flex items-center space-x-2 border border-input rounded-lg p-4">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#192a6e]">Gratuito</div>
                      <div className="text-sm text-muted-foreground">$0/mes - Acceso básico</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-input rounded-lg p-4">
                    <RadioGroupItem value="premium" id="premium" />
                    <Label htmlFor="premium" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#192a6e]">Premium</div>
                      <div className="text-sm text-muted-foreground">$18/mes - Acceso completo</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-[rgba(25,42,110,1)]" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {getButtonText()}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-center">
              ¿Ya tienes una cuenta?{" "}
              <a href="/login" className="hover:underline font-medium text-[rgba(25,42,110,1)]">
                Inicia sesión aquí
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
