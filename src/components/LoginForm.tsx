import type React from "react"
import { useState, useRef } from "react"
import { actions } from "astro:actions"
import { toast } from "sonner"
import { Loader2, Mail, MessageSquare, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    validateEmail,
    getActionErrorMessage,
    getActionErrorCode,
    isNetworkError,
    isRetryableError,
} from "@/utils/validation"

// ==========================================
// Types
// ==========================================

type Step =
    | 'email'          // Enter email
    | 'choose_method'  // Pick magic link or WhatsApp OTP
    | 'magic_sent'     // Magic link sent — waiting for user to click
    | 'otp_sent'       // OTP sent — enter 6-digit code

interface AvailableMethods {
    magic_link: boolean
    whatsapp_otp: boolean
}

const BRAND_BLUE = 'rgba(25,42,110,1)'

// ==========================================
// Step: Email input
// ==========================================

function EmailStep({
    email,
    setEmail,
    isLoading,
    onSubmit,
}: {
    email: string
    setEmail: (v: string) => void
    isLoading: boolean
    onSubmit: () => void
}) {
    const [error, setError] = useState('')
    const ref = useRef<HTMLInputElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const r = validateEmail(email)
        if (!r.isValid) {
            setError(r.error || 'Correo inválido')
            ref.current?.focus()
            return
        }
        setError('')
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label style={{ color: BRAND_BLUE }} htmlFor="email">
                    Correo Electrónico
                </Label>
                <Input
                    ref={ref}
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                    }}
                    disabled={isLoading}
                    aria-invalid={!!error}
                    className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    required
                />
                {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
            </div>
            <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: BRAND_BLUE }}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Verificando...' : 'Continuar'}
            </Button>
        </form>
    )
}

// ==========================================
// Step: Choose method
// ==========================================

function ChooseMethodStep({
    email,
    methods,
    isLoading,
    onMagicLink,
    onWhatsapp,
    onBack,
}: {
    email: string
    methods: AvailableMethods
    isLoading: boolean
    onMagicLink: () => void
    onWhatsapp: () => void
    onBack: () => void
}) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
                ¿Cómo prefieres acceder con <span className="font-medium">{email}</span>?
            </p>

            {methods.magic_link && (
                <Button
                    onClick={onMagicLink}
                    className="w-full flex items-center gap-2"
                    style={{ backgroundColor: BRAND_BLUE }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Mail className="h-4 w-4" />
                    )}
                    Recibir enlace por correo
                </Button>
            )}

            {methods.whatsapp_otp && (
                <Button
                    onClick={onWhatsapp}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    style={{ borderColor: BRAND_BLUE, color: BRAND_BLUE }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <MessageSquare className="h-4 w-4" />
                    )}
                    Código por WhatsApp
                </Button>
            )}

            <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-3 w-3" />
                Cambiar correo
            </button>
        </div>
    )
}

// ==========================================
// Step: Magic link sent
// ==========================================

function MagicSentStep({
    email,
    isResending,
    onResend,
    onBack,
}: {
    email: string
    isResending: boolean
    onResend: () => void
    onBack: () => void
}) {
    return (
        <div className="space-y-4 text-center">
            <div className="flex justify-center">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(25,42,110,0.1)' }}
                >
                    <Mail className="h-8 w-8" style={{ color: BRAND_BLUE }} />
                </div>
            </div>
            <div className="space-y-1">
                <p className="font-medium" style={{ color: BRAND_BLUE }}>¡Revisa tu correo!</p>
                <p className="text-sm text-muted-foreground">
                    Enviamos un enlace de acceso a
                </p>
                <p className="text-sm font-medium">{email}</p>
            </div>
            <p className="text-xs text-muted-foreground">
                El enlace expira en 15 minutos. Si no lo ves, revisa tu carpeta de spam.
            </p>
            <div className="space-y-2">
                <Button
                    onClick={onResend}
                    variant="outline"
                    className="w-full text-sm"
                    disabled={isResending}
                >
                    {isResending ? (
                        <><Loader2 className="mr-2 h-3 w-3 animate-spin" />Enviando...</>
                    ) : (
                        'Reenviar enlace'
                    )}
                </Button>
                <button
                    type="button"
                    onClick={onBack}
                    className="w-full flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-3 w-3" />
                    Volver
                </button>
            </div>
        </div>
    )
}

// ==========================================
// Step: OTP sent
// ==========================================

function OtpStep({
    email,
    maskedPhone,
    isLoading,
    onSubmit,
    onResend,
    onBack,
}: {
    email: string
    maskedPhone: string
    isLoading: boolean
    onSubmit: (code: string) => void
    onResend: () => void
    onBack: () => void
}) {
    const [code, setCode] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!code.trim() || code.length < 4) {
            setError('Ingresa el código recibido.')
            return
        }
        setError('')
        onSubmit(code.trim())
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-1">
                <div className="flex justify-center">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(25,42,110,0.1)' }}
                    >
                        <MessageSquare className="h-8 w-8" style={{ color: BRAND_BLUE }} />
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    Enviamos un código a tu WhatsApp <span className="font-medium">{maskedPhone}</span>
                </p>
            </div>

            <div className="space-y-2">
                <Label style={{ color: BRAND_BLUE }} htmlFor="otp-code">
                    Código de verificación
                </Label>
                <Input
                    id="otp-code"
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    maxLength={8}
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value.replace(/\D/g, ''))
                        setError('')
                    }}
                    disabled={isLoading}
                    aria-invalid={!!error}
                    className={`text-center text-xl tracking-widest ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    autoComplete="one-time-code"
                    required
                />
                {error && <p className="text-sm text-red-500 text-center" role="alert">{error}</p>}
            </div>

            <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: BRAND_BLUE }}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Verificando...' : 'Verificar código'}
            </Button>

            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={onResend}
                    disabled={isLoading}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    Reenviar código
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-3 w-3" />
                    Volver
                </button>
            </div>
        </form>
    )
}

// ==========================================
// Main LoginForm
// ==========================================

export default function LoginForm() {
    const [step, setStep] = useState<Step>('email')
    const [email, setEmail] = useState('')
    const [availableMethods, setAvailableMethods] = useState<AvailableMethods>({
        magic_link: true,
        whatsapp_otp: false,
    })
    const [maskedPhone, setMaskedPhone] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)

    const redirectAfterLogin = () => {
        toast.success('Inicio de sesión exitoso', { description: 'Redirigiendo...' })
        setTimeout(() => { window.location.href = '/profile' }, 500)
    }

    // --- Email submission: fetch available methods ---
    const handleEmailSubmit = async () => {
        setIsLoading(true)
        try {
            const result = await actions.auth.getLoginMethods({ email: email.trim() })
            if (result.error) {
                toast.error('Error al verificar el correo', {
                    description: getActionErrorMessage(result.error),
                })
                return
            }
            const methods = result.data?.data?.methods ?? { magic_link: true, whatsapp_otp: false }
            setAvailableMethods({
                magic_link: methods.magic_link ?? true,
                whatsapp_otp: methods.whatsapp_otp ?? false,
            })
            // If only magic_link is available, skip the choose step and send directly
            if ((methods.magic_link || !methods.whatsapp_otp) && !methods.whatsapp_otp) {
                await doSendMagicLink()
                return
            }
            setStep('choose_method')
        } catch (error) {
            toast.error('Error de conexión', { description: 'Intenta nuevamente.' })
        } finally {
            setIsLoading(false)
        }
    }

    // --- Send magic link ---
    const doSendMagicLink = async () => {
        setIsLoading(true)
        try {
            const result = await actions.auth.sendMagicLink({ email: email.trim() })
            if (result.error) {
                const code = getActionErrorCode(result.error)
                if (isRetryableError(code) || isNetworkError(result.error)) {
                    toast.error('Error de conexión', { description: 'Intenta nuevamente.' })
                } else {
                    toast.error('No se pudo enviar el enlace', {
                        description: getActionErrorMessage(result.error),
                    })
                }
                return
            }
            setStep('magic_sent')
        } catch (error) {
            toast.error('Error inesperado', { description: 'Intenta nuevamente.' })
        } finally {
            setIsLoading(false)
        }
    }

    // --- Send WhatsApp OTP ---
    const doSendWhatsappOtp = async () => {
        setIsLoading(true)
        try {
            const result = await actions.auth.sendWhatsappOtp({ email: email.trim() })
            if (result.error) {
                toast.error('No se pudo enviar el código', {
                    description: getActionErrorMessage(result.error),
                })
                return
            }
            setMaskedPhone(result.data?.data?.phone ?? '')
            setStep('otp_sent')
        } catch (error) {
            toast.error('Error inesperado', { description: 'Intenta nuevamente.' })
        } finally {
            setIsLoading(false)
        }
    }

    // --- Verify OTP code ---
    const handleOtpVerify = async (code: string) => {
        setIsLoading(true)
        try {
            const result = await actions.auth.verifyWhatsappOtp({ email: email.trim(), code })
            if (result.error) {
                const errorCode = getActionErrorCode(result.error)
                switch (errorCode) {
                    case 'UNAUTHORIZED':
                        toast.error('Código incorrecto', { description: 'Verifica el código e intenta de nuevo.' })
                        break
                    default:
                        toast.error('No se pudo verificar', { description: getActionErrorMessage(result.error) })
                }
                return
            }
            redirectAfterLogin()
        } catch (error) {
            toast.error('Error inesperado', { description: 'Intenta nuevamente.' })
        } finally {
            setIsLoading(false)
        }
    }

    const stepTitles: Record<Step, { title: string; description: string }> = {
        email: { title: 'Iniciar Sesión', description: 'Ingresa tu correo para continuar' },
        choose_method: { title: 'Elige cómo acceder', description: 'Sin contraseña necesaria' },
        magic_sent: { title: 'Enlace enviado', description: 'Accede sin contraseña' },
        otp_sent: { title: 'Código enviado', description: 'Ingresa el código de WhatsApp' },
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <a href="/">
                        <h1 className="text-2xl font-bold mb-2" style={{ color: BRAND_BLUE }}>
                            Dominican HCI Club
                        </h1>
                    </a>
                    <p className="text-muted-foreground">Bienvenido/a de vuelta</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle style={{ color: BRAND_BLUE }}>{stepTitles[step].title}</CardTitle>
                        <CardDescription>{stepTitles[step].description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {step === 'email' && (
                            <EmailStep
                                email={email}
                                setEmail={setEmail}
                                isLoading={isLoading}
                                onSubmit={handleEmailSubmit}
                            />
                        )}

                        {step === 'choose_method' && (
                            <ChooseMethodStep
                                email={email}
                                methods={availableMethods}
                                isLoading={isLoading}
                                onMagicLink={doSendMagicLink}
                                onWhatsapp={doSendWhatsappOtp}
                                onBack={() => setStep('email')}
                            />
                        )}

                        {step === 'magic_sent' && (
                            <MagicSentStep
                                email={email}
                                isResending={isResending}
                                onResend={async () => {
                                    setIsResending(true)
                                    const result = await actions.auth.sendMagicLink({ email: email.trim() })
                                    setIsResending(false)
                                    if (result.error) {
                                        toast.error('No se pudo reenviar', { description: getActionErrorMessage(result.error) })
                                    } else {
                                        toast.success('Enlace reenviado')
                                    }
                                }}
                                onBack={() => setStep('choose_method')}
                            />
                        )}

                        {step === 'otp_sent' && (
                            <OtpStep
                                email={email}
                                maskedPhone={maskedPhone}
                                isLoading={isLoading}
                                onSubmit={handleOtpVerify}
                                onResend={doSendWhatsappOtp}
                                onBack={() => setStep('choose_method')}
                            />
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground text-center">
                            ¿No tienes una cuenta?{' '}
                            <a
                                href="/register"
                                className="hover:underline font-medium"
                                style={{ color: BRAND_BLUE }}
                            >
                                Regístrate aquí
                            </a>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
