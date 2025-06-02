import { useState, useRef, useEffect } from "react";
import SoccerBall from "../assets/soccer-ball.png"
import "../stylesheets/navbar.css"

export default function Navbar() {

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
                                    <a className="dropdown-link" href="/logout">Logout</a>
                                </li>
                            </ul>)}
                    </div>
                </nav>
            </header>
        </>
    )
}

