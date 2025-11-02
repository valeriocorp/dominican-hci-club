import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [whatsapp, setWhatsapp] = useState("")
  const [plan, setPlan] = useState("free")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const planParam = params.get("plan")
    if (planParam?.toLowerCase() === "premium") {
      setPlan("premium")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate registration (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      window.location.href = "/confirmation"
    } catch (error) {
      // Handle error when real API calls are introduced
      console.error("Registration error:", error)
      // TODO: Show error message to user
    } finally {
      // Reset loading state on error
      // Note: Won't execute on successful navigation due to window.location.href
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/">
            <h1 className="text-2xl font-bold mb-2 text-[rgba(25,42,110,1)]">Dominican HCI CLub </h1>
          </a>
          <p className="text-muted-foreground">Crea tu cuenta y comienza a aprender</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[rgba(25,42,110,1)]">Registro</CardTitle>
            <CardDescription>Completa el formulario para crear tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="name">
                  * Nombre completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="email">
                  * Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="whatsapp">
                  * WhatsApp
                </Label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-10 w-[90px] rounded-md border border-input bg-white px-2 py-2 text-sm appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.5rem center",
                    }}
                  >
                    <option value="+1">🇩🇴 +1</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+51">🇵🇪 +51</option>
                    <option value="+58">🇻🇪 +58</option>
                    <option value="+507">🇵🇦 +507</option>
                    <option value="+506">🇨🇷 +506</option>
                  </select>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="8091234567"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                    required
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="password">
                  * Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-[rgba(25,42,110,1)]">Selecciona tu plan</Label>
                <RadioGroup value={plan} onValueChange={setPlan}>
                  <div className="flex items-center space-x-2 border border-input rounded-lg p-4">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#192a6e]">Gratuito</div>
                      <div className="text-sm text-muted-foreground">$0/mes - Acceso básico</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-input rounded-lg p-4">
                    <RadioGroupItem value="premium" id="premium" />
                    <Label htmlFor="premium" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#192a6e]">Premium</div>
                      <div className="text-sm text-muted-foreground">$18/mes - Acceso completo</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-[rgba(25,42,110,1)]" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-center">
              ¿Ya tienes una cuenta?{" "}
              <a href="/login" className="hover:underline font-medium text-[rgba(25,42,110,1)]">
                Inicia sesión aquí
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

