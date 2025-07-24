"use client"

import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Box, 
  TextField, 
  InputAdornment, 
  Container,
  IconButton
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import CCAHomeItem from "../../../components/CCA/CCAHomeItem.jsx";
import pullCCAList from "../../../api-calls/cca/pullCCAList";
import { CCASummary } from "@/types/CCATypes.js";

export default function CCAHome() {
    const [ccas, setCcas] = useState<CCASummary[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCcas = async () => {
            try {
                console.log("Fetching CCA list...")
                const data = await pullCCAList()
                console.log("data is", data)
                setCcas(data || []) // Ensure it's always an array
            } catch (error) {
                console.error("Error fetching CCAs:", error)
                setCcas([]) // Set empty array on error
            }
        }
        fetchCcas()
    }, []);

    // Add safety checks in your filtering logic
    const filteredCcas = React.useMemo(() => {
        if (!Array.isArray(ccas) || !search.trim()) return ccas || [];
        // Case-insensitive search, bring matches to the top
        const lower = search.trim().toLowerCase();
        const matches = [];
        const nonMatches = [];
        for (const cca of ccas) {
            if (cca && cca.name && cca.name.toLowerCase().includes(lower)) {
                matches.push(cca);
            } else {
                nonMatches.push(cca);
            }
        }
        return [...matches, ...nonMatches];
    }, [ccas, search]);

    // Add safety check for mapping
    const ccaList = (filteredCcas || []).map(cca => (
        <CCAHomeItem key={cca.id} ccainfo={cca} />
    ));

    return (
        <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 700, 
                            color: '#212121',
                            mb: 2,
                            fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                    >
                        NUS CCAs
                    </Typography>
                    <Box 
                        sx={{ 
                            width: 60, 
                            height: 4, 
                            bgcolor: '#FF6B35', 
                            mx: 'auto',
                            borderRadius: 2 
                        }} 
                    />
                </Box>

                {/* Search and Filter Section */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 4,
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 2, md: 0 }
                }}>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: '#757575',
                            fontSize: '0.875rem'
                        }}
                    >
                        Displaying {filteredCcas.length} out of {ccas.length} results
                    </Typography>
                    
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        width: { xs: '100%', md: 'auto' }
                    }}>
                        <TextField
                            placeholder="Enter a CCA here"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{
                                minWidth: 280,
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: '#E0E0E0',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FF6B35',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FF6B35',
                                        borderWidth: 2,
                                    },
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#757575', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <IconButton 
                            sx={{ 
                                bgcolor: 'white',
                                border: '1px solid #E0E0E0',
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: '#F5F5F5',
                                    borderColor: '#FF6B35'
                                }
                            }}
                        >
                            <TuneIcon sx={{ color: '#757575', fontSize: 20 }} />
                        </IconButton>
                    </Box>
                </Box>

                {/* CCA Cards Grid */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    },
                    gap: 3,
                    mt: 4
                }}>
                    {ccaList}
                </Box>
            </Container>
        </Box>
    );
}