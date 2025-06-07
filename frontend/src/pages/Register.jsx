import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { useState } from "react"
import "../stylesheets/login.css"
import { useNavigate } from "react-router-dom"

export default function Register() {
    // Create state for username and password
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Grab the navigate function
    const navigate = useNavigate();

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
            const response = await fetch('http://localhost:8000/api/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    password_confirm: confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful
                console.log("Registration successful:", data);
                setSuccess("Account created successfully! You can now log in.");
                
                // Redirect to home page after successful registration
                navigate("/", {
                    state: { username: username }
                });
                
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
                <div className="email-field">
                    <label htmlFor="username">Email</label>
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
                        type="text"
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
