import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { 
    Container, 
    Typography, 
    Grid, 
    Box,
    CircularProgress,
    Fade,
    styled,
    Divider,
    Paper,
    Button
} from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import pullProductList from "../api-calls/pullProductList.js"
import { useEffect, useState } from "react"
import ProductItem from "../components/ProductItem.jsx"
import { Store, TrendingUp, ArrowForward } from "@mui/icons-material"
import pullWishlist from "../api-calls/pullWishlist.js"

const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    minHeight: '80vh',
}))

const HeroSection = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(6),
    padding: theme.spacing(6, 0),
    background: `
        linear-gradient(135deg, 
            #4a90e2 0%, 
            #5b9bd5 25%, 
            #6fa8dd 50%, 
            #8bb8e8 75%, 
            #a8c8f0 100%
        ),
        radial-gradient(circle at top right, rgba(246, 166, 90, 0.1) 0%, transparent 50%),
        radial-gradient(circle at bottom left, rgba(74, 144, 226, 0.1) 0%, transparent 50%)
    `,
    borderRadius: '24px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(74, 144, 226, 0.2)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(246, 166, 90, 0.08) 0%, transparent 40%)
        `,
        pointerEvents: 'none',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
        pointerEvents: 'none',
    }
}))

const LoadingContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    flexDirection: 'column',
    gap: '24px'
})

const StatsCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: '16px',
    border: '1px solid #e8e8e8',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 28px rgba(74, 144, 226, 0.15)',
        borderColor: '#4a90e2',
    }
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    color: '#333',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-12px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80px',
        height: '4px',
        background: 'linear-gradient(90deg, #4a90e2 0%, #5b9bd5 100%)',
        borderRadius: '2px',
    }
}))

const StyledViewAllButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#4a90e2',
    color: 'white',
    borderRadius: '24px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '12px 24px',
    fontSize: '0.95rem',
    boxShadow: '0 4px 16px rgba(74, 144, 226, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#357abd',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
    },
    '&:active': {
        transform: 'translateY(0)',
    }
}))

export default function MerchandiseShop() {
    // Set states
    const [products, setProducts] = useState(null)
    const [wishlist, setWishlist] = useState(null)
    const [loading, setLoading] = useState(true)

    // Retrieve the product list and wishlist from the API
    useEffect(() => {
        async function fetchProducts() {
            try {
                const [productData, wishlistData] = await Promise.all([
                    pullProductList(),
                    pullWishlist()
                ])
                setProducts(productData)
                setWishlist(wishlistData)
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    console.log("These are the products: ", products)
    console.log("This is the wishlist: ", wishlist)

    // Get a list of IDs for items that are in the user's wishlist
    const wishlistIds = new Set(wishlist?.map(product => (
        product.product.id
    )))

    console.log("These are the wishlistIds: ", wishlistIds)

    // Map over the list of product objects and turn them into product components
    const productList = products?.map((product, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id || index}>
            <Fade in={true} timeout={500 + index * 100}>
                <div>
                    <ProductItem entry={product} isWishlisted={wishlistIds.has(product.id)}/>
                </div>
            </Fade>
        </Grid>
    ))

    // Calculate stats
    const totalProducts = products?.length || 0
    const availableProducts = products?.filter(p => p.available)?.length || 0
    const avgPrice = products?.length > 0 
        ? (products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length).toFixed(2)
        : 0

    const navigate = useNavigate()
    function listNewProduct(productId) {
        navigate("/new-product-form")
    }

    return (
        <>
            <Navbar />
            
            <StyledContainer maxWidth="xl">
                {/* Hero Section */}
                <HeroSection>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Store sx={{ 
                            fontSize: 48, 
                            mb: 2, 
                            opacity: 0.95,
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }} />
                        <Typography 
                            component="h1" 
                            sx={{ 
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: '2rem', md: '3rem' },
                                textShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            SportSync Merchandise Store
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                opacity: 0.92,
                                maxWidth: '600px',
                                mx: 'auto',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                textShadow: '0 1px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            Discover premium quality merchandise from CCAs around NUS. 
                        </Typography>
                    </Box>
                </HeroSection>

                {/* Stats Section */}
                {!loading && products && (
                    <Box sx={{ mb: 6 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <StatsCard elevation={0}>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#4a90e2' }}>
                                        {totalProducts}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#666' }}>
                                        Total Products
                                    </Typography>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <StatsCard elevation={0}>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#4caf50' }}>
                                        {availableProducts}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#666' }}>
                                        Available Now
                                    </Typography>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <StatsCard elevation={0}>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#f6a65a' }}>
                                        ${avgPrice}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#666' }}>
                                        Average Price
                                    </Typography>
                                </StatsCard>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                <Divider sx={{ my: 6 }} />

                {/* Products Section */}
                <Box>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 4,
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <SectionTitle variant="h4" component="h2" sx={{ mb: 0 }}>
                            Featured Products
                        </SectionTitle>
                        <StyledViewAllButton
                            endIcon={<ArrowForward />}
                            onClick={listNewProduct}
                        >
                            List a new product
                        </StyledViewAllButton>
                    </Box>
                    
                    {loading ? (
                        <LoadingContainer>
                            <CircularProgress size={60} thickness={4} />
                            <Typography variant="h6" color="text.secondary">
                                Loading amazing products...
                            </Typography>
                        </LoadingContainer>
                    ) : products && products.length > 0 ? (
                        <Grid container spacing={4}>
                            {productList}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                                No products available at the moment
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#999' }}>
                                Check back soon for new arrivals!
                            </Typography>
                        </Box>
                    )}
                </Box>
            </StyledContainer>
            
            <Footer />
        </>
    )
}