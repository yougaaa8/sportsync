"use client"

import BackButton from "@/components/BackButton"
import { useRouter } from "next/navigation"

export default function CCADashboardLayout({ children }: {
    children: React.ReactNode
}) {
    
    return (
        <>
            <BackButton />
            {children}
        </>
    )
}