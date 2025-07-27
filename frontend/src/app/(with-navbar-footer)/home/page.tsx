import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Container, 
  Paper
} from '@mui/material';
import Tournaments from "../tournament/page";
import Events from "../events/page";
import Matches from "../matchmaking/page";

export default function Home() {
  return (
    <Box className="min-h-screen" sx={{ backgroundColor: '#FAFAFA' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
          py: 8
        }}
      >
        <Container maxWidth="lg" className="text-center">
          <Typography 
            variant="h1" 
            className="text-white mb-4 font-bold"
            sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            NUS SportSync
          </Typography>
          <Typography 
            variant="h5" 
            className="text-white opacity-90"
            sx={{ fontWeight: 400 }}
          >
            Compete, Connect, and Celebrate Excellence
          </Typography>
        </Container>
      </Box>

      {/* Dashboard Content */}
      <Container maxWidth="lg" className="py-12">
        {/* Main Dashboard Cards */}
        <Box className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          
          {/* Tournaments Section */}
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              border: '1px solid #F0F0F0',
              overflow: 'hidden',
              height: 'fit-content'
            }}
          >
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
                p: 3
              }}
            >
              <Typography 
                variant="h5" 
                className="text-white font-semibold flex items-center"
              >
                <Box 
                  component="span" 
                  className="w-6 h-6 mr-3 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                >
                  <Box 
                    component="span" 
                    className="w-3 h-3 rounded-full bg-white"
                  />
                </Box>
                Tournaments
              </Typography>
            </Box>
            <CardContent sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
              <Tournaments />
            </CardContent>
          </Card>

          {/* Events Section */}
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              border: '1px solid #F0F0F0',
              overflow: 'hidden',
              height: 'fit-content'
            }}
          >
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                p: 3
              }}
            >
              <Typography 
                variant="h5" 
                className="text-white font-semibold flex items-center"
              >
                <Box 
                  component="span" 
                  className="w-6 h-6 mr-3 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                >
                  <Box 
                    component="span" 
                    className="w-3 h-3 rounded-full bg-white"
                  />
                </Box>
                Events
              </Typography>
            </Box>
            <CardContent sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
              <Events />
            </CardContent>
          </Card>

          {/* Matches Section */}
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              border: '1px solid #F0F0F0',
              overflow: 'hidden',
              height: 'fit-content'
            }}
            className="lg:col-span-2 xl:col-span-1"
          >
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                p: 3
              }}
            >
              <Typography 
                variant="h5" 
                className="text-white font-semibold flex items-center"
              >
                <Box 
                  component="span" 
                  className="w-6 h-6 mr-3 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                >
                  <Box 
                    component="span" 
                    className="w-3 h-3 rounded-full bg-white"
                  />
                </Box>
                Matchmaking
              </Typography>
            </Box>
            <CardContent sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
              <Matches />
            </CardContent>
          </Card>
        </Box>

        {/* Quick Stats Section */}
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              border: '1px solid #F0F0F0',
              p: 4,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '3rem', 
                fontWeight: 700, 
                color: '#FF6B35',
                mb: 1
              }}
            >
              2
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#757575',
                fontWeight: 500
              }}
            >
              Active Tournaments
            </Typography>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              border: '1px solid #F0F0F0',
              p: 4,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '3rem', 
                fontWeight: 700, 
                color: '#2196F3',
                mb: 1
              }}
            >
              10
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#757575',
                fontWeight: 500
              }}
            >
              Upcoming Events
            </Typography>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              border: '1px solid #F0F0F0',
              p: 4,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '3rem', 
                fontWeight: 700, 
                color: '#4CAF50',
                mb: 1
              }}
            >
              14
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#757575',
                fontWeight: 500
              }}
            >
              Open Matches
            </Typography>
          </Paper>
        </Box>

        {/* Call to Action */}
        <Card 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
            borderRadius: 4,
            p: 6,
            textAlign: 'center',
            color: 'white'
          }}
        >
          <Typography 
            variant="h3" 
            className="font-bold mb-4"
            sx={{ fontSize: { xs: '1.75rem', md: '2rem' } }}
          >
            Ready to Join the Action?
          </Typography>
          <Typography 
            variant="h6" 
            className="mb-8 opacity-90"
            sx={{ fontWeight: 400 }}
          >
            Discover tournaments, events, and matches happening at NUS
          </Typography>
          <Box className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: '#FF6B35',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#F5F5F5',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              Browse Tournaments
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#E65100',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#D84315',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              View All Events
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}