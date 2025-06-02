import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { useState } from "react"
import "../stylesheets/login.css"

export default function Login() {
    // Create state for username and password
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")


    // Create a function that will run when form is submitted
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                console.log("Login successful:", data);
                
                // Store token if provided
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                
                // Redirect to dashboard or home page
                window.location.href = '/profile'; // or use React Router navigation
                
            } else {
                // Login failed
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
    
    // Rendered webpage
    return (
        <>
            <div className="login-page">
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
                <div>
                    <p>Don't have an account?</p>
                    <a className="register-link" href="/register">Register now</a>
                </div>
                <Footer />
            </div>
        </>
    )
}
