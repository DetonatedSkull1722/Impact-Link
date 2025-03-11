import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Spinner,
  Center,
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
        const response = await fetch('http://localhost:5000/api/drives/get');
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
  // In real usage, you'd compute a "satisfaction" metric from your data
  const satisfactionData = [
    { name: 'Satisfaction', value: 95, fill: '#4FD1C5' }, // teal.300
  ];

  if (loading) {
    return (
      <Center h="80vh">
        <Spinner size="xl" color="blue.400" />
      </Center>
    );
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={6} color="white">
        NGO Summary
      </Heading>

      {/* Key Stats */}
      <Flex wrap="wrap" gap={6} mb={8}>
        <StatBox label="Initiatives" value={initiativesCount} helpText="Events Created" />
        <StatBox label="Participation" value={totalParticipants} helpText="Total Participants" />
        <StatBox label="Safety" value="9.3" helpText="Total Score" />
      </Flex>

      {/* Satisfaction Rate Gauge */}
      <Box bg="bg.card" p={4} borderRadius="md" mb={6} borderWidth="1px" borderColor="gray.700">
        <Heading size="md" mb={2} color="white">
          Satisfaction Rate
        </Heading>
        <Text fontSize="sm" color="gray.300" mb={4}>
          From all projects (dummy data)
        </Text>
        <Flex justify="center" align="center">
          <Box width={{ base: '200px', md: '250px' }} height="250px">
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
          <Box ml={6}>
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
      <Box bg="bg.card" p={4} borderRadius="md" borderWidth="1px" borderColor="gray.700">
        <Heading size="md" mb={2} color="white">
          Active Participation — your NGO members
        </Heading>
        <Text fontSize="sm" color="gray.300" mb={4}>
          Number of participants per initiative
        </Text>
        <Box width="100%" height={{ base: '300px', md: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="gray" />
              <XAxis dataKey="name" stroke="#CBD5E0" />
              <YAxis stroke="#CBD5E0" />
              <Tooltip />
              <Bar dataKey="participants" fill="#63B3ED" /> {/* blue.300 */}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
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
      borderRadius="md"
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
