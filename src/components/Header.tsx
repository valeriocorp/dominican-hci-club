import { Button } from '@/components/ui/button'


export default function Header() {
  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[rgba(25,42,110,1)]">Dominican HCI Club </h1>
          <nav className="flex items-center gap-6">
            <a
              href="#inicio"
              className="text-sm font-medium hover:text-primary transition-colors hidden md:inline-block text-[rgba(25,42,110,1)]"
            >
              Inicio
            </a>
            <a
              href="#sobre-nosotros"
              className="text-sm font-medium hover:text-primary transition-colors hidden md:inline-block text-[rgba(25,42,110,1)]"
            >
              Sobre nosotros
            </a>
            <a
              href="#membresia"
              className="text-sm font-medium hover:text-primary transition-colors hidden md:inline-block text-[rgba(25,42,110,1)]"
            >
              Membresía
            </a>
            <a
              href="#soporte"
              className="text-sm font-medium hover:text-primary transition-colors hidden md:inline-block text-[rgba(25,42,110,1)]"
            >
              Soporte
            </a>
            
            <Button  className="font-bold text-[rgba(25,42,110,1)] bg-[rgba(246,246,246,1)]" variant="ghost" asChild>
              <a href="/login">
                Ingresa ya{" "}
              </a>
            </Button>
            <Button  className="font-bold bg-[rgba(25,42,110,1)] text-[rgba(255,255,255,1)]" asChild>
              <a href="/register">
                {"Únete hoy"}
              </a>
            </Button>
          </nav>
        </div>
      </header>
  )
}