import "../stylesheets/footer.css"
import SportSyncLogo from "../assets/sportsync-logo.png"
import { Box } from "@mui/material"

export default function Footer() {
    return (
        <>
            <Box sx={{ mt: "20px"}}>
                <nav className="footer">
                    <div className="footer-left">
                        <img className="footer-sportsync-logo" src={ SportSyncLogo }></img>
                        <p>2025 SportSync. All rights reserved.</p>
                    </div>
                    <ul className="links">
                        <li>
                            <a className="footer-links"href="/">Home</a>
                        </li>
                        <li>
                            <a className="footer-links"href="/about">About Us</a>
                        </li>
                        <li>
                            <a className="footer-links"href="/contact">Contact</a>
                        </li>
                        <li>
                            <a className="footer-links"href="/login">Login</a>
                        </li>
                        <li>
                            <a className="footer-links"href="/register">Register</a>
                        </li>
                    </ul>
                </nav>
            </Box>
        </>
    )
}