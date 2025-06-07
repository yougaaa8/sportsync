import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SoccerBall from "../assets/soccer-ball.png"
import "../stylesheets/navbar.css"

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
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://localhost:8000/api/auth/logout/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            if (response.ok) {
                localStorage.removeItem("authToken");
                navigate("/login");
            }
            else {
                console.error("Logout failed with status: ", response.status);
            }
        }
        catch (err) {
            console.error("Network error during logout:", err);
        }
    }

    return (
        <>
            <header>
                <nav>
                    <div className="navbar-left">
                        <img className="sportsync-logo" 
                            src={ SoccerBall } />
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
                                    <a className="dropdown-link" href="/profile">Profile</a>
                                </li>
                                <li>
                                    <a className="dropdown-link" href="/login">Logout</a>
                                    {/* <button
                                    className="dropdown-link"
                                    onClick={handleLogout}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                        color: "inherit",
                                        font: "inherit",
                                    }}
                                    >
                                      Logout
                                    </button> */}
                                </li>
                            </ul>)}
                    </div>
                </nav>
            </header>
        </>
    )
}

