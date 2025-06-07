import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/home.css"
import { useLocation } from "react-router-dom"

export default function Home() {
    const location = useLocation();
    const newUser = location.state?.username || location.state?.email
                    || "User";

    return (
        <>
            <main>
                <Navbar />
                <h1>Welcome to SportSync, {newUser}!</h1>
                <Footer />
            </main>
        </>
    )
}