// src/App.jsx
import { Box, Container, useBreakpointValue } from '@chakra-ui/react'
import Header from './components/Header'
import EventCarousel from './components/EventCarousel'
import BentoGrid from './components/BentoGrid'
import StandardGrid from './components/StandardGrid'
import Footer from './components/Footer'

function App() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box minH="100vh" bg="bg.primary">
      <Header />
      <Container maxW="container.xl" py={6}>
        <EventCarousel />
        {isMobile ? <StandardGrid /> : <BentoGrid />}
      </Container>
      <Footer />
    </Box>
  )
}

export default App