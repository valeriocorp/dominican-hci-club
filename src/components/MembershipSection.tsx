import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function MembershipSection() {
  return (
    <section id="membresia" className="container mx-auto px-4 py-24 border-t border-border scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[rgba(25,42,110,1)]">Con planes hechos para ti </h3>
          <p className="text-xl text-muted-foreground">Comienza gratis o desbloquea todo el potencial con Premium</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[rgba(9,9,9,1)]">Plan básico</CardTitle>
              <CardDescription className="text-lg">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/mes</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Acceso a recursos limitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Asistencia a eventos limitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Comunidad limitada</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Soporte</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <a href="/register" className="w-full">
                  Comenzar gratis
                </a>
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-[#192a6e]">
            <CardHeader>
              <CardTitle className="text-2xl text-[rgba(25,42,110,1)]">Plan premium</CardTitle>
              <CardDescription className="text-lg">
                <span className="text-4xl font-bold text-[rgba(25,42,110,1)]">$18</span>
                <span className="text-[rgba(25,42,110,1)]">/mes USD</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Acceso a todos los recursos académicos </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Seminarios ilimitados + grabaciones</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Comunidad premium exclusiva</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Networking con profesionales</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Mentoría 1:1</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">Soporte prioritario</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[rgba(25,42,110,1)]" asChild>
                <a href="/register?plan=premium" className="w-full">
                  Comenzar premium
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}

