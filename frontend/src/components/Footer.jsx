import "../stylesheets/footer.css"

export default function Footer() {
    return (
        <>
            <nav className="footer">
                <div className="links">
                    <ul className="first-column">
                        <li>
                            <a href="/about">About Us</a>
                        </li>
                        <li>
                            <a href="/contact">Contact</a>
                        </li>
                    </ul>
                    <ul className="second-column">
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/register">Register</a>
                        </li>
                        <li>
                            <a href="/login">Login</a>
                        </li>
                    </ul>
                </div>
                <p>2025 SportSync. All rights reserved.</p>
            </nav>
        </>
    )
}