"use client"

import ClientLayout from "../../components/ClientLayout"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isTokenValid } from "@/api-calls/login/isTokenValid"

export default function WithNavbarAndFooterLayout({children}: {
    children: React.ReactNode
}) {
    // Set states
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true) // Add loading state
    const [isLoggedIn, setIsLoggedIn] = useState<string | null>(null)

    // Set static values
    const router = useRouter()

    // Get the token from local storage
    useEffect(() => {
        const fetchToken = async () => {
            if (typeof window !== "undefined") {
                const tempToken = localStorage.getItem("authToken")
                const loggedInStatus = localStorage.getItem("isLoggedIn")
                
                setToken(tempToken)
                setIsLoggedIn(loggedInStatus)
                setIsLoading(false) // Token fetch is complete
            }
        }
        fetchToken()
    }, [])

    // Check token validity after token is fetched
    useEffect(() => {
        if (!isLoading) { // Only run after token fetch is complete
            // If user never logged in (no isLoggedIn flag), redirect to login
            if (!isLoggedIn || isLoggedIn !== "true") {
                router.push("/login")
                return
            }

            // If user was logged in but token is missing or invalid, redirect to login
            if (!token || !isTokenValid(token)) {
                // Clear invalid/expired tokens
                localStorage.removeItem("authToken")
                localStorage.removeItem("refreshToken")
                localStorage.removeItem("isLoggedIn")
                // Clear other user data as well
                localStorage.removeItem("email")
                localStorage.removeItem("userId")
                localStorage.removeItem("fullName")
                localStorage.removeItem("profilePicture")
                localStorage.removeItem("role")
                localStorage.removeItem("userProfile")
                localStorage.removeItem("ccaIds")
                
                router.push("/login")
            }
        }
    }, [token, isLoading, isLoggedIn, router])

    // Show loading or nothing while checking authentication
    if (isLoading) {
        return <div>Loading...</div> // Or your loading component
    }

    // Only render children if user is authenticated
    if (isLoggedIn === "true" && token && isTokenValid(token)) {
        return (
            <ClientLayout withNavbarAndFooter={true}>
                {children}
            </ClientLayout>
        )
    }

    // Return null while redirecting
    return null
}