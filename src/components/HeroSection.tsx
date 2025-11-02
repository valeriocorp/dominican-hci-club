import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden scroll-mt-24">
      {/* Full-width gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-orange-50/30 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(25,42,110,0.1)] border border-[rgba(25,42,110,0.2)] mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-[rgba(255,140,0,1)]" />
            <span className="text-sm font-medium text-[rgba(25,42,110,1)]">Sitio web aún en construcción </span>
          </div>

          <h2 className="text-6xl md:text-7xl font-bold mb-8 text-balance leading-tight animate-fade-in-up animation-delay-200">
            <span className="text-[rgba(25,42,110,1)]">Aprende haciendo,</span>
            <br />
            <span className="text-[rgba(25,42,110,1)]">no solo leyendo</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-10 text-pretty max-w-3xl mx-auto leading-relaxed md:text-xl animate-fade-in-up animation-delay-400">
            Únete a nuestro espacio y participa desarrollando proyectos de investigación y diseño de experiencia de
            usuario mientras aplicas conocimientos sobre HCI 🚀
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <Button
              size="lg"
              className="text-lg px-10 py-6 bg-[rgba(25,42,110,1)] hover:bg-[rgba(25,42,110,0.9)] shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <a href="/register">
                Quiero formar parte 🤝
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 border-2 border-[rgba(25,42,110,0.3)] hover:border-[rgba(25,42,110,0.5)] hover:bg-[rgba(25,42,110,0.05)] transition-all bg-transparent text-[rgba(25,42,110,1)]"
            >
              Quiero saber más 💡
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

