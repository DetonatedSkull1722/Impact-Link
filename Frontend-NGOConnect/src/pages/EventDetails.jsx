// src/pages/EventDetails.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Box, Image, Heading, Text, Button, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/Context';

function EventDetails() {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/drives/get`);
        const events = await response.json();
        const foundEvent = events.find((e) => e._id === id);
        if (response.ok && foundEvent) {
          setEvent(foundEvent);
        } else {
          toast({
            title: 'Event Not Found',
            description: 'This event does not exist.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          navigate('/participate');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast({
          title: 'Server Error',
          description: 'Failed to fetch event details',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchEvent();
  }, [id, navigate, toast]);

  const handleParticipation = async () => {
    if (!userInfo) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to participate.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/drives/${id}/participate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userInfo.userId,
          role: userInfo.role,
        }),
      });

  
      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Participation Successful',
          description: 'You have been added to the event!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/participate');
      } else {
        toast({
          title: 'Error Participating',
          description: data.error || 'Something went wrong.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error participating:', error);
      toast({
        title: 'Server Error',
        description: 'Failed to participate in the event',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  if (!event) return <Text>Loading...</Text>;

  return (
    <Box p={6}>
      <Image src={event.imageUrl} alt={event.title} width="100%" height="300px" objectFit="cover" borderRadius="md" />
      <Heading mt={4}>{event.title}</Heading>
      <Text fontSize="lg" color="gray.600" mt={2}>{event.description}</Text>
      <Text fontSize="md" color="gray.500" mt={2}><strong>Location:</strong> {event.location}</Text>
      <Text fontSize="md" color="gray.500"><strong>Start:</strong> {new Date(event.startDate).toLocaleString()}</Text>
      <Text fontSize="md" color="gray.500" mb={4}><strong>End:</strong> {new Date(event.endDate).toLocaleString()}</Text>
      <Button colorScheme="blue" size="lg" onClick={handleParticipation}>Participate</Button>
    </Box>
  );
}

export default EventDetails;
