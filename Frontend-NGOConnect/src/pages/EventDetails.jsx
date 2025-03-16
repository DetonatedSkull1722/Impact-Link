// src/pages/EventDetails.jsx
import React, { useEffect, useState, useContext } from 'react';
import { 
  Box, 
  Container,
  Image, 
  Heading, 
  Text, 
  Button, 
  useToast,
  Flex,
  Icon,
  Badge,
  Divider,
  Grid,
  GridItem,
  Skeleton,
  SkeletonText,
  useBreakpointValue
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/Context';
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft, FaUsers } from 'react-icons/fa';
import { BiTimeFive } from 'react-icons/bi';

function EventDetails() {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participating, setParticipating] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/drives/get`);
        const events = await response.json();
        const foundEvent = events.find((e) => e._id === id);
        
        if (response.ok && foundEvent) {
          setEvent(foundEvent);
          
          // Check if user is already participating (assuming the API returns participants)
          if (foundEvent.participants && userInfo) {
            setParticipating(foundEvent.participants.some(p => p.userId === userInfo.userId));
            setParticipantCount(foundEvent.participants.length);
          }
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
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate, toast, userInfo]);

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
        setParticipating(true);
        setParticipantCount(prev => prev + 1);
        toast({
          title: 'Participation Successful',
          description: 'You have been added to the event!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
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
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = () => {
    if (!event) return null;
    
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now < startDate) {
      return { label: "Upcoming", color: "green" };
    } else if (now >= startDate && now <= endDate) {
      return { label: "In Progress", color: "blue" };
    } else {
      return { label: "Completed", color: "gray" };
    }
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
        <Button 
          leftIcon={<FaArrowLeft />} 
          variant="ghost" 
          mb={4} 
          onClick={() => navigate('/participate')}
          color="white"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
        >
          Back to Events
        </Button>

        {loading ? (
          <Box 
            borderRadius="lg" 
            overflow="hidden"
            bg="rgba(26, 32, 44, 0.8)"
            backdropFilter="blur(10px)"
            boxShadow="xl"
          >
            <Skeleton height="400px" />
            <Box p={6}>
              <SkeletonText mt={4} noOfLines={1} spacing={4} skeletonHeight={8} width="60%" />
              <SkeletonText mt={4} noOfLines={4} spacing={4} />
              <Skeleton mt={6} height="40px" width="150px" />
            </Box>
          </Box>
        ) : event ? (
          <Grid 
            templateColumns={{ base: "1fr", md: "2fr 1fr" }}
            gap={6}
          >
            <GridItem 
              colSpan={{ base: 1, md: 2 }}
              borderRadius="lg" 
              overflow="hidden"
              position="relative"
            >
              <Image 
                src={event.imageUrl} 
                alt={event.title} 
                width="100%" 
                height={{ base: "250px", md: "400px" }} 
                objectFit="cover" 
              />
              <Box 
                position="absolute" 
                bottom={0} 
                left={0} 
                width="100%" 
                background="linear-gradient(transparent, rgba(0,0,0,0.9))"
                p={6}
              >
                <Flex justify="space-between" align="center">
                  <Heading color="white" size={{ base: "xl", md: "2xl" }}>{event.title}</Heading>
                  {getEventStatus() && (
                    <Badge 
                      colorScheme={getEventStatus().color} 
                      fontSize="md" 
                      py={1} 
                      px={3} 
                      borderRadius="full"
                    >
                      {getEventStatus().label}
                    </Badge>
                  )}
                </Flex>
              </Box>
            </GridItem>
            
            <GridItem>
              <Box 
                p={6} 
                borderRadius="lg"
                bg="rgba(26, 32, 44, 0.8)"
                backdropFilter="blur(10px)"
                boxShadow="xl"
                color="white"
                height="100%"
              >
                <Heading size="md" mb={4}>Event Details</Heading>
                <Text fontSize="lg" mb={6}>{event.description}</Text>
                
                <Divider mb={6} />
                
                <Flex direction="column" gap={4}>
                  <Flex align="center">
                    <Icon as={FaMapMarkerAlt} boxSize={5} color="blue.400" mr={3} />
                    <Text><strong>Location:</strong> {event.location}</Text>
                  </Flex>
                  
                  <Flex align="center">
                    <Icon as={BiTimeFive} boxSize={5} color="blue.400" mr={3} />
                    <Box>
                      <Text><strong>Start:</strong> {formatDate(event.startDate)}</Text>
                      <Text mt={1}><strong>End:</strong> {formatDate(event.endDate)}</Text>
                    </Box>
                  </Flex>
                  
                  {participantCount > 0 && (
                    <Flex align="center">
                      <Icon as={FaUsers} boxSize={5} color="blue.400" mr={3} />
                      <Text><strong>Participants:</strong> {participantCount}</Text>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </GridItem>
            
            <GridItem>
              <Box 
                p={6} 
                borderRadius="lg"
                bg="rgba(26, 32, 44, 0.8)"
                backdropFilter="blur(10px)"
                boxShadow="xl"
                color="white"
                height="100%"
              >
                <Heading size="md" mb={4}>Participation</Heading>
                
                {participating ? (
                  <Box>
                    <Badge colorScheme="green" p={2} borderRadius="md" width="100%" textAlign="center">
                      You're participating in this event
                    </Badge>
                    <Text mt={4}>
                      Thank you for joining! You'll receive updates about this event.
                    </Text>
                  </Box>
                ) : (
                  <Box>
                    <Text mb={4}>
                      Join this event to participate and receive updates.
                    </Text>
                    <Button 
                      colorScheme="blue" 
                      size="lg" 
                      width="100%"
                      onClick={handleParticipation}
                      isDisabled={getEventStatus()?.label === "Completed"}
                    >
                      Participate Now
                    </Button>
                    
                    {getEventStatus()?.label === "Completed" && (
                      <Text mt={2} fontSize="sm" color="red.300">
                        This event has already ended.
                      </Text>
                    )}
                  </Box>
                )}
              </Box>
            </GridItem>
          </Grid>
        ) : (
          <Box 
            p={8} 
            textAlign="center" 
            bg="rgba(26, 32, 44, 0.8)"
            borderRadius="lg"
            color="white"
          >
            <Heading size="md">Event Not Found</Heading>
            <Text mt={4}>The event you're looking for doesn't exist or has been removed.</Text>
            <Button 
              mt={6} 
              colorScheme="blue" 
              onClick={() => navigate('/participate')}
            >
              Browse Available Events
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default EventDetails;