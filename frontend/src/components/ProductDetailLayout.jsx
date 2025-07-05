import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import pullProductData from "../api-calls/pullProductData"
import { 
    Typography, 
    Container, 
    Grid, 
    Box, 
    Paper, 
    Button, 
    Chip, 
    Card, 
    CardContent,
    Skeleton,
    Fade,
    styled,
    Divider,
    IconButton,
    Breadcrumbs,
    Link
} from "@mui/material"
import { 
    ArrowBack, 
    ShoppingCart, 
    Launch, 
    Store, 
    CheckCircle, 
    Cancel,
    Home,
    NavigateNext
} from "@mui/icons-material"
import Navbar from "./Navbar.jsx"
import Footer from "./Footer.jsx"

const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    minHeight: '80vh',
    maxWidth: '1600px', // Further increased max width
    width: '95%', // Use more of the available screen width
}))

const ProductCard = styled(Paper)(({ theme }) => ({
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(74, 144, 226, 0.1)',
    border: '1px solid rgba(74, 144, 226, 0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 16px 48px rgba(74, 144, 226, 0.15)',
    }
}))

const ProductImage = styled(Box)(({ theme }) => ({
    height: '500px', // Increased height
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at center, rgba(74, 144, 226, 0.05) 0%, transparent 70%)',
    }
}))

const PriceTag = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #4a90e2 0%, #5b9bd5 100%)',
    color: 'white',
    padding: theme.spacing(1, 3),
    borderRadius: '50px',
    fontWeight: 700,
    fontSize: '1.5rem',
    display: 'inline-block',
    boxShadow: '0 4px 16px rgba(74, 144, 226, 0.3)',
}))

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '16px',
    padding: theme.spacing(1.5, 4),
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1.1rem',
    minHeight: '56px',
    transition: 'all 0.3s ease',
    '&.primary': {
        background: 'linear-gradient(135deg, #4a90e2 0%, #5b9bd5 100%)',
        color: 'white',
        border: 'none',
        '&:hover': {
            background: 'linear-gradient(135deg, #357abd 0%, #4a90e2 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(74, 144, 226, 0.3)',
        }
    },
    '&.secondary': {
        background: 'white',
        color: '#4a90e2',
        border: '2px solid #4a90e2',
        '&:hover': {
            background: '#f8f9ff',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(74, 144, 226, 0.15)',
        }
    }
}))

const InfoCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    border: '1px solid rgba(74, 144, 226, 0.08)',
    boxShadow: '0 4px 16px rgba(74, 144, 226, 0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 8px 24px rgba(74, 144, 226, 0.12)',
        transform: 'translateY(-2px)',
    }
}))

const StatusChip = styled(Chip)(({ theme, available }) => ({
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: theme.spacing(0.5, 1),
    ...(available ? {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        color: '#4caf50',
        border: '1px solid rgba(76, 175, 80, 0.2)',
    } : {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        color: '#f44336',
        border: '1px solid rgba(244, 67, 54, 0.2)',
    })
}))

const BackButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: 'white',
    border: '1px solid rgba(74, 144, 226, 0.2)',
    color: '#4a90e2',
    '&:hover': {
        backgroundColor: '#f8f9ff',
        transform: 'translateX(-4px)',
    }
}))

const LoadingSkeleton = () => (
    <StyledContainer maxWidth="xl">
        <Box sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: '8px', mb: 2 }} />
            <Skeleton variant="text" width={200} height={32} />
        </Box>
        <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
                <Skeleton variant="rectangular" height={500} sx={{ borderRadius: '24px' }} />
            </Grid>
            <Grid item xs={12} md={5}>
                <Skeleton variant="text" width="60%" height={48} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '12px', mb: 3 }} />
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: '16px', mb: 2 }} />
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: '16px' }} />
            </Grid>
        </Grid>
    </StyledContainer>
)

export default function ProductDetailLayout() {
    const [productData, setProductData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { productId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchProductData() {
            try {
                const data = await pullProductData(productId)
                setProductData(data)
                console.log("Successfully retrieved product data, ", data)
            }
            catch (error) {
                console.log("Failed to retrieve product data: ", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProductData()
    }, [productId])

    const handlePurchase = () => {
        if (productData?.buy_link) {
            window.open(productData.buy_link, '_blank', 'noopener,noreferrer')
        }
    }

    const handleBackToShop = () => {
        navigate('/merchandise-shop')
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <LoadingSkeleton />
                <Footer />
            </>
        )
    }

    if (!productData) {
        return (
            <>
                <Navbar />
                <StyledContainer maxWidth="xl">
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h4" sx={{ mb: 2, color: '#666' }}>
                            Product Not Found
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, color: '#999' }}>
                            The product you're looking for doesn't exist or has been removed.
                        </Typography>
                        <ActionButton 
                            className="primary" 
                            onClick={handleBackToShop}
                            startIcon={<ArrowBack />}
                        >
                            Back to Shop
                        </ActionButton>
                    </Box>
                </StyledContainer>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <StyledContainer maxWidth="xl">
                <Fade in={true} timeout={600}>
                    <Box>
                        {/* Navigation */}
                        <Box sx={{ mb: 4 }}>
                            <BackButton onClick={handleBackToShop} sx={{ mb: 2 }}>
                                <ArrowBack />
                            </BackButton>
                            <Breadcrumbs 
                                separator={<NavigateNext fontSize="small" />}
                                sx={{ color: '#666' }}
                            >
                                <Link 
                                    color="inherit" 
                                    href="/merchandise" 
                                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                                >
                                    <Home sx={{ mr: 0.5, fontSize: '1rem' }} />
                                    Merchandise
                                </Link>
                                <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                                    {productData.name}
                                </Typography>
                            </Breadcrumbs>
                        </Box>

                        {/* Main Product Section */}
                        <ProductCard>
                            <Grid container spacing={0}>
                                <Grid item xs={12} md={7}>
                                    <ProductImage>
                                        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                                            <Store sx={{ 
                                                fontSize: 100, 
                                                color: '#4a90e2', 
                                                opacity: 0.3, 
                                                mb: 2 
                                            }} />
                                            <Typography variant="h6" sx={{ color: '#666', opacity: 0.7 }}>
                                                Product Image
                                            </Typography>
                                        </Box>
                                    </ProductImage>
                                </Grid>
                                
                                <Grid item xs={12} md={5}>
                                    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        {/* Product Title and Status */}
                                        <Box sx={{ mb: 3 }}>
                                            <Typography 
                                                variant="h3" 
                                                component="h1" 
                                                sx={{ 
                                                    fontWeight: 700, 
                                                    color: '#333', 
                                                    mb: 2,
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                {productData.name}
                                            </Typography>
                                            <StatusChip 
                                                available={productData.available}
                                                icon={productData.available ? <CheckCircle /> : <Cancel />}
                                                label={productData.available ? "In Stock" : "Out of Stock"}
                                                variant="outlined"
                                            />
                                        </Box>

                                        {/* CCA Info */}
                                        <InfoCard sx={{ mb: 3 }}>
                                            <CardContent>
                                                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                                                    Offered by
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#4a90e2' }}>
                                                    {productData.cca_name}
                                                </Typography>
                                            </CardContent>
                                        </InfoCard>

                                        {/* Description */}
                                        <Box sx={{ mb: 4, flexGrow: 1 }}>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    color: '#666', 
                                                    lineHeight: 1.6,
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                {productData.description}
                                            </Typography>
                                        </Box>

                                        {/* Price */}
                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                                                Price
                                            </Typography>
                                            <PriceTag>
                                                ${productData.price}
                                            </PriceTag>
                                        </Box>

                                        {/* Action Buttons */}
                                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                            <ActionButton
                                                className="primary"
                                                onClick={handlePurchase}
                                                disabled={!productData.available}
                                                startIcon={<Launch />}
                                                fullWidth
                                            >
                                                {productData.available ? 'Purchase Now' : 'Out of Stock'}
                                            </ActionButton>
                                            <ActionButton
                                                className="secondary"
                                                onClick={handleBackToShop}
                                                startIcon={<Store />}
                                                fullWidth
                                            >
                                                Continue Shopping
                                            </ActionButton>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </ProductCard>
                    </Box>
                </Fade>
            </StyledContainer>
            <Footer />
        </>
    )
}