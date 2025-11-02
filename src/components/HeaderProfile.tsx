import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function HeaderProfile() {
  return (
    <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold" style={{ color: 'rgba(25,42,110,1)' }}>
          Dominican HCI Club
          </a>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            asChild
          >
            <a href="/">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </a>
          </Button>
        </div>
      </header>
  )
}