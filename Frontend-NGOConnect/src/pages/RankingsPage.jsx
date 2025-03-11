import React, { useContext, useState } from 'react';
import { 
  Box, 
  Container,
  Heading, 
  VStack, 
  HStack, 
  Text, 
  Avatar, 
  Flex,
  Badge,
  Divider,
  Center,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Button,
  Select,
  useColorModeValue
} from '@chakra-ui/react';
import { Medal, Award, Star, Search, ArrowLeft, SortDesc, SortAsc, Calendar } from 'lucide-react';
import { AuthContext } from '../contexts/Context';
import { useNavigate } from 'react-router-dom';

function RankingsPage() {
  const { userRankings, rankingsLoading } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [timeFrame, setTimeFrame] = useState('all');
  const navigate = useNavigate();
  
  // Badge icon based on position
  const getBadgeIcon = (index) => {
    switch(index) {
      case 0: return <Medal size={16} color="#FFD700" />;
      case 1: return <Medal size={16} color="#C0C0C0" />;
      case 2: return <Medal size={16} color="#CD7F32" />;
      default: return <Star size={16} color="#6B7280" />;
    }
  };
  
  // Determine badge type based on ranking
  const getBadgeType = (index) => {
    if (index === 0) return 'Gold';
    if (index === 1) return 'Silver';
    if (index === 2) return 'Bronze';
    return 'Member';
  };
  
  // Badge color based on badge type
  const getBadgeColor = (badgeType) => {
    switch(badgeType) {
      case 'Gold': return "yellow.400";
      case 'Silver': return "gray.400";
      case 'Bronze': return "orange.400";
      default: return "blue.400";
    }
  };

  // Filter users based on search term
  const filteredUsers = userRankings.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users based on points
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const pointsA = a.points || a.contributionPoints || 0;
    const pointsB = b.points || b.contributionPoints || 0;
    return sortOrder === 'desc' ? pointsB - pointsA : pointsA - pointsB;
  });

  return (
    <Container maxW="4xl" py={8}>
      <Box mb={6}>
        <HStack mb={6}>
          <IconButton
            icon={<ArrowLeft />}
            aria-label="Go back"
            variant="ghost"
            onClick={() => navigate(-1)}
          />
          <Heading color="white">User Rankings</Heading>
        </HStack>
        
        <Text color="gray.300" mb={6}>
          Explore the full list of contributors ranked by their impact and contributions to the platform.
        </Text>
        
        <HStack spacing={4} mb={6} flexWrap="wrap">
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <Search color="gray.300" />
            </InputLeftElement>
            <Input 
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              borderColor="gray.600"
            />
          </InputGroup>
          
          <Select 
            maxW="180px" 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            borderColor="gray.600"
          >
            <option value="desc">Highest Points</option>
            <option value="asc">Lowest Points</option>
          </Select>
          
          <Select 
            maxW="180px" 
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            borderColor="gray.600"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
            <option value="day">Today</option>
          </Select>
          
          <IconButton
            icon={sortOrder === 'desc' ? <SortDesc /> : <SortAsc />}
            aria-label="Toggle sort order"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            variant="outline"
          />
        </HStack>
      </Box>
      
      <Box 
        borderRadius="lg" 
        overflow="hidden" 
        boxShadow="lg" 
        bg="bg.card" 
        borderWidth="1px" 
        borderColor="gray.700"
      >
        <Box bg="rgba(0,0,0,0.3)" p={4} display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="md" color="white">
            {timeFrame === 'all' ? 'All-Time Rankings' : 
             timeFrame === 'month' ? 'This Month\'s Rankings' :
             timeFrame === 'week' ? 'This Week\'s Rankings' : 'Today\'s Rankings'}
          </Heading>
          <HStack>
            <Calendar size={16} color="gray.300" />
            <Text color="gray.300" fontSize="sm">
              {timeFrame === 'all' ? 'Since launch' : 
               timeFrame === 'month' ? 'Last 30 days' :
               timeFrame === 'week' ? 'Last 7 days' : 'Last 24 hours'}
            </Text>
          </HStack>
        </Box>
        
        <Divider borderColor="gray.700" />
        
        {rankingsLoading ? (
          <Center height="400px">
            <Spinner color="blue.400" size="lg" thickness="3px" />
          </Center>
        ) : sortedUsers.length === 0 ? (
          <Center height="400px" p={4} textAlign="center">
            <VStack>
              <Text color="gray.400">No users matching your search criteria</Text>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSearchTerm('')}
                  colorScheme="blue"
                >
                  Clear Search
                </Button>
              )}
            </VStack>
          </Center>
        ) : (
          <VStack spacing={0} divider={<Divider borderColor="gray.700" />} align="stretch" p={0}>
            {sortedUsers.map((user, index) => {
              const badgeType = getBadgeType(index);
              
              return (
                <HStack key={user._id || index} p={4} spacing={4} transition="all 0.2s" _hover={{ bg: "rgba(255,255,255,0.05)" }}>
                  <Text color="gray.400" fontWeight="bold" fontSize="lg" width="36px" textAlign="center">
                    {index + 1}
                  </Text>
                  
                  <Avatar 
                    size="md" 
                    src={user.avatar || user.profilePic} 
                    name={user.name} 
                  />
                  
                  <VStack align="start" spacing={1} flex={1}>
                    <Text color="white" fontWeight="medium" fontSize="lg">{user.name}</Text>
                    <HStack>
                      <Badge 
                        colorScheme={getBadgeColor(badgeType)} 
                        variant="subtle" 
                        display="flex" 
                        alignItems="center" 
                        px={2}
                        py={1}
                      >
                        {getBadgeIcon(index)}
                        <Text ml={1}>{badgeType}</Text>
                      </Badge>
                      {user.badges && user.badges.map((badge, i) => (
                        <Badge key={i} colorScheme="purple" variant="subtle">{badge}</Badge>
                      ))}
                    </HStack>
                  </VStack>
                  
                  <Flex direction="column" align="flex-end">
                    <Text color="white" fontWeight="bold" fontSize="xl">{user.points || user.contributionPoints}</Text>
                    <Text fontSize="sm" color="gray.400">contribution pts</Text>
                  </Flex>
                </HStack>
              );
            })}
          </VStack>
        )}
        
        <Box 
          p={4} 
          bg="rgba(0,0,0,0.3)" 
          textAlign="center"
          borderTop="1px"
          borderColor="gray.700"
        >
          <Text color="gray.300" fontSize="sm">
            <Award size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Rankings are updated daily based on user contributions
          </Text>
        </Box>
      </Box>
    </Container>
  );
}

export default RankingsPage;