"use client"
import { 
    Container, 
    Typography, 
    Box,
    CircularProgress,
    Fade,
    styled,
    Divider,
    Paper,
    Button
} from "@mui/material"
import { useRouter } from "next/navigation"
import pullProductList from "../../../api-calls/merchandise-shop/pullProductList"
import { useEffect, useState } from "react"
import ProductItem from "../../../components/merchandise-shop/ProductItem.jsx"
import { Store, ArrowForward } from "@mui/icons-material"
import pullWishlist from "../../../api-calls/merchandise-shop/pullWishlist"
import { ProductSummary, Wishlist } from "../../../types/MerchandiseShopTypes"

const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    minHeight: '80vh',
}))

const HeroSection = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(6),
    padding: theme.spacing(4, 3),
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #F0F0F0',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
}))

const LoadingContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    flexDirection: 'column',
    gap: '16px'
})

const StatsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(6),
    flexWrap: 'wrap',
    justifyContent: 'center',
}))

const StatsCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: '12px',
    border: '1px solid #F0F0F0',
    backgroundColor: '#FFFFFF',
    minWidth: '200px',
    flex: 1,
    maxWidth: '300px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    }
}))

const SectionHeader = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
})

const ProductsGrid = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    '& > *': {
        flex: '1 1 280px',
        maxWidth: '320px',
    }
})

const ActionButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '10px 20px',
    fontSize: '0.9rem',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.2)',
    },
}))

export default function MerchandiseShop() {
    // Set states
    const [products, setProducts] = useState<ProductSummary[] | null>(null)
    const [wishlist, setWishlist] = useState<Wishlist | null>(null)
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
    const wishlistIds = new Set(wishlist?.items.map(product => (
        product.product.id
    )))

    console.log("These are the wishlistIds: ", wishlistIds)

    // Map over the list of product objects and turn them into product components
    const productList = products?.map((product, index) => (
        <Fade in={true} timeout={300 + index * 50} key={product.id || index}>
            <div>
                <ProductItem entry={product} isWishlisted={wishlistIds.has(product.id)}/>
            </div>
        </Fade>
    ))

    // Calculate stats
    const totalProducts = products?.length || 0
    const availableProducts = products?.filter(p => p.available)?.length || 0
    const avgPrice = products && products.length > 0 
        ? (products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length).toFixed(2)
        : 0

    const router = useRouter()
    function listNewProduct() {
        router.push("/new-product-form")
    }

    return (
        <StyledContainer maxWidth="lg">
            {/* Hero Section */}
            <HeroSection>
                <Store sx={{ 
                    fontSize: 40, 
                    mb: 2, 
                    color: 'primary.main'
                }} />
                <Typography 
                    component="h1" 
                    variant="h3"
                    sx={{ 
                        fontWeight: 700,
                        mb: 1,
                        color: 'text.primary'
                    }}
                >
                    SportSync Merchandise Store
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: 'text.secondary',
                        maxWidth: '500px',
                        mx: 'auto',
                        lineHeight: 1.6
                    }}
                >
                    Discover premium quality merchandise from CCAs around NUS.
                </Typography>
            </HeroSection>

            {/* Stats Section */}
            {!loading && products && (
                <StatsContainer>
                    <StatsCard elevation={0}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                            {totalProducts}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Total Products
                        </Typography>
                    </StatsCard>
                    <StatsCard elevation={0}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 0.5 }}>
                            {availableProducts}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Available Now
                        </Typography>
                    </StatsCard>
                    <StatsCard elevation={0}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 0.5 }}>
                            ${avgPrice}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Average Price
                        </Typography>
                    </StatsCard>
                </StatsContainer>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Products Section */}
            <Box>
                <SectionHeader>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Featured Products
                    </Typography>
                    <ActionButton
                        endIcon={<ArrowForward />}
                        onClick={listNewProduct}
                    >
                        List a new product
                    </ActionButton>
                </SectionHeader>
                
                {loading ? (
                    <LoadingContainer>
                        <CircularProgress size={48} thickness={4} />
                        <Typography variant="body1" color="text.secondary">
                            Loading products...
                        </Typography>
                    </LoadingContainer>
                ) : products && products.length > 0 ? (
                    <ProductsGrid>
                        {productList}
                    </ProductsGrid>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                            No products available at the moment
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                            Check back soon for new arrivals!
                        </Typography>
                    </Box>
                )}
            </Box>
        </StyledContainer>
    )
}