"use client"

import ClientLayout from "../../components/ClientLayout"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WithoutNavbarAndFooterLayout({children}: {
    children: React.ReactNode
}) {
    const router = useRouter()

    useEffect(() => {
        console.log('localStorage.getItem("isLoggedIn") is: ', localStorage.getItem("isLoggedIn"))
        if (localStorage.getItem("isLoggedIn") !== "true") {
            router.push("/login")
        }
    }, [router])

    return (
        <ClientLayout withNavbarAndFooter={true}>
            {children}
        </ClientLayout>
    )
}