import { Button } from "@/components/ui/button"

export default function ButtonsConfirmCard() {
  const handleAccessCommunity = () => {
    // Abrir WhatsApp en nueva pestaña
    window.open('https://chat.whatsapp.com/H9efJ2wyGACEdurOVLbOpD', '_blank', 'noopener,noreferrer')
    // Redirigir al home
    window.location.href = '/'
  }

  return (
    <div>
      <Button 
        className="w-full bg-[rgba(25,42,110,1)]"
        onClick={handleAccessCommunity}
      >
        Accede a la comunidad
      </Button>
    </div>
  )
}
