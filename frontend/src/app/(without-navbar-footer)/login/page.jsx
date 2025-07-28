"use client"

import { useState } from "react"
import "../../../stylesheets/login/login.css"
import { useRouter } from "next/navigation" 
import pullCCAMembersList from "../../../api-calls/cca/pullCCAMembersList"
import pullUserProfileFromEmail from "../../../api-calls/profile/pullUserProfileFromEmail"
import login from "../../../api-calls/login/login.js"

export default function Login() {
    // Create state for username and password
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter();  

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
                    localStorage.setItem("isLoggedIn", "true")
                }

                // Get the cca id list from the user's email
                const userProfile = await pullUserProfileFromEmail(localStorage.getItem("email"))
                localStorage.setItem("userProfile", userProfile)
                console.log("The user profile is: ", localStorage.getItem("userProfile"))
                localStorage.setItem("ccaIds", JSON.stringify(userProfile.cca_ids))
                console.log("This is the ccaids: ", localStorage.getItem("ccaIds"))

                // Redirect to dashboard or home page
                router.push("/home");  
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
                <h1 className="page-title">Sign into SportSync</h1>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
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
            </div>
        </>
    )
}
