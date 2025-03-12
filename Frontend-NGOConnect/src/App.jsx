import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import Header from './components/Header';
import EventCarousel from './components/EventCarousel';
import UserRankings from './components/UserRankings';
import BentoGrid from './components/BentoGrid';
import StandardGrid from './components/StandardGrid';
import Footer from './components/Footer';
import LoginScreen from './pages/LoginScreen';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: true, lg: false });

  // Update token state if localStorage changes
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // If no token is stored, show the login screen
  if (!token) {
    return <LoginScreen />;
  }

  // Otherwise, render the main home screen
  return (
    <Box
      minH="100vh"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/bg-image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        zIndex: -2,
      }}
      _after={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.97)", // Dark overlay matching your theme's bg.primary with opacity
        zIndex: -1,
      }}
    >
      <Header maxW="container.xl"/>
      <Container maxW="container.xl" py={6}>
        {/* Responsive grid layout for event carousel and user rankings */}
        {isTablet ? (
          // Stack vertically on mobile and tablet
          <>
            <EventCarousel />
            <UserRankings mb={6} />
          </>
        ) : (
          // Side by side on desktop
          <Grid templateColumns="2fr 1fr" gap={6} mb={6}>
            <GridItem>
              <EventCarousel />
            </GridItem>
            <GridItem>
              <UserRankings />
            </GridItem>
          </Grid>
        )}
        
        {/* Existing grid components */}
        {isMobile ? <StandardGrid /> : <BentoGrid />}
      </Container>
      <Footer />
    </Box>
  );
}

export default App;