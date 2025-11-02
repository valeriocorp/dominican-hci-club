import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Check } from 'lucide-react'

export default function PremiumWelcomePage() {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-gradient-to-br from-blue-50 via-orange-50/30 to-blue-50/20 min-h-screen relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#192a6e', '#f97316', '#3b82f6', '#fbbf24', '#ec4899'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        {/* Celebration Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="rounded-full p-4 animate-bounce" style={{ backgroundColor: '#192a6e' }}>
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#192a6e' }}>
            ¡Bienvenid@ al Plan Premium!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Has dado el primer paso para transformar tu carrera en HCI
          </p>
        </div>

        {/* Premium Benefits */}
        <Card className="mb-8 border-2 animate-fade-in-up animation-delay-200" style={{ borderColor: '#192a6e' }}>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Tus Beneficios Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-1" style={{ color: '#192a6e' }} />
                  <div>
                    <h3 className="font-semibold">Recursos ilimitados</h3>
                    <p className="text-sm text-gray-600">
                      Acceso completo a toda nuestra biblioteca académica
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-1" style={{ color: '#192a6e' }} />
                  <div>
                    <h3 className="font-semibold">Seminarios exclusivos</h3>
                    <p className="text-sm text-gray-600">
                      Asistencia ilimitada a eventos + grabaciones completas
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-1" style={{ color: '#192a6e' }} />
                  <div>
                    <h3 className="font-semibold">Networking profesional</h3>
                    <p className="text-sm text-gray-600">
                      Conéctate con expertos de la industria
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-1" style={{ color: '#192a6e' }} />
                  <div>
                    <h3 className="font-semibold">Mentoría personalizada</h3>
                    <p className="text-sm text-gray-600">
                      Sesiones 1:1 con mentores expertos
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-1" style={{ color: '#192a6e' }} />
                  <div>
                    <h3 className="font-semibold">Proyectos colaborativos</h3>
                    <p className="text-sm text-gray-600">
                      Participa en proyectos reales del sector
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-1" style={{ color: '#192a6e' }} />
                  <div>
                    <h3 className="font-semibold">Soporte prioritario</h3>
                    <p className="text-sm text-gray-600">
                      Respuestas rápidas a tus consultas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8 animate-fade-in-up animation-delay-400">
          <CardHeader>
            <CardTitle className="text-xl font-extrabold" style={{ color: '#192a6e' }}>
              Nuestro próximo paso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              En las próximas 24 horas, recibirás una invitación a Pumble, nuestra plataforma de comunicación exclusiva donde podrás conectar con la comunidad, acceder a recursos y participar en eventos.
            </p>
            <p className="text-gray-600">
              Mientras tanto, explora tu nuevo perfil y descubre todo lo que tenemos preparado para ti 🤍
            </p>
          </CardContent>
        </Card>

        {/* CTA Button */}
        <div className="text-center animate-fade-in-up animation-delay-600">
          <Button size="lg" className="px-8 py-6 text-lg" style={{ backgroundColor: '#192a6e' }} asChild>
            <a href="/profile">
              Nos vemos en el club 🚀
            </a>
          </Button>
        </div>
      </div>

      {/* Inline Styles */}
      <style>{`
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s linear infinite;
        }

        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

