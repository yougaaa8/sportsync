import "../stylesheets/footer.css"
import { Box, Container, Typography, Link as MuiLink, Stack } from "@mui/material";
import SportSyncLogo from "../assets/sportsync-logo.png";
import { Link } from "react-router-dom";

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
                    <img src={SportSyncLogo} alt="SportSync" style={{ height: 28 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        2025 SportSync. All rights reserved.
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={3} sx={{ mt: { xs: 2, md: 0 } }}>
                    <MuiLink component={Link} to="/" underline="none" sx={footerLinkStyle}>
                        Home
                    </MuiLink>
                    <MuiLink component={Link} to="/about" underline="none" sx={footerLinkStyle}>
                        About Us
                    </MuiLink>
                    <MuiLink component={Link} to="/contact" underline="none" sx={footerLinkStyle}>
                        Contact
                    </MuiLink>
                    <MuiLink component={Link} to="/login" underline="none" sx={footerLinkStyle}>
                        Login
                    </MuiLink>
                    <MuiLink component={Link} to="/register" underline="none" sx={footerLinkStyle}>
                        Register
                    </MuiLink>
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