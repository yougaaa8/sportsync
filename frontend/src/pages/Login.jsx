import Navbar from "../components/Navbar.jsx"
import { useState } from "react"
import "./login.css"

export default function Login() {
    // Create state for username and password
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    // Create a function that will run when form is submitted
    function handleSubmit(e) {
        e.preventDefault();
        console.log("Logging in with: ", { username, password });
    }
    
    // Rendered webpage
    return (
        <>
            <Navbar />
            <h1 className="login-message">
                Please login to continue
            </h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="username-field">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="password-field">
                    <label htmlFor="password">Password</label>
                    <input id="password"
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button className="login-button" type="submit">Login</button>
            </form>
        </>
    )
}
