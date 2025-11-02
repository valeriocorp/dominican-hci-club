import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate login (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      window.location.href = "/profile"
    } catch (error) {
      // Handle error when real API calls are introduced
      console.error("Login error:", error)
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
            <h1 className="text-2xl font-bold mb-2 text-[rgba(25,42,110,1)]">Dominican HCI Club </h1>
          </a>
          <p className="text-muted-foreground">Bienvenido/a de vuelta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[rgba(25,42,110,1)]">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="email">Correo Electrónico</Label>
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
                <Label className="text-[rgba(25,42,110,1)]" htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[rgba(25,42,110,1)]" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-center">
              ¿No tienes una cuenta?{" "}
              <a href="/register" className="hover:underline text-[rgba(25,42,110,1)] font-medium">
                Regístrate aquí
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

