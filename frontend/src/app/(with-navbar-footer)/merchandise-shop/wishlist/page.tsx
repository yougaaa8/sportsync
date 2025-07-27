"use client"

import pullWishlist from "../../../../api-calls/merchandise-shop/pullWishlist"
import { useState, useEffect } from "react"
import WishlistItem from "../../../../components/merchandise-shop/WishlistItem.jsx"
import { 
    Container, 
    Typography, 
    Box, 
    CircularProgress, 
    Fade,
    Button
} from "@mui/material"
import { FavoriteOutlined, ShoppingBag } from "@mui/icons-material"
import clearWishlist from "../../../../api-calls/merchandise-shop/clearWishlist"
import type { Wishlist } from "../../../../types/MerchandiseShopTypes"

export default function Wishlist() {
    const [wishlist, setWishlist] = useState<Wishlist | null>(null)
    const [loading, setLoading] = useState(true)

    // Get the wishlist data from API call
    useEffect(() => {
        pullWishlist()
            .then(setWishlist)
            .finally(() => setLoading(false))
    }, [])

    console.log("Successfully retrieved wishlist: ", wishlist)

    // Map the wishlist items into JSX components
    const wishlistItems = wishlist?.items.map((item, index) => (
        <Box 
            key={item.product.id || index}
            sx={{ 
                width: { 
                    xs: '100%', 
                    sm: 'calc(50% - 12px)', 
                    md: 'calc(33.333% - 16px)',
                    lg: 'calc(25% - 18px)'
                },
                minWidth: '280px',
                maxWidth: { xs: '400px', sm: 'none' },
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Fade in timeout={300 + index * 100}>
                <Box sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <WishlistItem entry={item.product}/>
                </Box>
            </Fade>
        </Box>
    ))

    return (
        <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: '#FAFAFA',
            pt: 4,
            pb: 8
        }}>
            <Container 
                maxWidth="xl" 
                sx={{ 
                    px: { xs: 2, md: 4 }
                }}
            >
                {/* Page Header */}
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: 6,
                    py: 4
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        mb: 2,
                        gap: 1
                    }}>
                        <FavoriteOutlined sx={{ 
                            fontSize: 32, 
                            color: '#FF6B35'
                        }} />
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            sx={{ 
                                color: '#212121',
                                fontWeight: 700,
                                fontSize: { xs: '1.875rem', md: '2.5rem' },
                                letterSpacing: '-0.025em'
                            }}
                        >
                            My Wishlist
                        </Typography>
                    </Box>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: '#757575',
                            fontSize: '1.125rem',
                            fontWeight: 400,
                            maxWidth: 500,
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        Your favorite NUS merchandise, saved for later
                    </Typography>
                </Box>

                {/* Loading State */}
                {loading && (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        py: 12
                    }}>
                        <CircularProgress 
                            size={40} 
                            sx={{ color: '#FF6B35' }} 
                            thickness={4}
                        />
                    </Box>
                )}

                {/* Empty Wishlist State */}
                {!loading && (!wishlist || wishlist?.items.length === 0) && (
                    <Box sx={{ 
                        textAlign: 'center', 
                        py: 12,
                        px: 4
                    }}>
                        <ShoppingBag sx={{ 
                            fontSize: 64, 
                            color: '#BDBDBD', 
                            mb: 3
                        }} />
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                mb: 2, 
                                color: '#424242',
                                fontWeight: 600
                            }}
                        >
                            Your wishlist is empty
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#757575',
                                fontSize: '1rem',
                                lineHeight: 1.6
                            }}
                        >
                            Start adding items to your wishlist to save them for later!
                        </Typography>
                    </Box>
                )}

                {/* Wishlist Items */}
                {!loading && wishlist && wishlist?.items.length > 0 && (
                    <Box>
                        {/* Wishlist Summary */}
                        <Box sx={{ 
                            mb: 4,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2
                        }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#212121',
                                    fontWeight: 600,
                                    fontSize: '1.25rem'
                                }}
                            >
                                {wishlist?.items.length} item{wishlist?.items.length !== 1 ? 's' : ''} in your wishlist
                            </Typography>
                            
                            <Button 
                                variant="outlined"
                                size="medium"
                                onClick={() => {
                                    clearWishlist()
                                    window.location.reload()
                                }}
                                sx={{
                                    borderColor: '#FF6B35',
                                    color: '#FF6B35',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderColor: '#E65100',
                                        color: '#E65100',
                                        backgroundColor: 'rgba(255, 107, 53, 0.04)',
                                        borderWidth: 2
                                    }
                                }}
                            >
                                Clear wishlist
                            </Button>
                        </Box>

                        {/* Items Grid - Fixed Layout */}
                        <Box sx={{ 
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: { xs: 2, sm: 3 },
                            justifyContent: { xs: 'center', sm: 'flex-start' },
                            alignItems: 'flex-start'
                        }}>
                            {wishlistItems}
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    )
}