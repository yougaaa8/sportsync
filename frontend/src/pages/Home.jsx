import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/home.css"

export default function Home() {
    return (
        <>
            <main>
                <Navbar />
                <h1>Welcome to SportSync, User!</h1>
                <Footer />
            </main>
        </>
    )
}