import { useState } from 'react'
import { actions } from 'astro:actions'
import { Button } from '@/components/ui/button'
import { LogOut, User, Loader2 } from 'lucide-react'

interface HeaderProps {
  isLoggedIn?: boolean
  userName?: string
}

export default function Header({ isLoggedIn = false, userName }: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await actions.auth.logout()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/">
            <h1 className="text-xl font-bold text-[rgba(25,42,110,1)]">Dominican HCI Club </h1>
          </a>
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
            
            {isLoggedIn ? (
              <>
                <Button className="font-bold bg-[rgba(25,42,110,1)] text-[rgba(255,255,255,1)]" asChild>
                  <a href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    {userName ? `Hola, ${userName.split(' ')[0]}` : 'Mi Perfil'}
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  className="font-bold text-[rgba(25,42,110,1)] bg-[rgba(246,246,246,1)]"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 mr-2" />
                  )}
                  {isLoggingOut ? 'Saliendo...' : 'Cerrar sesión'}
                </Button>
              </>
            ) : (
              <>
                <Button className="font-bold text-[rgba(25,42,110,1)] bg-[rgba(246,246,246,1)]" variant="ghost" asChild>
                  <a href="/login">
                    Ingresa ya{" "}
                  </a>
                </Button>
                <Button className="font-bold bg-[rgba(25,42,110,1)] text-[rgba(255,255,255,1)]" asChild>
                  <a href="/register">
                    {"Únete hoy"}
                  </a>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>
  )
}
