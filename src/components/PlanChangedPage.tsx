import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function PlanChangedPage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-orange-50/30 to-blue-50/20 min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16" style={{ color: '#192a6e' }} />
          </div>
          <CardTitle className="text-2xl" style={{ color: '#192a6e' }}>
            Plan actualizado
          </CardTitle>
          <CardDescription>
            Tu suscripción ha sido cambiada exitosamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg" style={{ color: '#192a6e' }}>
              Plan básico
            </h3>
            <p className="text-sm text-gray-600">
              Ahora tienes acceso a los beneficios básicos del club
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#192a6e' }} />
                <span className="text-sm">Acceso a recursos limitados</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#192a6e' }} />
                <span className="text-sm">Asistencia a eventos limitados</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#192a6e' }} />
                <span className="text-sm">Comunidad limitada</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#192a6e' }} />
                <span className="text-sm">Soporte</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" style={{ backgroundColor: '#192a6e' }} asChild>
            <a href="/profile">
              Explorar mi nuevo contenido
            </a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href="/">
              Volver al inicio
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

