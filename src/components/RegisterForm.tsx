import type React from "react"
import { useState, useRef } from "react"
import { actions } from "astro:actions"
import { PUBLIC_FREE_PLAN_ID, PUBLIC_PREMIUM_PLAN_ID } from "astro:env/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  validateEmail,
  validateName,
  validatePhone,
  isNetworkError,
  isRetryableError,
  getActionErrorMessage,
  getActionErrorCode
} from "@/utils/validation"

const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 2000, 4000] // Exponential backoff

// Tipo para los países
interface CountryCode {
  code: string
  flag: string
  name: string
  iso: string
}

// Lista de países con códigos telefónicos y banderas
const COUNTRY_CODES: CountryCode[] = [
  { code: "+1", flag: "🇩🇴", name: "República Dominicana", iso: "DO" },
  { code: "+1", flag: "🇺🇸", name: "Estados Unidos", iso: "US" },
  { code: "+1", flag: "🇨🇦", name: "Canadá", iso: "CA" },
  { code: "+1", flag: "🇵🇷", name: "Puerto Rico", iso: "PR" },
  { code: "+52", flag: "🇲🇽", name: "México", iso: "MX" },
  { code: "+34", flag: "🇪🇸", name: "España", iso: "ES" },
  { code: "+54", flag: "🇦🇷", name: "Argentina", iso: "AR" },
  { code: "+56", flag: "🇨🇱", name: "Chile", iso: "CL" },
  { code: "+57", flag: "🇨🇴", name: "Colombia", iso: "CO" },
  { code: "+51", flag: "🇵🇪", name: "Perú", iso: "PE" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela", iso: "VE" },
  { code: "+507", flag: "🇵🇦", name: "Panamá", iso: "PA" },
  { code: "+506", flag: "🇨🇷", name: "Costa Rica", iso: "CR" },
  { code: "+502", flag: "🇬🇹", name: "Guatemala", iso: "GT" },
  { code: "+503", flag: "🇸🇻", name: "El Salvador", iso: "SV" },
  { code: "+504", flag: "🇭🇳", name: "Honduras", iso: "HN" },
  { code: "+505", flag: "🇳🇮", name: "Nicaragua", iso: "NI" },
  { code: "+593", flag: "🇪🇨", name: "Ecuador", iso: "EC" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia", iso: "BO" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay", iso: "PY" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay", iso: "UY" },
]

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]) // República Dominicana por defecto
  const [whatsapp, setWhatsapp] = useState("")
  const plan = "premium" // Plan único — sin selector
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [retryCount, setRetryCount] = useState(0)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const whatsappInputRef = useRef<HTMLInputElement>(null)

  // Plan único: siempre premium. Sin selector.
  // (useEffect de plan-from-URL eliminado; ya no aplica con plan único)

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
    const phoneResult = validatePhone(whatsapp)

    const newErrors: Record<string, string> = {}

    if (!nameResult.isValid && nameResult.error) {
      newErrors.name = nameResult.error
    }
    if (!emailResult.isValid && emailResult.error) {
      newErrors.email = emailResult.error
    }
    if (!phoneResult.isValid && phoneResult.error) {
      newErrors.whatsapp = phoneResult.error
    }

    setErrors(newErrors)
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors }
  }

  const performRegistration = async (): Promise<boolean> => {
    // Formatear teléfono completo (código país + número)
    const fullPhone = whatsapp.trim() ? `${selectedCountry.code}${whatsapp}` : undefined

    // IDs de planes del negocio - configurados via variables de entorno
    // Dev: free=10, premium=9 | Prod: free=1, premium=2
    const PLAN_IDS = {
      free: PUBLIC_FREE_PLAN_ID,
      premium: PUBLIC_PREMIUM_PLAN_ID
    } as const

    // Determinar plan_id basado en la selección del usuario
    const planId = PLAN_IDS[plan as keyof typeof PLAN_IDS]

    const payload = {
      email: email.trim(),
      name: name.trim(),
      phone: fullPhone,
      plan_id: planId
    }

    // 1. Registrar usuario
    const result = await actions.auth.registerCustomer(payload)
    if (result.error) {
      throw result.error
    }

    const customerEmail = email.trim().toLowerCase()
    const customerName = name.trim()

    // 2. Procesar según el plan seleccionado
    if (plan === 'free') {
      // Plan Gratuito: Completar suscripción gratuita
      toast.loading("Activando tu plan gratuito...", { id: 'activating-plan' })
      
      try {
        const freePlanResult = await actions.subscriptions.completeFreePlan({
          customer_email: customerEmail,
          customer_name: customerName,
          customer_phone: fullPhone,
        })

        toast.dismiss('activating-plan')

        if (freePlanResult.error) {
          console.error('Error activando plan gratuito:', freePlanResult.error)
          // Continuamos aunque falle, el usuario ya está registrado
          toast.warning("Tu cuenta fue creada, pero hubo un problema activando el plan gratuito.", {
            description: "Contacta soporte si no puedes acceder a tu plan."
          })
        } else {
          toast.success("¡Cuenta creada y plan gratuito activado!", {
            description: "Bienvenido(a) al Dominican HCI Club. Redirigiendo..."
          })
        }

        setTimeout(() => {
          window.location.href = "/confirmation"
        }, 1000)

      } catch (error) {
        toast.dismiss('activating-plan')
        console.error('Error en completeFreePlan:', error)
        // Aún así redirigimos porque el usuario ya está registrado
        toast.success("Cuenta creada exitosamente", {
          description: "Redirigiendo..."
        })
        setTimeout(() => {
          window.location.href = "/confirmation"
        }, 1000)
      }

    } else {
      // Plan Premium: Crear checkout de Stripe
      toast.loading("Preparando el checkout...", { id: 'preparing-checkout' })

      try {
        const checkoutResult = await actions.subscriptions.createSubscriptionCheckout({
          plan_id: planId,
          customer_email: customerEmail,
          customer_name: customerName,
          customer_phone: fullPhone,
          currency: 'USD',
          success_url: `${window.location.origin}/welcome`,
          cancel_url: `${window.location.origin}/register`,
        })

        toast.dismiss('preparing-checkout')

        if (checkoutResult.error) {
          console.error('Error creando checkout:', checkoutResult.error)
          toast.error("Error al preparar el pago", {
            description: "Tu cuenta fue creada. Puedes completar el pago desde tu perfil."
          })
          setTimeout(() => {
            window.location.href = "/profile"
          }, 2000)
        } else if (checkoutResult.data?.data?.checkout_url) {
          const checkoutUrl = checkoutResult.data.data.checkout_url
          toast.success("¡Cuenta creada! Redirigiendo al pago...", {
            description: "Serás redirigido a Stripe para completar tu suscripción."
          })
          // Redirigir al checkout de Stripe
          setTimeout(() => {
            window.location.href = checkoutUrl
          }, 1500)
        } else {
          toast.warning("Tu cuenta fue creada", {
            description: "Puedes completar el pago del plan premium desde tu perfil."
          })
          setTimeout(() => {
            window.location.href = "/profile"
          }, 2000)
        }

      } catch (error) {
        toast.dismiss('preparing-checkout')
        console.error('Error en createSubscriptionCheckout:', error)
        toast.warning("Tu cuenta fue creada", {
          description: "Puedes completar el pago del plan premium desde tu perfil."
        })
        setTimeout(() => {
          window.location.href = "/profile"
        }, 2000)
      }
    }

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
    if (!isLoading) return "Inscribirme hoy"
    if (retryCount > 0) return `Reintentando (${retryCount}/${MAX_RETRIES})...`
    return "Inscribiendo..."
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <a href="/">
            <h1 className="text-2xl font-bold mb-2 text-[rgba(25,42,110,1)]">Dominican HCI Club</h1>
          </a>
          <p className="text-muted-foreground">Crea tu cuenta y comienza tu crecimiento</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[rgba(25,42,110,1)]">Registro</CardTitle>
            <CardDescription>Completa el formulario para inscribirte</CardDescription>
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
                    value={selectedCountry.iso}
                    onChange={(e) => {
                      const country = COUNTRY_CODES.find(c => c.iso === e.target.value)
                      if (country) setSelectedCountry(country)
                    }}
                    disabled={isLoading}
                    className="h-10 w-[120px] rounded-md border border-input bg-white px-2 py-2 text-sm appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.5rem center",
                    }}
                  >
                    {COUNTRY_CODES.map((country) => (
                      <option key={country.iso} value={country.iso}>
                        {country.flag} {country.code}
                      </option>
                    ))}
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
              <div className="space-y-3 pt-2">
                <Label className="text-[rgba(25,42,110,1)]">Tu inversión</Label>
                <div className="border border-input rounded-lg p-4 flex items-baseline justify-between gap-3">
                  <div className="font-semibold text-[#192a6e]">DOP $1,250/mes</div>
                  <div className="text-sm text-muted-foreground">Acceso completo</div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[rgba(25,42,110,1)]" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {getButtonText()}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-center">
              ¿Ya te inscribiste?{" "}
              <a href="/login" className="hover:underline font-medium text-[rgba(25,42,110,1)]">
                Accede aquí
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
