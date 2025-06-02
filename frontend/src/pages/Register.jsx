import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { useState } from "react"
import "../stylesheets/login.css"

export default function Register() {
    // Create state for username and password
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Create a function that will run when form is submitted
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register/', {
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
                // Registration successful
                console.log("Registration successful:", data);
                setSuccess("Account created successfully! You can now log in.");
                
                // Redirect to home page after successful registration
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
                
                // Clear form
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                
            } else {
                // Registration failed
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
    
    // Rendered webpage
    return (
        <>
            <Navbar />
            <h1 className="login-message">
                Create a new username and password
            </h1>
            <form className="login-form" onSubmit={handleSubmit}>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}
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
                <div className="password-field">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                    />
                </div>
                <button 
                    className="login-button" 
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating Account..." : "Register"}
                </button>
            </form>
            <Footer />
        </>
    )
}
