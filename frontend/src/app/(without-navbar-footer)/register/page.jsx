"use client"

import { useState } from "react"
import { useRouter } from "next/navigation.js"
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
  Divider,
  Link as MuiLink
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  AccountCircle
} from '@mui/icons-material'
import Link from 'next/link.js'
import register from "../../../api-calls/register/register.js"

export default function Register() {
    // Create state for form fields
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Grab the router function
    const router = useRouter();

    // Toggle password visibility
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

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
            const data = await register(email, first_name, last_name, password, confirmPassword)

            if (data) {
                // Registration successful
                console.log("Registration successful:", data);
                console.log("The account is created for: ", data.user.first_name);
                setSuccess("Account created successfully! You can now log in.");
                
                localStorage.setItem("email", data.user.email);
                
                // Redirect to login page after successful registration
                router.push("/login");
                
                // Clear form
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
        <Box 
            sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                display: 'flex',
                alignItems: 'center',
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Paper 
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <AccountCircle 
                            sx={{ 
                                fontSize: 60, 
                                color: 'primary.main', 
                                mb: 2 
                            }} 
                        />
                        <Typography 
                            variant="h4" 
                            component="h1"
                            sx={{ 
                                fontWeight: 700,
                                color: 'text.primary',
                                mb: 1
                            }}
                        >
                            Create Account
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Join SportSync to get started
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                    </Box>

                    {/* Alerts */}
                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ mb: 3, borderRadius: 2 }}
                            onClose={() => setError("")}
                        >
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert 
                            severity="success" 
                            sx={{ mb: 3, borderRadius: 2 }}
                            onClose={() => setSuccess("")}
                        >
                            {success}
                        </Alert>
                    )}

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* First Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>

                            {/* Last Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>

                            {/* Email */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>

                            {/* Password */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>

                            {/* Confirm Password */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowConfirmPassword}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 3 }}
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={isLoading}
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        mb: 2
                                    }}
                                >
                                    {isLoading ? "Creating Account..." : "Create Account"}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Footer */}
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Link href="/login" passHref>
                                <MuiLink 
                                    component="span"
                                    sx={{ 
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Sign In
                                </MuiLink>
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}