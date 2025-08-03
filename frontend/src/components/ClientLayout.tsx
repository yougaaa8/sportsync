"use client"

import Navbar from "./Navbar"
import Footer from "./Footer"
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme/index"
import { CssBaseline } from "@mui/material";
import { isTokenValid } from "@/api-calls/login/isTokenValid";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ClientLayout({children, withNavbarAndFooter}: {
    children: React.ReactNode, 
    withNavbarAndFooter: boolean
}) {

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="min-h-screen flex flex-col">
                    {withNavbarAndFooter && <Navbar />}
                    <div className="flex-1">
                        {children}
                    </div>
                    {withNavbarAndFooter && <Footer />}
                </div>
            </ThemeProvider>
        </>
    );
}