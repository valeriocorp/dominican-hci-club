import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Target, Users, Award } from 'lucide-react'

export default function AboutSection() {
  return (
    <section id="sobre-nosotros" className="container mx-auto px-4 py-24 border-t border-border scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center text-balance text-[rgba(25,42,110,1)]">
          Sobre el Dominican HCI Club
        </h3>
        <p className="text-lg text-muted-foreground mb-12 text-center text-pretty max-w-4xl mx-auto">
          Te llevamos más allá de la teoría conectando el aprendizaje con la práctica junto a buenos estudiantes que
          están creciendo en la investigación y diseño UX mediante:
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Proyectos prácticos */}
          <Card className="border-t-4 border-t-[#f97316]">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[#f97316]/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[#f97316]" />
              </div>
              <CardTitle className="text-xl">1) Proyectos prácticos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Accede a nuestra metodología de aprendizaje que se centra en la aplicación del conocimiento mediante
                proyectos
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Módulos de práctica</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">
                    Casos de estudio de la industria para aprender de proyectos concretos
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Guía para construir tu portafolio con impacto</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Comunidad activa */}
          <Card className="border-t-4 border-t-[#8b5cf6]">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <CardTitle className="text-xl">2) Comunidad activa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Conecta con más estudiantes, comparte conocimientos y construye una red de valor para tu carrera
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Networking con expertos de la industria</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Grupos de estudio colaborativos para tus proyectos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Sesiones en vivo de Q&A con mentores</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Soporte académico */}
          <Card className="border-t-4 border-t-[#06b6d4]">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[#06b6d4]/10 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-[#06b6d4]" />
              </div>
              <CardTitle className="text-xl">3) Soporte académico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Recibe ayuda instantánea y accede a recursos educativos</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Soporte en tiempo real para dudas de investigación y diseño UX</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Guías, plantillas y recursos para proyectos prácticos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Feedback acerca de tus avances</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

