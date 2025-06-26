import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { useState } from "react"
import "../stylesheets/login.css"
import "../stylesheets/register.css"
import { useNavigate } from "react-router-dom"

export default function Register() {
    // Create state for username and password
    const [first_name, setFirstName] = useState();
    const [last_name, setLastName] = useState();
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
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    password: password,
                    password_confirm: confirmPassword,
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful
                console.log("Registration successful:", data);
                console.log("The account is created for: ", data.user.first_name);
                setSuccess("Account created successfully! You can now log in.");
                
                localStorage.setItem("email", data.user.email);
                
                // Redirect to home page after successful registration
                navigate("/login", {
                    state: { email: email }
                });
                
                // Clear form
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                
            } else {
                // Registration failed — log the full validation payload
                console.warn("Registration validation errors:", data);
                // Turn those field errors into a single string to show the user
                const msg = Object.entries(data)
                    .map(([field, errs]) => `${field}: ${errs.join(" ")}`)
                    .join("\n");
                setError(msg || "Registration failed. Please try again.");
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
            <main className="register-body">
                <h1 className="register-message">
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
                    <div className="first-name-field">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            required
                        />
                    </div>
                    <div className="last-name-field">
                        <label htmlFor="lastName">Last Name</label>
                        <input 
                            id="lastName"
                            type="text"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
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
            </main>
            <Footer />
        </>
    )
}
