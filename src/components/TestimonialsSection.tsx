import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Whainer Gómez',
      role: 'Estudiante de Informática',
      initial: 'W',
      quote: 'La maestra se adapta a nuestro lenguaje por lo que así es más fácil de entenderla.',
    },
    {
      name: 'Yeicol Martínez',
      role: 'Estudiante de Informática',
      initial: 'Y',
      quote: 'Lo que más me gustó de la clase fue el contenido teórico, los ejercicios prácticos, la claridad del instructor y los materiales de apoyo.',
    },
    {
      name: 'Luis Urbaez',
      role: 'Estudiante de Informática',
      initial: 'L',
      quote: 'La profundidad del contenido fue buena y siento que las clases me prepararon para aplicar el diseño UX/UI en el desarrollo de software.',
    },
  ]

  return (
    <section className="container mx-auto px-4 py-24 border-t border-border scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        {/* Testimonial Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[#192a6e]">Esto dicen nuestros estudiantes</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            El resultado del acompañamiento en dudas junto al dominio en la ejecución de proyectos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border">
              <CardContent className="pt-6">
                {/* 5 Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>

                {/* Testimonial Quote */}
                <p className="text-muted-foreground italic mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#192a6e] flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">{testimonial.initial}</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

