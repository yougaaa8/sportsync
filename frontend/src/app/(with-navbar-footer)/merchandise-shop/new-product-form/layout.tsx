import BackButton from "@/components/BackButton";
import React from "react";

export default function NewProductFormLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <>
            <BackButton />
            {children}
        </>
    )
}