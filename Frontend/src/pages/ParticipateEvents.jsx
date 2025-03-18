// src/pages/ParticipateEvents.jsx
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  SimpleGrid, 
  Image, 
  Text, 
  Button, 
  useToast, 
  Skeleton,
  Badge,
  Flex,
  Icon
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

function ParticipateEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/drives/get', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setEvents(data);
        } else {
          toast({
            title: 'Error fetching events',
            description: data.error || 'Something went wrong',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: 'Server Error',
          description: 'Failed to fetch events',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  // Calculate if an event is upcoming (within next 7 days)
  const isUpcoming = (startDate) => {
    const eventDate = new Date(startDate);
    const today = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return eventDate > today && eventDate - today < oneWeek;
  };

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
        background: "rgba(15, 23, 42, 0.97)",
        zIndex: -1,
      }}
    >
      <Container maxW="container.xl" py={8}>
        <Heading mb={6} textAlign="center" color="white">Available Events</Heading>
        
        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {[...Array(6)].map((_, index) => (
              <Box 
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                bg="rgba(26, 32, 44, 0.8)"
                backdropFilter="blur(10px)"
                boxShadow="lg"
              >
                <Skeleton height="200px" />
                <Box p={4}>
                  <Skeleton height="24px" width="70%" mb={2} />
                  <Skeleton height="16px" width="50%" mb={2} />
                  <Skeleton height="16px" width="40%" />
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {events.length === 0 ? (
              <Box 
                gridColumn="1 / -1" 
                p={8} 
                textAlign="center" 
                bg="rgba(26, 32, 44, 0.8)"
                borderRadius="lg"
                color="white"
              >
                <Text fontSize="lg">No events are currently available.</Text>
                <Text mt={2} color="gray.400">Check back soon for upcoming opportunities!</Text>
              </Box>
            ) : (
              events.map((event) => (
                <Box
                  key={event._id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  bg="rgba(26, 32, 44, 0.8)"
                  backdropFilter="blur(10px)"
                  boxShadow="lg"
                  transition="all 0.3s"
                  _hover={{ transform: 'translateY(-8px)', boxShadow: 'xl' }}
                  cursor="pointer"
                  onClick={() => navigate(`/participate/${event._id}`)}
                  position="relative"
                >
                  {isUpcoming(event.startDate) && (
                    <Badge 
                      position="absolute" 
                      top={3} 
                      right={3} 
                      colorScheme="green"
                      zIndex={1}
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      Upcoming
                    </Badge>
                  )}
                  <Box position="relative" height="200px">
                    <Image 
                      src={event.imageUrl} 
                      alt={event.title} 
                      width="100%" 
                      height="200px" 
                      objectFit="cover" 
                    />
                    <Box 
                      position="absolute" 
                      bottom={0} 
                      left={0} 
                      width="100%" 
                      background="linear-gradient(transparent, rgba(0,0,0,0.8))"
                      p={4}
                    >
                      <Heading size="md" color="white">{event.title}</Heading>
                    </Box>
                  </Box>
                  <Box p={4} color="white">
                    <Flex align="center" mb={2}>
                      <Icon as={FaMapMarkerAlt} color="blue.400" mr={2} />
                      <Text fontSize="sm">{event.location}</Text>
                    </Flex>
                    <Flex align="center">
                      <Icon as={FaCalendarAlt} color="blue.400" mr={2} />
                      <Text fontSize="sm">{new Date(event.startDate).toLocaleDateString(undefined, { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</Text>
                    </Flex>
                    <Button 
                      mt={4} 
                      size="sm" 
                      colorScheme="blue" 
                      width="100%"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/participate/${event._id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}

export default ParticipateEvents;