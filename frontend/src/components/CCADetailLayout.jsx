import ArcheryImage from "../assets/Archery image.png"
import Navbar from "./Navbar.jsx"
import Footer from "./Footer.jsx"
import "../stylesheets/cca-info.css"

export default function CCALayout(props) {
    return (
        <>
            <main>
                <img className="cca-layout-cca-logo" src={props.entry.logo} />
                <h1 className="cca-layout-cca-name">{props.entry.name}</h1>
                <p className="cca-layout-cca-info">{props.entry.description}</p>
                <br />
                <hr />
                <p>Contact Us: {props.entry.contact_email}</p>
            </main>
        </>
    )
}