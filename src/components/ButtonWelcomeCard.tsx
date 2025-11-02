import { Button } from "@/components/ui/button"


export default function ButtonWelcomeCard() {
  return (
    <div>
       <Button asChild className="w-full max-w-xs bg-[#192a6e] hover:bg-[#192a6e]/90 text-lg py-6">
            <a href="/">Allí estaré 🚀 </a>
          </Button>
    </div>
  )
}