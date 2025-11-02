import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, LogOut, User, Mail, Phone, Edit } from 'lucide-react'
import HeaderProfile from './HeaderProfile'

export default function ProfileFreePage() {
  const currentPlan = 'free'
  
  const [isEditing, setIsEditing] = useState(false)
  const [accountInfo, setAccountInfo] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    memberSince: '15 de Enero, 2024'
  })

  const handleSaveAccountInfo = () => {
    setIsEditing(false)
    alert('Información guardada exitosamente')
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
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveAccountInfo}
                      style={{ backgroundColor: '#192a6e' }}
                    >
                      Guardar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={accountInfo.name}
                      onChange={(e) => setAccountInfo({ ...accountInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={accountInfo.email}
                      onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberSince">Miembro desde</Label>
                    <Input
                      id="memberSince"
                      value={accountInfo.memberSince}
                      onChange={(e) => setAccountInfo({ ...accountInfo, memberSince: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p className="font-medium">{accountInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                    <p className="font-medium">{accountInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Miembro desde</p>
                    <p className="font-medium">{accountInfo.memberSince}</p>
                  </div>
                </>
              )}
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
              <div>
                <p className="text-sm text-gray-500">Plan actual</p>
                <p className="font-semibold text-lg">Gratuito - $0/mes</p>
              </div>
              <p className="text-gray-600">
                ¡Maximiza tu potencial desbloqueando proyectos, mentorías y mucho más por solo $18 USD al mes! 👏
              </p>
              <Button className="w-full" style={{ backgroundColor: '#192a6e' }} asChild>
                <a href="/premium-welcome">
                  Acceder a mi potencial premium✨
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Benefits Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tus beneficios  </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold" style={{ color: '#192a6e' }}>
                   Desbloquea más con Premium:
                </p>
                <ul className="space-y-2 text-sm">
                <li>✨ Acceso a todos los recursos académicos</li>
                  <li>✨ Seminarios ilimitados + grabaciones</li>
                  <li>✨ Networking con profesionales</li>
                  <li>✨ Mentoría 1:1</li>
                  <li>✨ Soporte prioritario</li>
                </ul>
                {/* <Button className="w-full mt-2" style={{ backgroundColor: '#192a6e' }} asChild>
                  <a href="/premium-welcome">
                    Descubre Premium
                  </a>
                </Button> */}
              </div>
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
              <a href="/profile">
                Ver perfil Premium
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

