import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SoccerBall from "../assets/soccer-ball.png"
import SportSyncLogo from "../assets/sportsync-logo.png"
import "../stylesheets/navbar.css"
import { Box } from "@mui/material"

export default function Navbar() {

    const navigate = useNavigate();
    // state to control menu open/close
    const [isOpen, setIsOpen] = useState(false);
    // ref to detect clicks outside
    const dropdownRef = useRef(null);

    // close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    async function handleLogout() {
        const refresh = localStorage.getItem("refreshToken");
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("https://sportsync-backend-8gbr.onrender.com//api/auth/logout/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ refresh_token: refresh })
            });
            if (response.ok) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("email");
                navigate("/login");
            }
            else {
                console.error("Logout failed with status: ", response.status);
                console.log("The logged in user is: ", localStorage.getItem("email"));
            }
        }
        catch (err) {
            console.error("Network error during logout:", err);
        }
    }

    return (
        <>
            <Box sx = {{ 
                boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.1)",
                mb: "1.5px"
             }}>
                <header className="navbar-container">
                    <nav className="navbar">
                        <div className="navbar-left">
                            <img className="sportsync-logo" 
                                src={ SportSyncLogo } />
                            <span className="logo-text">
                                SportSync</span>
                        </div>
                        <div className="dropdown" ref={dropdownRef}>
                            <button className="dropdown-trigger"
                                    onClick={() => setIsOpen((prev) => !prev)}>☰</button>
                            {isOpen && (
                                <ul className="dropdown-menu">
                                    <li>
                                        <a className="dropdown-link" href="/">Home</a>
                                    </li>
                                    <li>
                                        <Link className="dropdown-link" to="/cca-home">CCAs</Link>
                                    </li>
                                    <li>
                                        <a className="dropdown-link" href="/profile">Profile</a>
                                    </li>
                                    <li>
                                        <Link className="dropdown-link" to="/available-matches">Matches</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-link" to="/event-list">Events</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-link" to="/tournament">Tournaments</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-link" to="/merchandise-shop">Merchandise</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-link" to="/facility-list">Facilities</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-link" to="/cca-dashboard/">CCA Dashboard</Link>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-link"
                                            onClick={handleLogout}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                padding: 0,
                                                cursor: "pointer",
                                                color: "orange",
                                                font: "inherit",
                                                width: "100%",
                                                textAlign: "left",
                                                transition: "background 0.2s, color 0.2s",
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = '#ffe5b4'}
                                            onMouseOut={e => e.currentTarget.style.background = 'none'}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>)}
                        </div>
                    </nav>
                </header>
            </Box>
        </>
    )
}

