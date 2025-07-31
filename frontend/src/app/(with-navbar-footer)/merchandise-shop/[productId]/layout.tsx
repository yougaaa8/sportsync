import BackButton from "@/components/BackButton"
import React from "react"

export default function ProductDetailLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <>
            <BackButton />
            {children}
        </>
    )
}