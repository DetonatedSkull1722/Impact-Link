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
    <Flex minH="100vh" align="center" justify="center" bg="bg.primary" p={4}>
      <Box bg="whiteAlpha.900" p={6} borderRadius="md" shadow="lg" maxW="500px" w="full">
        <Heading mb={4} textAlign="center" color="gray.800">
          Create an Event
        </Heading>
        <form onSubmit={handleSubmit}>
          {/* Event Title */}
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">Event Title</FormLabel>
            <Input
              placeholder="Enter Event Title"
              bg="white"
              color="black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>

          {/* Description */}
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">Description</FormLabel>
            <Textarea
              placeholder="Enter Event Description"
              bg="white"
              color="black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          {/* Start Date */}
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">Start Date</FormLabel>
            <Input
              type="datetime-local"
              bg="white"
              color="black"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>

          {/* End Date */}
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">End Date</FormLabel>
            <Input
              type="datetime-local"
              bg="white"
              color="black"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormControl>

          {/* Autocomplete + Map Integration */}
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">Select Location</FormLabel>
            <LoadScript
              googleMapsApiKey="AIzaSyBxq2lD3gtxBYfblguoXh2eW2fFZQVS_2E" //key
              libraries={['places']}
            >
              <Autocomplete onLoad={handleAutocompleteLoad} onPlaceChanged={handlePlaceChanged}>
                <Input
                  placeholder="Search or click on map"
                  bg="white"
                  color="black"
                  mb={2}
                />
              </Autocomplete>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPosition}
                zoom={12}
                onClick={handleMapClick}
                onLoad={(map) => (mapRef.current = map)}
              >
                <Marker position={markerPosition} />
              </GoogleMap>
            </LoadScript>
            <Input
              type="text"
              bg="white"
              color="black"
              mt={2}
              value={location}
              readOnly
              placeholder="Selected location (lat, lng)"
            />
          </FormControl>

          {/* Event Image */}
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">Event Image</FormLabel>
            <Input
              type="file"
              accept=".png,.jpg,.jpeg"
              bg="white"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <Image src={imagePreview} alt="Event Preview" mt={2} maxH="200px" />
            )}
          </FormControl>

          <Button type="submit" colorScheme="blue" w="full" mt={4}>
            Create Event
          </Button>
        </form>
      </Box>
    </Flex>
  );
}

export default CreateEvent;
