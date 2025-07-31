'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import Image from 'next/image';
import SportSyncLogo from "../../../assets/sportsync-logo.png"

export default function About() {
  return (
    <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Card 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            mb: 4,
            border: '1px solid #F0F0F0',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
            }
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
              <Image
                src={SportSyncLogo}
                alt="SportSync Logo"
                width={80}
                height={80}
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  borderRadius: '8px'
                }}
              />
              
              <Box sx={{ flex: 1 }}>
                
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#212121', mb: 2 }}>
                  SportSync
                </Typography>

                <Typography variant="h5" sx={{ fontWeight: 600, color: '#212121', mb: 2 }}>
                  Revolutionizing Sports Participation at NUS
                </Typography>
                
                <Typography variant="body1" sx={{ color: '#757575', mb: 3, lineHeight: 1.6 }}>
                  SportSync is an innovative all-in-one platform designed to transform the sports landscape at the National University of Singapore (NUS). Born from the recognition that sports play a pivotal role in student life, we&apos;re committed to fostering community engagement, promoting health, and enhancing the overall university experience through technology.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content - Vertical Stack */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Mission Section */}
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              border: '1px solid #F0F0F0',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#212121' }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8 }}>
                We aim to <strong>increase sports participation and community engagement at NUS</strong> by creating a centralized platform that makes sports activities more accessible, organized, and connected than ever before.
              </Typography>
            </CardContent>
          </Card>

          {/* Challenge Section */}
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              border: '1px solid #F0F0F0',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#212121' }}>
                The Challenge We&apos;re Solving
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8, mb: 3 }}>
                Despite NUS&apos;s vibrant sports culture, we identified several key challenges:
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: '#212121', fontWeight: 600, mb: 1 }}>
                  • Fragmented Communication
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8, mb: 2 }}>
                  Information about sports events, tournaments, and activities is scattered across multiple platforms, leaving many students unaware of opportunities
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: '#212121', fontWeight: 600, mb: 1 }}>
                  • Limited Visibility
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8, mb: 2 }}>
                  Smaller sports CCAs struggle to reach potential members beyond occasional fairs
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: '#212121', fontWeight: 600, mb: 1 }}>
                  • Administrative Burden
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8, mb: 2 }}>
                  Manual processes for attendance tracking and event management consume valuable time that could be spent on actual sports activities
                </Typography>
              </Box>

              <Box>
                <Typography variant="body1" sx={{ color: '#212121', fontWeight: 600, mb: 1 }}>
                  • Disconnected Community
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8 }}>
                  Students miss out on supporting their halls and faculties due to lack of accessible information about tournament progress
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Solution Section */}
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              border: '1px solid #F0F0F0',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#212121' }}>
                Website Features
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8, mb: 4 }}>
                SportSync brings together six core features under one unified platform:
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
                  User Authentication & Profile Management
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8 }}>
                  Secure access with NUS email authentication and personalized user profiles with emergency contacts and custom profile pictures.
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
                  Open Matchmaking System
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8 }}>
                  Connect with fellow students for spontaneous games through our lobby-based system. Create, join, and manage sports sessions with real-time capacity tracking and automated notifications.
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
                  CCA Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8 }}>
                  A comprehensive management hub for sports CCAs featuring member management, training session coordination, and automated communication systems.
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
                  Tournament Information System
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8 }}>
                  Enhanced visibility for major tournaments like IHG and IFG with live updates, team management, match tracking, and historical results database.
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
                  Event Creation & Management
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8 }}>
                  Streamlined organization of special sports events with registration systems, waitlist management, and automated participant communication.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
                  Merchandise Shop
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8 }}>
                  Centralized marketplace for CCA merchandise with integrated wishlist functionality and notification systems for new products.
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Developers */}
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              border: '1px solid #F0F0F0',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#FF6B35', fontWeight: 600 }}>
                  MY
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                    Made Yoga Chantiswara
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#1A237E', fontWeight: 600 }}>
                  AG
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                    Alexander Gerald
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.8 }}>
                As NUS students ourselves, we understand the unique challenges and opportunities within our university&apos;s sports ecosystem. Our firsthand experience drives our commitment to creating solutions that truly serve our community.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}