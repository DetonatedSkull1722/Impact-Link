import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast, Flex } from '@chakra-ui/react';
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
    <Flex minH="100vh" align="center" justify="center" bg="bg.primary" p={4}>
      <Box bg="whiteAlpha.900" p={6} borderRadius="md" shadow="lg" maxW="400px" w="full">
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
  );
}

export default UserRegister;
