import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, User, Mail, Phone, Crown, Calendar, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { actions } from 'astro:actions'
import HeaderProfile from './HeaderProfile'

interface ProfilePremiumPageProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    created_at?: string | null;
  };
  subscription?: {
    id: string;
    plan_id: string;
    plan_name: string;
    plan_type: 'free' | 'premium';
    status: string;
    amount: string;
    currency: string;
  } | null;
}

export default function ProfilePremiumPage({ user, subscription }: ProfilePremiumPageProps) {
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)

  // Función para abrir el Customer Portal de Stripe
  const handleOpenPortal = async () => {
    setIsLoadingPortal(true)
    try {
      const result = await actions.subscriptions.createPortalSession({
        customer_email: user.email,
        return_url: window.location.href,
      })

      if (result.data?.data?.portal_url) {
        // Redirigir al Customer Portal de Stripe
        window.location.href = result.data.data.portal_url
      } else {
        toast.error('Error al abrir el portal', {
          description: 'No se pudo obtener la URL del portal. Por favor, intenta nuevamente.',
        })
      }
    } catch (error) {
      console.error('Error opening portal:', error)
      toast.error('Error al abrir el portal', {
        description: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
      })
    } finally {
      setIsLoadingPortal(false)
    }
  }

  // Formatear fecha de registro
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Fecha no disponible'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return 'Fecha no disponible'
    }
  }

  // Calcular próxima fecha de facturación (30 días desde ahora como ejemplo)
  const getNextBillingDate = () => {
    const nextDate = new Date()
    nextDate.setMonth(nextDate.getMonth() + 1)
    return formatDate(nextDate.toISOString())
  }

  const amount = subscription?.amount || '18'
  const currency = subscription?.currency || 'USD'

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-orange-50/30 to-blue-50/20">
      {/* Header */}
      <HeaderProfile />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header with Premium Badge */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold" style={{ color: 'rgba(25,42,110,1)' }}>Mi perfil</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-linear-to-r from-amber-400 to-orange-500 text-white">
              <Crown className="w-4 h-4" />
              Premium
            </span>
          </div>
          <p className="text-gray-600">Gestiona tu información personal y suscripción premium</p>
        </div>

        <div className="space-y-6">
          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" style={{ color: 'rgba(25,42,110,1)' }} />
                <CardTitle>Información de la cuenta</CardTitle>
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

          {/* Premium Subscription Card */}
          <Card className="border-2 border-amber-200 bg-linear-to-br from-amber-50/50 to-orange-50/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" style={{ color: 'rgba(25,42,110,1)' }} />
                <CardTitle>Suscripción Premium</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Plan actual</p>
                  <p className="font-semibold text-lg" style={{ color: 'rgba(25,42,110,1)' }}>
                    {subscription?.plan_name || 'Plan Premium'} - ${amount} {currency}/mes
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {subscription?.status === 'active' ? 'Activo' : subscription?.status || 'Activo'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Próxima facturación: {getNextBillingDate()}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleOpenPortal}
                  disabled={isLoadingPortal}
                >
                  {isLoadingPortal ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Abriendo portal...
                    </>
                  ) : (
                    'Gestionar suscripción'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Benefits Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Tus beneficios Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Recursos ilimitados</p>
                    <p className="text-sm text-gray-600">Acceso completo a toda la biblioteca académica</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Seminarios exclusivos</p>
                    <p className="text-sm text-gray-600">Asistencia ilimitada a eventos + grabaciones</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Comunidad profesional</p>
                    <p className="text-sm text-gray-600">Conexión directa con expertos del sector HCI</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Mentoría personalizada</p>
                    <p className="text-sm text-gray-600">Sesiones 1:1 con mentores expertos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Soporte prioritario</p>
                    <p className="text-sm text-gray-600">Respuestas rápidas a todas tus consultas</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contacto y soporte prioritario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Como miembro Premium, tienes acceso a soporte prioritario. ¡Estamos aquí para ayudarte!
              </p>
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
                  <p className="font-medium">WhatsApp prioritario</p>
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

        </div>
      </main>
    </div>
  )
}
