import "../stylesheets/footer.css"
import { Box, Container, Typography, Link as MuiLink, Stack } from "@mui/material";
import SportSyncLogo from "../assets/sportsync-logo.png";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                position: "relative",
                bottom: 0,
                marginTop: "auto",
                borderTop: "1px solid #e5e7eb",
                bgcolor: "#fff",
                py: 2,
                mt: 0,
                boxShadow: "0 -2px 8px 0 rgba(245, 158, 11, 0.03)",
            }}
        >
            <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Image 
                        src={SportSyncLogo} 
                        alt="SportSync" 
                        width={28} 
                        height={28}
                        style={{ objectFit: 'contain' }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        2025 SportSync. All rights reserved.
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={3} sx={{ mt: { xs: 2, md: 0 } }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Typography sx={footerLinkStyle}>
                            Home
                        </Typography>
                    </Link>
                    <Link href="/about" style={{ textDecoration: 'none' }}>
                        <Typography sx={footerLinkStyle}>
                            About Us
                        </Typography>
                    </Link>
                    <Link href="/contact" style={{ textDecoration: 'none' }}>
                        <Typography sx={footerLinkStyle}>
                            Contact
                        </Typography>
                    </Link>
                    <Link href="/login" style={{ textDecoration: 'none' }}>
                        <Typography sx={footerLinkStyle}>
                            Login
                        </Typography>
                    </Link>
                    <Link href="/register" style={{ textDecoration: 'none' }}>
                        <Typography sx={footerLinkStyle}>
                            Register
                        </Typography>
                    </Link>
                </Stack>
            </Container>
        </Box>
    );
}

const footerLinkStyle = {
    color: "#f59e0b",
    fontWeight: 500,
    fontSize: "1rem",
    letterSpacing: 0.2,
    transition: "color 0.18s",
    "&:hover": {
        color: "#d97706",
        textDecoration: "underline",
    },
};