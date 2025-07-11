"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Globe, DollarSign } from "lucide-react"
import { tmdbService, type TMDBMovie } from "@/lib/tmdb"

interface MovieRatingDialogProps {
  movie: TMDBMovie
  open: boolean
  onClose: () => void
}

export default function MovieRatingDialog({ movie, open, onClose }: MovieRatingDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  // Safe number formatting function
  const safeToFixed = (value: number | undefined | null, decimals = 1): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return "0.0"
    }
    return Number(value).toFixed(decimals)
  }

  // Safe year extraction function
  const getYear = (dateString: string | undefined | null): string => {
    if (!dateString) return "N/A"
    try {
      const year = new Date(dateString).getFullYear()
      return isNaN(year) ? "N/A" : year.toString()
    } catch {
      return "N/A"
    }
  }

  // Safe date formatting function
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("tr-TR")
    } catch {
      return "N/A"
    }
  }

  // Safe number formatting for display
  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return "0"
    }
    return value.toLocaleString()
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Lütfen bir puan verin (1-10)")
      return
    }

    setLoading(true)
    try {
      // API call to save rating and note
      console.log("Saving rating:", { movieId: movie.id, rating, note })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Değerlendirmeniz kaydedildi!")
      onClose()
      setRating(0)
      setNote("")
    } catch (error) {
      console.error("Error saving rating:", error)
      alert("Değerlendirme kaydedilirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{movie.title || "Untitled"}</DialogTitle>
          <DialogDescription>Bu filme puan verin ve notunuzu ekleyin</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <img
              src={tmdbService.getImageUrl(movie.poster_path) || "/placeholder.svg?height=600&width=400"}
              alt={movie.title || "Movie poster"}
              className="w-full rounded-lg max-w-md mx-auto"
            />

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                TMDB: {safeToFixed(movie.vote_average)}/10
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {getYear(movie.release_date)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {(movie.original_language || "N/A").toUpperCase()}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Popülerlik: {safeToFixed(movie.popularity, 0)}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Film Hakkında</h3>
              <p className="text-sm text-gray-600 mb-3">{movie.overview || "Açıklama mevcut değil."}</p>

              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <strong>Orijinal Başlık:</strong> {movie.original_title || "N/A"}
                </p>
                <p>
                  <strong>Çıkış Tarihi:</strong> {formatDate(movie.release_date)}
                </p>
                <p>
                  <strong>Oy Sayısı:</strong> {formatNumber(movie.vote_count)}
                </p>
                <p>
                  <strong>Popülerlik:</strong> {safeToFixed(movie.popularity, 2)}
                </p>
                <p>
                  <strong>Yetişkin İçeriği:</strong> {movie.adult ? "Evet" : "Hayır"}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold">Puanınız (1-10)</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 hover:scale-110 transition-transform"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && <p className="text-sm text-gray-600 mt-1">Seçilen puan: {rating}/10</p>}
            </div>

            <div>
              <Label htmlFor="note" className="text-base font-semibold">
                Notunuz (İsteğe bağlı)
              </Label>
              <Textarea
                id="note"
                placeholder="Film hakkındaki düşüncelerinizi yazın..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? "Kaydediliyor..." : "Değerlendirmeyi Kaydet"}
              </Button>
              <Button variant="outline" onClick={onClose}>
                İptal
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
