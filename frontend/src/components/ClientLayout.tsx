"use client"

import Navbar from "./Navbar"
import Footer from "./Footer"
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme/index"
import { CssBaseline } from "@mui/material";

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