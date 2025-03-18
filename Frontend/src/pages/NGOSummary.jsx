import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Spinner,
  Center,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/Context.jsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';

function NGOSummary() {
  const toast = useToast();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const [ngoDrives, setNgoDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Key stats
  const [initiativesCount, setInitiativesCount] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);

  useEffect(() => {
    // If user is not an owner or not logged in, redirect or show error
    if (!userInfo || userInfo.role !== 'owner') {
      toast({
        title: 'Unauthorized',
        description: 'You must be an NGO owner to view this page.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
      return;
    }

    const fetchDrives = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/drives/get', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          // Filter drives by createdBy = userInfo.userId
          const myDrives = data.filter(d => d.createdBy?._id === userInfo.userId);

          setNgoDrives(myDrives);
          setInitiativesCount(myDrives.length);

          // Calculate total participants
          let total = 0;
          myDrives.forEach(drive => {
            total += (drive.participants?.length || 0);
          });
          setTotalParticipants(total);
        } else {
          toast({
            title: 'Error fetching drives',
            description: data.error || 'Something went wrong.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching drives:', error);
        toast({
          title: 'Server Error',
          description: 'Failed to fetch NGO drives.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, [userInfo, navigate, toast]);

  // Prepare data for bar chart (participants per event)
  const barData = ngoDrives.map(drive => ({
    name: drive.title,
    participants: drive.participants?.length || 0,
  }));

  // Example data for satisfaction gauge (dummy)
  const satisfactionData = [
    { name: 'Satisfaction', value: 95, fill: '#4FD1C5' }, // teal.300
  ];

  if (loading) {
    return (
      <Container maxW="container.xl" centerContent>
        <Center h="80vh">
          <Spinner size="xl" color="blue.400" />
        </Center>
      </Container>
    );
  }

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
        background: "rgba(15, 23, 42, 0.97)", // Dark overlay matching theme
        zIndex: -1,
      }}
    >
      <Container maxW="container.xl" py={6}>
        <Heading size="lg" mb={6} color="white">
          NGO Summary
        </Heading>

        {/* Key Stats - Responsive Grid */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={8}>
          <StatBox label="Initiatives" value={initiativesCount} helpText="Events Created" />
          <StatBox label="Participation" value={totalParticipants} helpText="Total Participants" />
          <StatBox label="Safety" value="9.3" helpText="Total Score" />
        </Grid>

        {/* Main content area with responsive layout */}
        {isMobile ? (
          // Stack vertically on mobile
          <>
            {/* Satisfaction Rate Gauge */}
            <Box bg="bg.card" p={4} borderRadius="lg" mb={6} borderWidth="1px" borderColor="gray.700">
              <Heading size="md" mb={2} color="white">
                Satisfaction Rate
              </Heading>
              <Text fontSize="sm" color="gray.300" mb={4}>
                From all projects (dummy data)
              </Text>
              <Flex direction="column" align="center">
                <Box width="250px" height="200px">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="70%"
                      outerRadius="100%"
                      data={satisfactionData}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar minAngle={15} dataKey="value" cornerRadius={10} />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </Box>
                <Box mt={4} textAlign="center">
                  <Text fontSize="4xl" color="white" fontWeight="bold">
                    95%
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    Based on likes
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* Active Participation Chart */}
            <Box bg="bg.card" p={4} borderRadius="lg" borderWidth="1px" borderColor="gray.700">
              <Heading size="md" mb={2} color="white">
                Active Participation — your NGO members
              </Heading>
              <Text fontSize="sm" color="gray.300" mb={4}>
                Number of participants per initiative
              </Text>
              <Box width="100%" height="400px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="gray" />
                    <XAxis dataKey="name" stroke="#CBD5E0" />
                    <YAxis stroke="#CBD5E0" />
                    <Tooltip />
                    <Bar dataKey="participants" fill="#63B3ED" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </>
        ) : (
          // Side by side on desktop
          <Grid templateColumns="1fr 1fr" gap={6} mb={6}>
            <GridItem>
              {/* Satisfaction Rate Gauge */}
              <Box bg="bg.card" p={4} borderRadius="lg" h="100%" borderWidth="1px" borderColor="gray.700">
                <Heading size="md" mb={2} color="white">
                  Satisfaction Rate
                </Heading>
                <Text fontSize="sm" color="gray.300" mb={4}>
                  From all projects (dummy data)
                </Text>
                <Flex justify="center" align="center" h="calc(100% - 70px)" direction="column">
                  <Box width="250px" height="200px">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={satisfactionData}
                        startAngle={180}
                        endAngle={0}
                      >
                        <RadialBar minAngle={15} dataKey="value" cornerRadius={10} />
                        <Tooltip />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box mt={4} textAlign="center">
                    <Text fontSize="4xl" color="white" fontWeight="bold">
                      95%
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      Based on likes
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </GridItem>
            <GridItem>
              {/* Active Participation Chart */}
              <Box bg="bg.card" p={4} borderRadius="lg" h="100%" borderWidth="1px" borderColor="gray.700">
                <Heading size="md" mb={2} color="white">
                  Active Participation — your NGO members
                </Heading>
                <Text fontSize="sm" color="gray.300" mb={4}>
                  Number of participants per initiative
                </Text>
                <Box width="100%" height="calc(100% - 70px)">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="gray" />
                      <XAxis dataKey="name" stroke="#CBD5E0" />
                      <YAxis stroke="#CBD5E0" />
                      <Tooltip />
                      <Bar dataKey="participants" fill="#63B3ED" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </GridItem>
          </Grid>
        )}
        
        {/* Additional content below the two charts */}
        <Box bg="bg.card" p={4} borderRadius="lg" borderWidth="1px" borderColor="gray.700" mb={6}>
          <Heading size="md" mb={4} color="white">
            Recent Activities
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            {ngoDrives.slice(0, 4).map((drive, index) => (
              <Box key={index} p={4} bg="bg.secondary" borderRadius="md">
                <Heading size="sm" mb={2}>{drive.title || 'Untitled Drive'}</Heading>
                <Text fontSize="sm">{drive.participants?.length || 0} participants</Text>
              </Box>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default NGOSummary;

/** A small reusable stat box component **/
function StatBox({ label, value, helpText }) {
  return (
    <Box
      bg="bg.card"
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="lg"
      p={4}
      flex="1"
      minW="160px"
    >
      <Heading size="md" color="white" mb={1}>{label}</Heading>
      <Text fontSize="2xl" fontWeight="bold" color="white">{value}</Text>
      <Text fontSize="sm" color="gray.400">{helpText}</Text>
    </Box>
  );
}