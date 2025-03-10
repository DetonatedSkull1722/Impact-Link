import React, { useState } from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function LoginScreen() {
    const toast = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                sessionStorage.setItem('token', data.token);
                toast({
                    title: 'Login successful!',
                    description: `Welcome, ${data.user.name}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                // Navigate to home/dashboard after successful login
                navigate('/dashboard');
            } else {
                toast({
                    title: 'Login failed',
                    description: data.error || 'Invalid credentials',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (err) {
            console.error('Login error:', err);
            toast({
                title: 'Login error',
                description: 'Something went wrong.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex
            minH="100vh"
            direction="column"
            align="center"
            justify="center"
            bgGradient="linear(to-b, brand.primary, brand.accent)"
            px={4}
        >
            <Box
                bg="whiteAlpha.900"
                p={6}
                borderRadius="md"
                shadow="lg"
                w="full"
                maxW="400px"
                textAlign="center"
            >
                <Heading size="lg" mb={2} color="gray.800">
                    Login here
                </Heading>
                <Text mb={6} color="gray.600">
                    Welcome back! You’ve been missed
                </Text>

                <form onSubmit={handleLogin}>
                    <FormControl mb={4}>
                        <FormLabel color="gray.700">Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="john@example.com"
                            bg="white"
                            color="black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormControl>

                    <FormControl mb={6}>
                        <FormLabel color="gray.700">Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            bg="white"
                            color="black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        w="full"
                        borderRadius="md"
                        mb={3}
                    >
                        Sign in
                    </Button>
                </form>

                <Text fontSize="sm" color="gray.600" mb={2}>
                    Or
                </Text>

                <Button
                    variant="outline"
                    colorScheme="blue"
                    w="full"
                    borderRadius="md"
                    mt={3}
                    onClick={() => navigate('/ngoregister')}
                >
                    Create NGO account
                </Button>

                <Button
                    variant="outline"
                    colorScheme="blue"
                    w="full"
                    borderRadius="md"
                    mt={3}
                    onClick={() => navigate('/userregister')}
                >
                    Create normal user account
                </Button>

                <Text fontSize="sm" mt={4} color="gray.500">
                    Go back to Home Page
                </Text>
            </Box>
        </Flex>
    );
}

export default LoginScreen;
