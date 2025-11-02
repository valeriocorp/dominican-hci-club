import { Button } from "@/components/ui/button"

export default function ButtonsConfirmCard() {
  return (
    <div>
          <Button asChild className="w-full bg-[rgba(25,42,110,1)] mb-2">
            <a href="/welcome">Explorar contenido</a>
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent text-[rgba(25,42,110,1)]">
            <a href="/profile">Ir a mi perfil</a>
          </Button>
    </div>
  )
}