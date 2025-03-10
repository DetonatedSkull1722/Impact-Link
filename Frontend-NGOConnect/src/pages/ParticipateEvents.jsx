// src/pages/ParticipateEvents.jsx
import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Image, Text, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function ParticipateEvents() {
  const [events, setEvents] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/drives/get');
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
      }
    };

    fetchEvents();
  }, []);

  return (
    <Box p={6}>
      <Heading mb={4} textAlign="center">Available Events</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {events.map((event) => (
          <Box
            key={event._id}
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            transition="all 0.2s"
            _hover={{ transform: 'scale(1.02)', boxShadow: 'xl' }}
            cursor="pointer"
            onClick={() => navigate(`/participate/${event._id}`)}
          >
            <Image src={event.imageUrl} alt={event.title} width="100%" height="200px" objectFit="cover" />
            <Box p={4}>
              <Heading size="md" mb={2}>{event.title}</Heading>
              <Text fontSize="sm" color="gray.600">{event.location}</Text>
              <Text fontSize="sm" color="gray.500">Starts: {new Date(event.startDate).toLocaleString()}</Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default ParticipateEvents;
