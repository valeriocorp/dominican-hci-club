import { Button } from '@/components/ui/button'

export default function RecuperacionPage() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-7xl md:text-9xl font-bold" style={{ color: '#192a6e' }}>
          404
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
          ¡Hola! Parece que no hay nada por aquí pero no pasa nada, siempre puedes regresar a la página principal 🤍
        </p>
        <Button
          className="px-8 py-6 text-base font-medium"
          style={{ backgroundColor: '#192a6e' }}
          asChild
        >
          <a href="/">
            Volver a la página principal
          </a>
        </Button>
      </div>
    </div>
  )
}

