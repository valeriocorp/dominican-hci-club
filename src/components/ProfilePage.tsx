import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, User, Mail, Phone, Loader2 } from 'lucide-react'
import HeaderProfile from './HeaderProfile'
import { toast } from 'sonner'
import { actions } from 'astro:actions'
import { PUBLIC_PREMIUM_PLAN_ID } from 'astro:env/client'

interface ProfilePageProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    created_at?: string | null;
  };
  isLoggedIn: boolean;
  /**
   * Indica si el usuario tiene una membresía premium activa y pagada.
   * Premium-only: sin membresía activa NO hay acceso de miembro; se muestra
   * el estado "pago pendiente". Los miembros activos son redirigidos por el
   * middleware a /profile-premium, así que aquí normalmente llega false.
   */
  isMember?: boolean;
}

export default function ProfilePage({ user, isMember = false }: ProfilePageProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)

  const handleUpgradeToPremium = async () => {
    setIsUpgrading(true)
    try {
      const result = await actions.subscriptions.createSubscriptionCheckout({
        customer_email: user.email,
        plan_id: PUBLIC_PREMIUM_PLAN_ID,
        success_url: `${window.location.origin}/premium-welcome`,
        cancel_url: window.location.href,
      })

      if (result.data?.data?.checkout_url) {
        window.location.href = result.data.data.checkout_url
      } else {
        toast.error('Error al crear el checkout', {
          description: 'No se pudo obtener la URL de pago. Por favor, intenta nuevamente.',
        })
        setIsUpgrading(false)
      }
    } catch (error) {
      console.error('Error upgrading to premium:', error)
      toast.error('Error al procesar el upgrade', {
        description: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
      })
      setIsUpgrading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-orange-50/30 to-blue-50/20">
      {/* Header */}
    <HeaderProfile />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'rgba(25,42,110,1)' }}>Mi perfil</h2>
          <p className="text-gray-600">Gestiona tu información personal y suscripción</p>
        </div>

        <div className="space-y-6">
          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" style={{ color: 'rgba(25,42,110,1)' }} />
                  <CardTitle>Información de la cuenta</CardTitle>
                </div>
                {/* TODO: Implementar edición de perfil cuando el backend lo soporte */}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Correo electrónico</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" style={{ color: 'rgba(25,42,110,1)' }} />
                <CardTitle>Suscripción</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isMember ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Plan actual</p>
                    <p className="font-semibold text-lg" style={{ color: 'rgba(25,42,110,1)' }}>
                      Premium - $18/mes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Próxima facturación</p>
                    <p className="font-medium">15 de Febrero, 2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Método de pago</p>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      Actualizar tarjeta
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Plan actual</p>
                    <p className="font-semibold text-lg">Sin membresía activa</p>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="font-medium text-gray-800">Tu membresía está pendiente de pago</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Completa el pago de tu plan premium para acceder a todos los beneficios del club.
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    style={{ backgroundColor: '#192a6e' }}
                    onClick={handleUpgradeToPremium}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Completar mi membresía premium ✨'
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Benefits Card */}
          <Card>
            <CardHeader>
              <CardTitle>Beneficios de tu plan</CardTitle>
            </CardHeader>
            <CardContent>
              {isMember ? (
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">Recursos ilimitados</p>
                      <p className="text-sm text-gray-600">Acceso completo a toda la biblioteca académica</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">Seminarios exclusivos</p>
                      <p className="text-sm text-gray-600">Asistencia ilimitada a eventos + grabaciones</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">Comunidad profesional</p>
                      <p className="text-sm text-gray-600">Conexión directa con expertos del sector</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">Mentoría personalizada</p>
                      <p className="text-sm text-gray-600">Sesiones 1:1 con mentores expertos</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">Soporte prioritario</p>
                      <p className="text-sm text-gray-600">Respuestas rápidas a tus consultas</p>
                    </div>
                  </li>
                </ul>
              ) : (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-3">Con Premium vas a desbloquear:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span>✨</span>
                      <span className="text-gray-700">Acceso a todos los recursos académicos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✨</span>
                      <span className="text-gray-700">Seminarios ilimitados + grabaciones</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✨</span>
                      <span className="text-gray-700">Networking con profesionales</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✨</span>
                      <span className="text-gray-700">Mentoría 1:1</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✨</span>
                      <span className="text-gray-700">Soporte prioritario</span>
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contacto y soporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5" style={{ color: '#192a6e' }} />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:info@dominicanhciclub.com"
                    className="text-sm text-gray-600 hover:underline"
                  >
                    info@dominicanhciclub.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5" style={{ color: '#192a6e' }} />
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <a
                    href="https://wa.me/18496529014"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:underline"
                  >
                    +1 (849) 652-9014
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="pt-4">
            <Button className="w-full" style={{ backgroundColor: '#192a6e' }} asChild>
              <a href="https://chat.whatsapp.com/H9efJ2wyGACEdurOVLbOpD" target="_blank" rel="noopener noreferrer">
                Continua aprendiendo
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
