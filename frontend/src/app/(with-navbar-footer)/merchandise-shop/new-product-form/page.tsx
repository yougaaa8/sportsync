"use client"

import createNewProduct from "../../../../api-calls/merchandise-shop/createNewProduct"
import { useState, useEffect } from "react"
import pullCCADetails from "@/api-calls/cca/pullCCADetails"
import { useRouter } from "next/navigation"
import { 
    Box, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Button, 
    Typography, 
    Container,
    Paper,
} from "@mui/material"
import { CCADetail } from "@/types/CCATypes"

export default function NewProductForm() {
    // Set states
    const [ccaIds, setCcaIds] = useState([])
    const [ccas, setCcas] = useState<CCADetail[]>([])

    // Set static values
    const router = useRouter()

    // Pull the user's ccaIds from local storage into an array of ccaIds
    useEffect(() => {
        if (typeof window !== "undefined") {
            const ccaIdsStr = localStorage.getItem("ccaIds");
            if (ccaIdsStr) {
                setCcaIds(JSON.parse(ccaIdsStr));
            }
        }
    }, [])

    // Map the array of ccaIds to an array of cca objects
    useEffect(() => {
        const fetchCcas = async () => {
            const fetchedCcas = await Promise.all(
                ccaIds?.map(ccaId => (
                    pullCCADetails(ccaId)
                )))
            console.log("the fetched ccas are: ", fetchedCcas)
            setCcas(fetchedCcas)
        }
        fetchCcas()
    }, [ccaIds])

    // Map the array of ccaObjects to an array of options for the form
    const ccaOptions = ccas?.map(cca => (
        <MenuItem key={cca.id} value={cca.id}>{cca.name}</MenuItem>
    ))

    // Define functions
    async function createNewProductClick(formData: FormData) {
        // Send form data to API call
        const response = await createNewProduct(formData)
        // Reload page if API call is successful
        if (response) {
            setTimeout(() => {
                router.push("/merchandise-shop")
            }, 1000)
        }
    }
    console.log("ccaids: ", ccaIds)
    console.log("user ccas: ", ccas)
    
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#212121' }}>
                    Create New Product
                </Typography>
            </Box>

            {/* Form Container */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    borderRadius: 3,
                    border: '1px solid #f0f0f0',
                    backgroundColor: '#ffffff'
                }}
            >
                <Box component="form" action={createNewProductClick}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        
                        {/* Product Name */}
                        <TextField
                            name="name"
                            label="Product Name"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />

                        {/* CCA Selection */}
                        <FormControl fullWidth required>
                            <InputLabel>CCA</InputLabel>
                            <Select
                                name="cca"
                                label="CCA"
                                sx={{
                                    borderRadius: 2,
                                }}
                            >
                                {ccaOptions}
                            </Select>
                        </FormControl>

                        {/* Product Description */}
                        <TextField
                            name="description"
                            label="Product Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />

                        {/* Images Upload */}
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1, color: '#757575', fontWeight: 500 }}>
                                Images* (Multiple files allowed)
                            </Typography>
                            <Box
                                sx={{
                                    border: '2px dashed #e0e0e0',
                                    borderRadius: 2,
                                    p: 3,
                                    textAlign: 'center',
                                    backgroundColor: '#fafafa',
                                    '&:hover': {
                                        borderColor: '#FF6B35',
                                        backgroundColor: '#fff5f2'
                                    }
                                }}
                            >
                                <input
                                    required
                                    type="file"
                                    name="uploaded_images"
                                    accept="image/*"
                                    multiple
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer'
                                    }}
                                />
                                <Typography variant="body2" sx={{ color: '#757575', mt: 1 }}>
                                    Choose files or drag and drop (Multiple files supported)
                                </Typography>
                            </Box>
                        </Box>

                        {/* Price and Availability Row */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="price"
                                label="Price"
                                variant="outlined"
                                type="number"
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: <Typography sx={{ mr: 1, color: '#757575' }}>$</Typography>,
                                    inputProps: { step: "0.01" }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />

                            <FormControl fullWidth required>
                                <InputLabel>Availability</InputLabel>
                                <Select
                                    name="available"
                                    label="Availability"
                                    defaultValue="true"
                                    sx={{
                                        borderRadius: 2,
                                    }}
                                >
                                    <MenuItem value="true">Available</MenuItem>
                                    <MenuItem value="false">Unavailable</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Purchase Link */}
                        <TextField
                            name="buy_link"
                            label="Purchase Link"
                            variant="outlined"
                            fullWidth
                            placeholder="https://example.com/purchase"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />

                        {/* Submit Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => router.back()}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderColor: '#e0e0e0',
                                    color: '#757575',
                                    '&:hover': {
                                        borderColor: '#bdbdbd',
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FF8A65 0%, #FF6B35 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                    }
                                }}
                            >
                                Create New Product
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}