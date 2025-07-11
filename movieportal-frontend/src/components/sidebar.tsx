"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Film, Users, PlusCircle, LogOut, Menu, X, User, Home } from "lucide-react"

export default function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { href: "/dashboard", label: "Ana Sayfa", icon: Home, color: "text-blue-600" },
    ...(user?.role === "movies" || user?.role === "both"
      ? [
          { href: "/dashboard/movies", label: "Popüler Filmler", icon: Film, color: "text-red-600" },
          { href: "/dashboard/suggest", label: "Film Öner", icon: PlusCircle, color: "text-green-600" },
        ]
      : []),
    ...(user?.role === "actors" || user?.role === "both"
      ? [{ href: "/dashboard/actors", label: "Popüler Oyuncular", icon: Users, color: "text-purple-600" }]
      : []),
    { href: "/dashboard/profile", label: "Profil", icon: User, color: "text-gray-600" },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 gradient-cinema rounded-2xl flex items-center justify-center shadow-glow animate-float">
            <Film className="h-6 w-6 text-white icon-glow" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gradient-cinema flex items-center gap-2 text-shadow">
              Movie Portalı
            </h2>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-4 border border-white/30 hover-glow">
          <div className="flex items-center gap-3">
            {user?.picture && (
              <img
                src={user.picture || "/placeholder.svg?height=40&width=40"}
                alt="Profile"
                className="w-12 h-12 rounded-full ring-2 ring-white shadow-elegant hover-scale"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate text-shadow">{user?.name}</p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-3 custom-scrollbar overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-14 rounded-2xl transition-all duration-300 animate-fadeIn ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 via-purple-600 to-blue-700 text-white shadow-glow hover:shadow-glow-lg animate-pulse-glow"
                    : "hover:bg-white/80 text-gray-700 hover:text-gray-900 hover-lift glass"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className={`mr-4 h-5 w-5 ${isActive ? "text-white icon-glow" : `${item.color} icon-glow`}`} />
                <span className="font-semibold text-shadow">{item.label}</span>
                {isActive && (
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-white/70 rounded-full animate-bounce"></div>
                  </div>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <Button
          variant="outline"
          className="w-full justify-start h-14 rounded-2xl border-red-200/50 text-red-600 hover:bg-red-50/80 hover:border-red-300 transition-all duration-300 bg-transparent glass hover-lift"
          onClick={logout}
        >
          <LogOut className="mr-4 h-5 w-5 icon-glow" />
          <span className="font-semibold text-shadow">Çıkış Yap</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden glass-strong border-white/30 text-white hover:bg-white/20 bg-transparent rounded-2xl w-12 h-12 shadow-glow"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6 icon-glow" /> : <Menu className="h-6 w-6 icon-glow" />}
      </Button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-80 bg-white/90 backdrop-blur-xl border-r border-white/30 flex-col shadow-elegant movie-portal-bg">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed left-0 top-0 w-80 h-full bg-white/95 backdrop-blur-xl border-r border-white/30 flex flex-col shadow-elegant animate-slideIn movie-portal-bg">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
