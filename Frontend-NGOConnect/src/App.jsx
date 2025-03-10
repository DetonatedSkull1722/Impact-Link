import React, { useState, useEffect } from 'react';
import { Box, Container, useBreakpointValue } from '@chakra-ui/react';
import Header from './components/Header';
import EventCarousel from './components/EventCarousel';
import BentoGrid from './components/BentoGrid';
import StandardGrid from './components/StandardGrid';
import Footer from './components/Footer';
import LoginScreen from './pages/LoginScreen';

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const isMobile = useBreakpointValue({ base: true, md: false });

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
    <Box minH="100vh" bg="bg.primary">
      <Header />
      <Container maxW="container.xl" py={6}>
        <EventCarousel />
        {isMobile ? <StandardGrid /> : <BentoGrid />}
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
