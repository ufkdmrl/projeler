"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Auth0Callback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const error = searchParams.get("error")

        if (error) {
          console.error("Auth0 callback error:", error)
          router.push("/?error=auth_failed")
          return
        }

        if (code) {
          // Exchange code for tokens
          const response = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              grant_type: "authorization_code",
              client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
              client_secret: process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET,
              code: code,
              redirect_uri: `${window.location.origin}/callback`,
            }),
          })

          const tokenData = await response.json()

          if (tokenData.access_token) {
            // Get user profile
            const userResponse = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, {
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
              },
            })

            const userData = await userResponse.json()

            // Determine role for Google users
            const role = userData.email?.includes("admin") ? "both" : "both" // Default to both for Google users

            const user = {
              sub: userData.sub,
              email: userData.email,
              name: userData.name || userData.email,
              picture: userData.picture,
              role: role,
              token: tokenData.access_token,
            }

            // Store tokens and user data
            localStorage.setItem("auth0_token", tokenData.access_token)
            localStorage.setItem("auth0_user", JSON.stringify(user))

            router.push("/dashboard")
          } else {
            throw new Error("No access token received")
          }
        } else {
          throw new Error("No authorization code received")
        }
      } catch (error) {
        console.error("Auth0 callback error:", error)
        router.push("/?error=auth_failed")
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Giriş işlemi tamamlanıyor...</p>
      </div>
    </div>
  )
}
