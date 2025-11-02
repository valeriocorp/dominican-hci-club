import { Phone, Mail, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-8 bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          {/* Left Column - Brand and Description */}
          <div className="md:max-w-md md:ml-12">
            <h2 className="text-xl font-bold text-[#192a6e] mb-4">Dominican HCI Club</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Un espacio académico de formación práctica en investigación y diseño de experiencia de usuario,
              fundamentado en la Interacción Humano-Computadora (IHC).
            </p>
          </div>

          {/* Right Side - Three columns grouped together */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {/* Servicios Column */}
            <div>
              <h3 className="text-lg font-bold text-[#192a6e] mb-4">Servicios</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-[#192a6e] transition-colors">
                    Ofertas académicas
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-[#192a6e] transition-colors">
                    Comunidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-[#192a6e] transition-colors">
                    Biblioteca de recursos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-[#192a6e] transition-colors">
                    Mentorías y seguimiento
                  </a>
                </li>
              </ul>
            </div>

            {/* Soporte Column */}
            <div>
              <h3 className="text-lg font-bold text-[#192a6e] mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-[#192a6e] transition-colors">
                    Chat directo
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-[#192a6e] transition-colors">
                    Preguntas frecuentes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-[#192a6e] transition-colors">
                    Guías de estudio
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-[#192a6e] transition-colors">
                    Centro de ayuda
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto Column */}
            <div>
              <h3 className="text-lg font-bold text-[#192a6e] mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:info@dhcis.edu.do"
                    className="text-sm text-muted-foreground hover:text-[#192a6e] transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    info@dominicanhciclub.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+18496529014"
                    className="text-sm text-muted-foreground hover:text-[#192a6e] transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    +1 (849) 652 9014
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/dominicanhciclub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-[#192a6e] transition-colors flex items-center gap-2"
                  >
                    <Instagram className="w-4 h-4 shrink-0" />
                    @dominicanhciclub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-12 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Dominican HCI Club. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

