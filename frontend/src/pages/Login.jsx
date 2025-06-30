import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { useState } from "react"
import "../stylesheets/login.css"
import { useNavigate } from "react-router-dom"

export default function Login() {
    // Create state for username and password
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate();

    // Create a function that will run when form is submitted
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch('https://sportsync-backend-8gbr.onrender.com/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                console.log("Login successful:", data);
                
                // Store token and username if provided  
                if (data.tokens && data.tokens.access) {
                    localStorage.setItem("authToken", data.tokens.access);
                    localStorage.setItem("refreshToken", data.tokens.refresh);
                    localStorage.setItem("email", data.user.email);
                    localStorage.setItem("userId", data.user.id)
                }

                const loggedInUsername = data.user.username;

                // Redirect to dashboard or home page
                navigate("/", {
                    state: {username: loggedInUsername}
                });
                
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
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="password-field">
                        <label htmlFor="password">Password</label>
                        <input id="password"
                            type="password"
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
