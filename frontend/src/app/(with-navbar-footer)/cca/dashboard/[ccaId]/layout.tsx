"use client"

import BackButton from "@/components/BackButton"

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