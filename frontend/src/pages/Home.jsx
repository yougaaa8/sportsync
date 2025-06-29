import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/home.css"
import { useLocation } from "react-router-dom"

export default function Home() {
    const newUser = localStorage.getItem("email") || "User";

    return (
        <>
            <main>
                <Navbar />
                <h1 className="page-title">Welcome to SportSync, {newUser}!</h1>
                <Footer />
            </main>
        </>
    )
}