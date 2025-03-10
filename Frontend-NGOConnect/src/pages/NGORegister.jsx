import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function NGORegister() {
  const toast = useToast();
  const navigate = useNavigate();
  const [ngoName, setNgoName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [password, setPassword] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [aadhar, setAadhar] = useState(null);
  const [aadharPreview, setAadharPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('ngoName', ngoName);
    formData.append('ownerName', ownerName);
    formData.append('ownerEmail', ownerEmail);
    formData.append('password', password);
    if (certificate) formData.append('certificate', certificate);
    if (aadhar) formData.append('aadhar', aadhar);
    
    try {
      const res = await fetch('http://localhost:5000/api/ngo/register', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: 'Registration successful!',
          description: 'NGO account created successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
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
        <Heading mb={4} textAlign="center" color="gray.800">
          NGO Registration
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">NGO Name</FormLabel>
            <Input
              placeholder="Enter NGO Name"
              bg="white"
              color="black"
              value={ngoName}
              onChange={(e) => setNgoName(e.target.value)}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">Owner Name</FormLabel>
            <Input
              placeholder="Enter Owner Name"
              bg="white"
              color="black"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">Owner Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter Owner Email"
              bg="white"
              color="black"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter Password"
              bg="white"
              color="black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">NGO Validation Certificate</FormLabel>
            <Input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              bg="white"
              onChange={(e) => {
                const file = e.target.files[0];
                setCertificate(file);
                if (file && file.type.startsWith('image/')) {
                  setCertificatePreview(URL.createObjectURL(file));
                } else {
                  setCertificatePreview(null);
                }
              }}
            />
            {certificatePreview && (
              <Image src={certificatePreview} alt="Certificate Preview" mt={2} maxH="200px" />
            )}
            {!certificatePreview && certificate && (
              <Text mt={2} color="gray.700">File selected: {certificate.name}</Text>
            )}
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel color="gray.700">Owner's Masked Aadhar</FormLabel>
            <Input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              bg="white"
              onChange={(e) => {
                const file = e.target.files[0];
                setAadhar(file);
                if (file && file.type.startsWith('image/')) {
                  setAadharPreview(URL.createObjectURL(file));
                } else {
                  setAadharPreview(null);
                }
              }}
            />
            {aadharPreview && (
              <Image src={aadharPreview} alt="Aadhar Preview" mt={2} maxH="200px" />
            )}
            {!aadharPreview && aadhar && (
              <Text mt={2} color="gray.700">File selected: {aadhar.name}</Text>
            )}
          </FormControl>
          <Button type="submit" colorScheme="blue" w="full" mt={4}>
            Register NGO Account
          </Button>
        </form>
      </Box>
    </Flex>
  );
}

export default NGORegister;
