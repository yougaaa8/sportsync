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
                {withNavbarAndFooter && <Navbar />}
                {children}
                {withNavbarAndFooter && <Footer />}
            </ThemeProvider>
        </>
    );
}