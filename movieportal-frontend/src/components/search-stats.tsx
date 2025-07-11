import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"

interface SearchStatsProps {
  type: "movies" | "actors"
  isSearching: boolean
  searchTerm: string
  currentPage: number
  totalPages: number
}

export default function SearchStats({ type, isSearching, searchTerm, currentPage, totalPages }: SearchStatsProps) {
  const contentType = type === "movies" ? "film" : "oyuncu"
  const contentTypePlural = type === "movies" ? "filmler" : "oyuncular"

  if (isSearching) {
    return (
      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <span className="text-sm text-blue-800">
          <strong>"{searchTerm}"</strong> için arama sonuçları - Sayfa {currentPage} / {totalPages}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
      <Info className="h-4 w-4 text-green-600" />
      <span className="text-sm text-green-800">
        En popüler 100 {contentType} gösteriliyor. Daha fazla {contentType} için{" "}
        <Badge variant="outline" className="mx-1">
          arama
        </Badge>{" "}
        yapabilirsiniz.
      </span>
    </div>
  )
}
