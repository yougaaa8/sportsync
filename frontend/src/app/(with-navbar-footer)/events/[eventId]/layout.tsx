import BackButton from "@/components/BackButton"
import React from "react"

export default function EventDetailLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <>
            <BackButton />
            {children}
        </>
    )
}