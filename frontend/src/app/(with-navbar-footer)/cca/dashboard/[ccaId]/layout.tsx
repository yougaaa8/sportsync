"use client"

import { Button } from "@mui/material"
import { useRouter } from "next/navigation"

export default function CCADashboardLayout({ children }: {
    children: React.ReactNode
}) {
    // Set static values
    const router = useRouter()

    // Define functions 
    function backClick() {
        router.back()
    }
    return (
        <>
            <Button onClick={backClick}>Back</Button>
            {children}
        </>
    )
}