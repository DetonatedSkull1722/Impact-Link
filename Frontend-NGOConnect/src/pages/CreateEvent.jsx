import React, { useState, useRef, useContext } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Textarea,
  Image,
  Flex,
  useToast,
  Container,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { AuthContext } from '../contexts/Context.jsx';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 28.6139, // New Delhi
  lng: 77.2090,
};

function CreateEvent() {
  const toast = useToast();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  // Form state variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Map states and refs
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [autocomplete, setAutocomplete] = useState(null);
  const mapRef = useRef(null);

  // Update marker on map click and update location field
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    setLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
  };

  // Handle file input for preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file && file.type.startsWith('image/')) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  // When Autocomplete loads
  const handleAutocompleteLoad = (auto) => {
    setAutocomplete(auto);
  };

  // When a place is selected from Autocomplete
  const handlePlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMarkerPosition({ lat, lng });
      setLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
      }
    }
  };

  // On form submission, include createdBy from the token and send form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the user is authenticated and is an owner
    if (!userInfo || userInfo.role !== 'owner') {
      toast({
        title: 'Unauthorized',
        description: 'Only owners can create events.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('location', location);
    // Append createdBy from the decoded token
    formData.append('createdBy', userInfo.userId);
    formData.append('role', userInfo.role);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/drives/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Do not set 'Content-Type' header when sending FormData
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: 'Event Created!',
          description: 'Your event has been successfully added.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Event creation failed',
          description: data.error || 'Something went wrong.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'An error occurred while creating the event.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      width="100%"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/bg-image.png')", // Replace with your image path
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
        background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85))", // Dark overlay
        zIndex: -1,
      }}
    >
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="calc(100vh - 100px)">
          <Box 
            bg="rgba(255, 255, 255, 0.95)" 
            p={{ base: 4, md: 8 }} 
            borderRadius="xl" 
            shadow="2xl" 
            maxW="600px" 
            w="full"
            backdropFilter="blur(10px)"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <Heading mb={6} textAlign="center" color="gray.800" fontSize={{ base: "2xl", md: "3xl" }}>
              Create an Event
            </Heading>
            <form onSubmit={handleSubmit}>
              {/* Event Title */}
              <FormControl mb={4} isRequired>
                <FormLabel fontWeight="600" color="gray.700">Event Title</FormLabel>
                <Input
                  placeholder="Enter Event Title"
                  bg="white"
                  color="black"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  borderColor="gray.300"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                />
              </FormControl>

              {/* Description */}
              <FormControl mb={4} isRequired>
                <FormLabel fontWeight="600" color="gray.700">Description</FormLabel>
                <Textarea
                  placeholder="Enter Event Description"
                  bg="white"
                  color="black"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  borderColor="gray.300"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                  minH="120px"
                />
              </FormControl>

              {/* Start Date */}
              <FormControl mb={4} isRequired>
                <FormLabel fontWeight="600" color="gray.700">Start Date</FormLabel>
                <Input
                  type="datetime-local"
                  bg="white"
                  color="black"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  borderColor="gray.300"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                />
              </FormControl>

              {/* End Date */}
              <FormControl mb={4} isRequired>
                <FormLabel fontWeight="600" color="gray.700">End Date</FormLabel>
                <Input
                  type="datetime-local"
                  bg="white"
                  color="black"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  borderColor="gray.300"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                />
              </FormControl>

              {/* Autocomplete + Map Integration */}
              <FormControl mb={4} isRequired>
                <FormLabel fontWeight="600" color="gray.700">Select Location</FormLabel>
                <LoadScript
                  googleMapsApiKey="AIzaSyBxq2lD3gtxBYfblguoXh2eW2fFZQVS_2E" //key
                  libraries={['places']}
                >
                  <Autocomplete onLoad={handleAutocompleteLoad} onPlaceChanged={handlePlaceChanged}>
                    <Input
                      placeholder="Search for a location or click on the map"
                      bg="white"
                      color="black"
                      mb={2}
                      borderColor="gray.300"
                      _hover={{ borderColor: "blue.300" }}
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                    />
                  </Autocomplete>
                  <Box borderRadius="md" overflow="hidden" boxShadow="md">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={markerPosition}
                      zoom={12}
                      onClick={handleMapClick}
                      onLoad={(map) => (mapRef.current = map)}
                    >
                      <Marker position={markerPosition} />
                    </GoogleMap>
                  </Box>
                </LoadScript>
                <Input
                  type="text"
                  bg="white"
                  color="black"
                  mt={2}
                  value={location}
                  readOnly
                  placeholder="Selected location (lat, lng)"
                  borderColor="gray.300"
                  fontSize="sm"
                />
              </FormControl>

              {/* Event Image */}
              <FormControl mb={5} isRequired>
                <FormLabel fontWeight="600" color="gray.700">Event Image</FormLabel>
                <Input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  bg="white"
                  onChange={handleImageChange}
                  py={1}
                  sx={{
                    '::file-selector-button': {
                      height: '100%',
                      padding: '0 20px',
                      background: 'gray.100',
                      border: 'none',
                      borderRight: '1px solid',
                      borderColor: 'gray.300',
                      color: 'gray.700',
                      fontSize: 'sm',
                      fontWeight: 'medium',
                      mr: 2,
                    }
                  }}
                />
                {imagePreview && (
                  <Box mt={3} borderRadius="md" overflow="hidden" borderWidth="1px" borderColor="gray.300">
                    <Image src={imagePreview} alt="Event Preview" w="100%" objectFit="cover" maxH="200px" />
                  </Box>
                )}
              </FormControl>

              <Button 
                type="submit" 
                colorScheme="blue" 
                w="full" 
                mt={4}
                size="lg"
                fontWeight="bold"
                boxShadow="md"
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                _active={{ transform: "translateY(0)" }}
              >
                Create Event
              </Button>
            </form>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default CreateEvent;