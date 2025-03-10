import React, { useContext } from 'react';
import { Box, Heading, Text, Image, Flex } from '@chakra-ui/react';
import Slider from 'react-slick';
import { AuthContext } from '../contexts/Context'; // Import context
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function EventCarousel() {
  const { drives } = useContext(AuthContext); // Get drives from context

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
  };

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
          {drives.length > 0 ? (
            drives.map(event => (
              <Box key={event._id} position="relative">
                <Image 
                  src={event.imageUrl || 'https://via.placeholder.com/600x300'} 
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
                    <Text fontSize="sm">
                      {new Date(event.startDate).toLocaleDateString()}
                    </Text>
                  </Flex>
                  <Text fontSize="sm" fontStyle="italic" mt={1} color="gray.300">
                    Organized by: {event.createdBy?.name || "Unknown NGO"}
                  </Text>
                </Box>
              </Box>
            ))
          ) : (
            <Box textAlign="center" p={6} color="gray.400">
              No events available.
            </Box>
          )}
        </Slider>
      </Box>
    </Box>
  );
}

export default EventCarousel;
