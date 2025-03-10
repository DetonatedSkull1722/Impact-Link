// src/components/EventCarousel.jsx
import { useEffect } from 'react'
import { Box, Heading, Text, Image, Flex } from '@chakra-ui/react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// Hardcoded events data
const events = [
  {
    id: 1,
    title: "Community Cleanup Drive",
    location: "Central Park",
    date: "March 15, 2025",
    image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?q=80&w=600&h=300&fit=crop",
    organizer: "Green Earth NGO"
  },
  {
    id: 2,
    title: "Food Distribution Campaign",
    location: "Downtown Community Center",
    date: "March 20, 2025",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=600&h=300&fit=crop",
    organizer: "Food For All"
  },
  {
    id: 3,
    title: "Children's Education Workshop",
    location: "Public Library",
    date: "March 25, 2025",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&h=300&fit=crop",
    organizer: "Education First"
  },
  {
    id: 4,
    title: "Health Awareness Camp",
    location: "City Hospital",
    date: "April 2, 2025",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&h=300&fit=crop",
    organizer: "Health For All"
  }
]

function EventCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true
  };

  // Add a dummy empty effect to avoid console errors with strict mode
  useEffect(() => {}, []);

  return (
    <Box mb={8}>
      <Heading mb={4} color="white" fontSize="2xl">Nearby Events</Heading>
      <Box 
        borderRadius="24px" 
        overflow="hidden" 
        boxShadow="lg"
        bg="bg.card"
        borderWidth="1px" 
        borderColor="gray.700"
      >
        <Slider {...settings}>
          {events.map(event => (
            <Box key={event.id} position="relative">
              <Image 
                src={event.image} 
                alt={event.title}
                width="100%" 
                height="300px"
                objectFit="cover"
              />
              <Box 
                position="absolute" 
                bottom="0" 
                width="100%" 
                bg="rgba(0,0,0,0.7)" 
                color="white"
                p={4}
                backdropFilter="blur(8px)"
              >
                <Heading size="md">{event.title}</Heading>
                <Flex justify="space-between" mt={2}>
                  <Text fontSize="sm">{event.location}</Text>
                  <Text fontSize="sm">{event.date}</Text>
                </Flex>
                <Text fontSize="sm" fontStyle="italic" mt={1} color="gray.300">Organized by: {event.organizer}</Text>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  )
}

export default EventCarousel