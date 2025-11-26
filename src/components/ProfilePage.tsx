import { useState } from 'react'
import { actions } from 'astro:actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, LogOut, User, Mail, Phone, Edit } from 'lucide-react'
import HeaderProfile from './HeaderProfile'

type PlanType = 'free' | 'premium'

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
   * Plan actual del usuario. Valor por defecto: 'free'.
   * TODO: Cuando el backend exponga información de suscripción (ej. en /auth/customer/login 
   * o mediante un endpoint dedicado), pasar el plan real desde profile.astro.
   */
  currentPlan?: PlanType;
}

export default function ProfilePage({ user, isLoggedIn, currentPlan = 'free' }: ProfilePageProps) {
  
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await actions.auth.logout()
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  // Formatear fecha de registro
  const formatMemberSince = (dateString?: string | null) => {
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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-orange-50/30 to-blue-50/20">
      {/* Header */}
    <HeaderProfile />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'rgba(25,42,110,1)' }}>Mi perfil</h2>
            <p className="text-gray-600">Gestiona tu información personal y suscripción</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </Button>
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
              <div>
                <p className="text-sm text-gray-500">Miembro desde</p>
                <p className="font-medium">{formatMemberSince(user.created_at)}</p>
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
              {currentPlan === 'premium' ? (
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
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button variant="outline" className="flex-1">
                      Actualizar tarjeta
                    </Button>
                    <Button
                      style={{ backgroundColor: '#192a6e' }}
                      className="flex-1"
                      asChild
                    >
                      <a href="/plan-changed">
                        Cambiar a plan básico
                      </a>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Plan actual</p>
                    <p className="font-semibold text-lg">Gratuito - $0/mes</p>
                  </div>
                  <p className="text-gray-600">
                    ¡Maximiza tu potencial desbloqueando proyectos, mentorías y mucho más por solo $18 USD al mes! 👏
                  </p>
                  <Button className="w-full" style={{ backgroundColor: '#192a6e' }} asChild>
                    <a href="/register?plan=premium">
                      Acceder a mi potencial premium✨
                    </a>
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
              {currentPlan === 'premium' ? (
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
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span>Acceso a recursos limitados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span>Asistencia a eventos limitados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span>Comunidad limitada</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span>Soporte</span>
                  </li>
                </ul>
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
                    href="mailto:info@dhcis.edu.do"
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
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button className="flex-1" style={{ backgroundColor: '#192a6e' }} asChild>
              <a href="/">
                Continua aprendiendo
              </a>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href="/recuperacion">
                Ver pantalla de recuperación
              </a>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href="/profile-free">
                Ver perfil gratis
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
