import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import SearchIcon from "../assets/search-icon.png"
import FilterIcon from "../assets/sort-icon.png"
import Archery from "../assets/Archery image.png"
import Baseball from "../assets/baseball image.webp"
import Cricket from "../assets/cricket image.webp"
import "../stylesheets/cca-home.css"
import { Link } from "react-router-dom"

export default function CCAHome() {
    return (
        <>
            <Navbar />
            <main className="cca-home">
                <div className="cca-home-search-row">
                    <p className="cca-home-displaying-text">Displaying 8 out of 8 results</p>
                    <div className="cca-home-search-bar">
                        <form className="cca-home-search-bar-form">
                            <input placeholder="Enter a CCA here" />
                        </form>
                        <img className="cca-home-search-icon-image" src={ SearchIcon }></img>
                        <img className="cca-home-search-icon-image" src={ FilterIcon }></img>
                    </div>
                </div>
                <div className="cca-home-cca-row">
                    <Link className="cca-home-individual-cca"
                          to="/archery"
                          style={{ textDecoration: "none" }}>
                        <img className="cca-home-cca-pictures" src={ Archery }></img>
                        <h1 className="cca-home-cca-titles">Archery</h1>
                        <p className="cca-home-cca-description">Hone precision, build strength, compete fiercely, and bond with fellow archers in a supportive, vibrant club environment.</p>
                    </Link>
                    <div className="cca-home-individual-cca">
                        <img className="cca-home-cca-pictures" src={ Baseball }></img>
                        <h1 className="cca-home-cca-titles">Baseball</h1>
                        <p className="cca-home-cca-description">Train with dedicated coaches, sharpen skills, compete intervarsity, and forge lifelong friendships on the diamond, building community.</p>
                    </div>
                    <div className="cca-home-individual-cca">
                        <img className="cca-home-cca-pictures" src={ Cricket }></img>
                        <h1 className="cca-home-cca-titles">Cricket</h1>
                        <p className="cca-home-cca-description">Train with dedicated coaches, sharpen skills, compete intervarsity, and forge lifelong friendships on the diamond, building community.</p>
                    </div>
                    <Link className="cca-home-individual-cca"
                          to="/archery"
                          style={{ textDecoration: "none" }}>
                        <img className="cca-home-cca-pictures" src={ Archery }></img>
                        <h1 className="cca-home-cca-titles">Archery</h1>
                        <p className="cca-home-cca-description">Hone precision, build strength, compete fiercely, and bond with fellow archers in a supportive, vibrant club environment.</p>
                    </Link>
                    <div className="cca-home-individual-cca">
                        <img className="cca-home-cca-pictures" src={ Baseball }></img>
                        <h1 className="cca-home-cca-titles">Baseball</h1>
                        <p className="cca-home-cca-description">Train with dedicated coaches, sharpen skills, compete intervarsity, and forge lifelong friendships on the diamond, building community.</p>
                    </div>
                    <div className="cca-home-individual-cca">
                        <img className="cca-home-cca-pictures" src={ Cricket }></img>
                        <h1 className="cca-home-cca-titles">Cricket</h1>
                        <p className="cca-home-cca-description">Train with dedicated coaches, sharpen skills, compete intervarsity, and forge lifelong friendships on the diamond, building community.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}