import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Heading, 
  useToast, 
  Flex 
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function UserRegister() {
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userNGO, setUserNGO] = useState('');
  const [userNGOrole, setUserNGOrole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'user', userNGO, userNGOrole }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: 'Registration successful!',
          description: 'User account created successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/'); // Navigate to login page or dashboard
      } else {
        toast({
          title: 'Registration failed',
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
        description: 'An error occurred during registration.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box position="relative" minH="100vh" overflow="hidden">
      {/* Background Video */}
      <Box
        as="video"
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        objectFit="cover"
        zIndex="-2"
        autoPlay
        loop
        muted
        src="/bgvideo2.mp4"  // Replace with actual path to your video
      />
      
      {/* Semi-transparent overlay to ensure form readability */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="blackAlpha.600"  // Adjust opacity as needed
        zIndex="-1"
      />
      
      <Flex
        minH="100vh"
        direction="column"
        align="center"
        justify="center"
        px={4}
        position="relative"
      >
        {/* NGO-CONNECT Main Heading */}
        <Heading
          size="2xl"
          color="white"
          fontWeight="bold"
          textShadow="0px 0px 8px rgba(0, 0, 0, 0.6)"
          mb={8}
          letterSpacing="wider"
          display="inline-flex"
          gap={2}
        >
          <img src="/logo.jpg" alt="" style={{ width: '50px', height: 'auto' }} />
          NGO-CONNECT
        </Heading>
        
        <Box 
          bg="whiteAlpha.900" 
          p={6} 
          borderRadius="md" 
          shadow="lg" 
          maxW="400px" 
          w="full"
        >
          <Heading mb={4} textAlign="center" color="gray.800">User Registration</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl mb={3} isRequired>
              <FormLabel color="gray.700">Name</FormLabel>
              <Input
                placeholder="Enter your name"
                bg="white"
                color="black"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel color="gray.700">Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                bg="white"
                color="black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel color="gray.700">Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                bg="white"
                color="black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel color="gray.700">Associated NGO (optional)</FormLabel>
              <Input
                placeholder="Enter NGO name (if any)"
                bg="white"
                color="black"
                value={userNGO}
                onChange={(e) => setUserNGO(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel color="gray.700">NGO Role (optional)</FormLabel>
              <Input
                placeholder="Enter your role in the NGO"
                bg="white"
                color="black"
                value={userNGOrole}
                onChange={(e) => setUserNGOrole(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" w="full" mt={4}>
              Register User Account
            </Button>
          </form>
        </Box>
      </Flex>
    </Box>
  );
}

export default UserRegister;