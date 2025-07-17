import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { useState } from "react"
import "../stylesheets/login.css"
import { useNavigate } from "react-router-dom"
import pullCCAMembersList from "../api-calls/pullCCAMembersList.js"
import pullUserProfileFromEmail from "../api-calls/pullUserProfileFromEmail.js"
import login from "../api-calls/login.js"

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
            const response = await login(email, password)

            if (response) {
                // Login successful
                const data = response
                console.log("Login successful:", data);
                
                // Store token and username if provided  
                if (data.tokens && data.tokens.access) {
                    localStorage.setItem("authToken", data.tokens.access);
                    localStorage.setItem("refreshToken", data.tokens.refresh);
                    localStorage.setItem("email", data.user.email);
                    localStorage.setItem("userId", data.user.id)
                    localStorage.setItem("fullName", data.user.full_name);
                }

                const loggedInUsername = data.user.username;

                // // Get the cca id from the user id
                // // 1. Pull the list of CCA members
                // const ccaMembersList = pullCCAMembersList();
                // console.log("This is the CCA Members List: ", ccaMembersList)
                // // 2. Search through the list of CCAs for the user id
                // // 3. If found, input that CCA id into local storage
                // ccaMembersList.forEach(ccaMember => {
                //     if (ccaMember.id === localStorage.getItem("userId")) {
                //         localStorage.setItem("ccaId", ccaMember.cca)
                //     }
                // });

                // Get the cca id list from the user's email
                const userProfile = await pullUserProfileFromEmail(localStorage.getItem("email"))
                localStorage.setItem("userProfile", userProfile)
                console.log("The user profile is: ", localStorage.getItem("userProfile"))
                localStorage.setItem("ccaIds", JSON.stringify(userProfile.cca_ids))
                console.log("This is the ccaids: ", localStorage.getItem("ccaIds"))

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

    // Then in the navbar link for the CCA dashboard, it will use the localStorage's
    // ccaId to navigate to the CCA dashboard page with that id

    
    // Rendered webpage
    return (
        <>
            <div className="login-page">
                <Navbar />
                <h1 className="page-title">Sign into SportSync</h1>
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
                    <button className="login-button" type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
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
