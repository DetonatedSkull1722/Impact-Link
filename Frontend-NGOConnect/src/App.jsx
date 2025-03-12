import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import Header from './components/Header';
import EventCarousel from './components/EventCarousel';
import UserRankings from './components/UserRankings'; // New component we'll create
import BentoGrid from './components/BentoGrid';
import StandardGrid from './components/StandardGrid';
import Footer from './components/Footer';
import LoginScreen from './pages/LoginScreen';

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: true, lg: false });

  // Update token state if sessionStorage changes
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // If no token is stored, show the login screen
  if (!token) {
    return <LoginScreen />;
  }

  // Otherwise, render the main home screen
  return (
    <Box minH="100vh">
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