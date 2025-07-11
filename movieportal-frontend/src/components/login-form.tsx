"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Mail, AlertCircle, Info, Chrome, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(username, password)
    } catch (err: any) {
      console.error("Login form error:", err)
      setError(err.message || "Giriş yapılırken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)

      // Check if Auth0 is configured
      if (!process.env.NEXT_PUBLIC_AUTH0_DOMAIN || !process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID) {
        // Demo Google login for development
        const mockGoogleUser: any = {
          sub: `google-oauth2|${Date.now()}`,
          email: "google.user@gmail.com",
          name: "Google User",
          picture: "https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff",
          role: "both",
          token: `mock_google_token_${Date.now()}`,
        }

        localStorage.setItem("auth0_token", mockGoogleUser.token)
        localStorage.setItem("auth0_user", JSON.stringify(mockGoogleUser))

        // Simulate the login context update
        await login(mockGoogleUser.email, "google_auth")
        return
      }

      // Real Auth0 Google login
      const authUrl =
        `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/authorize?` +
        `response_type=code&` +
        `client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(window.location.origin + "/callback")}&` +
        `scope=openid profile email&` +
        `connection=google-oauth2`

      window.location.href = authUrl
    } catch (error) {
      console.error("Google login error:", error)
      setError("Google ile giriş yapılırken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleTestLogin = (testEmail: string) => {
    setUsername(testEmail)
    setPassword("test123")
  }

  return (
    <Card className="card-premium border-white/20 shadow-elegant animate-scaleIn">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold text-gray-800 text-shadow">Hoş Geldiniz</CardTitle>
        <CardDescription className="text-gray-600 text-base">
          Hesabınıza giriş yapın veya Google ile devam edin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email Adresi
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 icon-glow" />
              <Input
                id="email"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="email@example.com"
                className="input-elegant pl-12 h-14 text-base"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Şifre
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 icon-glow" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Şifrenizi girin"
                className="input-elegant pl-12 pr-12 h-14 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover-scale"
              >
                {showPassword ? <EyeOff className="h-5 w-5 icon-glow" /> : <Eye className="h-5 w-5 icon-glow" />}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="animate-slideIn glass border-red-200">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-14 btn-elegant text-white font-semibold rounded-2xl text-base"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Giriş yapılıyor...
              </div>
            ) : (
              "Giriş Yap"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-white px-4 text-gray-500 font-semibold">Veya</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-14 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-2xl transition-all duration-300 hover:shadow-elegant text-base font-semibold"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <Chrome className="mr-3 h-6 w-6 text-blue-600 icon-glow" />
          <span className="text-gray-700">Google ile Giriş Yap</span>
        </Button>

        <div className="glass-strong rounded-2xl p-5 border border-blue-200/50">
          <div className="flex items-center gap-3 mb-4">
            <Info className="h-5 w-5 text-blue-600 icon-glow" />
            <p className="text-base font-semibold text-blue-800">Demo Hesapları</p>
          </div>
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-left justify-start hover:bg-blue-50/80 rounded-xl p-4 h-auto transition-all duration-300 hover-lift"
              onClick={() => handleTestLogin("movies@test.com")}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-gray-700">movies@test.com</span>
                <span className="text-xs text-blue-600 badge-premium">Sadece Filmler</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-left justify-start hover:bg-purple-50/80 rounded-xl p-4 h-auto transition-all duration-300 hover-lift"
              onClick={() => handleTestLogin("actors@test.com")}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-gray-700">actors@test.com</span>
                <span className="text-xs text-purple-600 badge-modern bg-purple-100">Sadece Oyuncular</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-left justify-start hover:bg-green-50/80 rounded-xl p-4 h-auto transition-all duration-300 hover-lift"
              onClick={() => handleTestLogin("admin@test.com")}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-gray-700">admin@test.com</span>
                <span className="text-xs text-green-600 badge-modern bg-green-100">Tam Erişim</span>
              </div>
            </Button>
          </div>
          <p className="text-xs text-blue-600 mt-4 text-center font-medium">
            🚀 Demo modunda çalışıyor. Gerçek Auth0 için environment variables'ları yapılandırın.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
