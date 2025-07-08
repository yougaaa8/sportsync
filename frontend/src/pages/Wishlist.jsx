import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import pullWishlist from "../api-calls/pullWishlist.js"
import { useState, useEffect } from "react"
import WishlistItem from "../components/WishlistItem.jsx"
import { 
    Container, 
    Typography, 
    Box, 
    Grid, 
    CircularProgress, 
    Alert,
    Fade,
    Button
} from "@mui/material"
import { FavoriteOutlined, ShoppingBag } from "@mui/icons-material"
import clearWishlist from "../api-calls/clearWishlist.js"

export default function Wishlist() {
    const [wishlist, setWishlist] = useState(null)
    const [loading, setLoading] = useState(true)

    // Get the wishlist data from API call
    useEffect(() => {
        pullWishlist()
            .then(setWishlist)
            .finally(() => setLoading(false))
    }, [])

    console.log("Successfully retrieved wishlist: ", wishlist)

    // Map the wishlist items into JSX components
    const wishlistItems = wishlist?.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={item.product.id || index}>
            <Fade in timeout={300 + index * 100}>
                <Box>
                    <WishlistItem entry={item.product}/>
                </Box>
            </Fade>
        </Grid>
    ))

    // 

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Page Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <FavoriteOutlined sx={{ fontSize: 40, color: '#f4a261', mr: 1 }} />
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            sx={{ 
                                color: '#f4a261',
                                fontWeight: 600,
                                fontSize: { xs: '2rem', md: '3rem' }
                            }}
                        >
                            My Wishlist
                        </Typography>
                    </Box>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: 'text.secondary',
                            maxWidth: 600,
                            mx: 'auto'
                        }}
                    >
                        Your favorite NUS merchandise, saved for later
                    </Typography>
                </Box>

                {/* Loading State */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={50} sx={{ color: '#6fa8dc' }} />
                    </Box>
                )}

                {/* Empty Wishlist State */}
                {!loading && (!wishlist || wishlist.length === 0) && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <ShoppingBag sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
                            Your wishlist is empty
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Start adding items to your wishlist to save them for later!
                        </Typography>
                    </Box>
                )}

                {/* Wishlist Items */}
                {!loading && wishlist && wishlist.length > 0 && (
                    <>
                        <Box sx={{ mb: 3 }}>
                            <Alert 
                                severity="info" 
                                sx={{ 
                                    backgroundColor: '#e3f2fd',
                                    color: '#1976d2',
                                    '& .MuiAlert-icon': { color: '#1976d2' }
                                }}
                            >
                                You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
                            </Alert>
                        </Box>

                        <Button onClick={() => {
                            clearWishlist(localStorage.getItem("userId"))
                            window.location.reload()}}>
                            Clear wishlist
                        </Button>
                        
                        <Grid container spacing={3}>
                            {wishlistItems}
                        </Grid>
                    </>
                )}
            </Container>
            <Footer />
        </>
    )
}