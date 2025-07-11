"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { auth0Api } from "@/lib/api"
import { Settings } from "lucide-react"

export default function RoleManagement() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [currentRole, setCurrentRole] = useState<string>(user?.role || "both")

  const roleDescriptions = {
    movies: "Movie Portalı'nda sadece film listelerini görüntüleyebilir ve değerlendirebilir",
    actors: "Movie Portalı'nda sadece oyuncu listelerini görüntüleyebilir",
    both: "Movie Portalı'nda tüm film ve oyuncu listelerini görüntüleyebilir",
  }

  const handleRoleChange = async (newRole: string) => {
    if (!user) return

    setLoading(true)
    try {
      // Update user metadata in Auth0
      await auth0Api.updateUserMetadata(user.sub, {
        "https://movieapp.com/role": newRole,
      })

      // Update local storage
      const updatedUser = { ...user, role: newRole as any }
      localStorage.setItem("auth0_user", JSON.stringify(updatedUser))

      setCurrentRole(newRole)

      // Refresh page to apply role changes
      window.location.reload()
    } catch (error) {
      console.error("Error updating role:", error)
      alert("Rol güncellenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Movie Portalı Rol Yönetimi
        </CardTitle>
        <CardDescription>Movie Portalı'nda hangi bölümlere erişim sağlayacağınızı belirleyin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1">Mevcut Movie Portalı Rolü:</p>
          <Badge variant="outline" className="mb-4">
            {currentRole === "movies" ? "Filmler" : currentRole === "actors" ? "Oyuncular" : "Filmler ve Oyuncular"}
          </Badge>
          <p className="text-sm text-gray-600">{roleDescriptions[currentRole as keyof typeof roleDescriptions]}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-1">Movie Portalı Rol Değiştir:</p>
          <Select value={currentRole} onValueChange={handleRoleChange} disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="movies">Sadece Filmler</SelectItem>
              <SelectItem value="actors">Sadece Oyuncular</SelectItem>
              <SelectItem value="both">Filmler ve Oyuncular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading && (
          <p className="text-sm text-blue-600 flex items-center gap-1">Movie Portalı rolü güncelleniyor...</p>
        )}
      </CardContent>
    </Card>
  )
}
