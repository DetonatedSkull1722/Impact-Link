import React, { useContext } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Text, 
  Avatar, 
  Flex,
  Badge,
  Divider,
  Skeleton,
  Center,
  Spinner
} from '@chakra-ui/react';
import { Medal, Award, Star } from 'lucide-react';
import { AuthContext } from '../contexts/Context';

function UserRankings({ ...props }) {
  const { userRankings, rankingsLoading } = useContext(AuthContext);
  
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
    if (index >= 2) return 'Bronze';
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

  return (
    <Box 
      borderRadius="24px" 
      overflow="hidden" 
      boxShadow="lg" 
      bg="bg.card" 
      borderWidth="1px" 
      borderColor="gray.700"
      height="380px"
      position="relative"
      {...props}
    >
      <Box bg="rgba(0,0,0,0.3)" p={4}>
        <Heading size="md" color="white" mb={1}>Top Contributors</Heading>
        <Text fontSize="sm" color="gray.300">Users making the biggest impact</Text>
      </Box>
      
      <Divider borderColor="gray.700" />
      
      {rankingsLoading ? (
        <Center height="280px">
          <Spinner color="blue.400" size="lg" thickness="3px" />
        </Center>
      ) : userRankings.length === 0 ? (
        <Center height="280px" p={4} textAlign="center">
          <Text color="gray.400">No ranking data available yet</Text>
        </Center>
      ) : (
        <VStack spacing={0} divider={<Divider borderColor="gray.700" />} align="stretch" p={0} maxH="280px" overflowY="auto">
          {userRankings.map((user, index) => {
            const badgeType = getBadgeType(index);
            
            return (
              <HStack key={user._id || index} p={3} spacing={3} transition="all 0.2s" _hover={{ bg: "rgba(255,255,255,0.05)" }}>
                <Text color="gray.400" fontWeight="bold" fontSize="lg" width="24px" textAlign="center">
                  {index + 1}
                </Text>
                
                <Avatar 
                  size="sm" 
                  src={user.avatar || user.profilePic} 
                  name={user.name} 
                />
                
                <VStack align="start" spacing={0} flex={1}>
                  <Text color="white" fontWeight="medium">{user.name}</Text>
                  <HStack>
                    <Badge 
                      colorScheme={getBadgeColor(badgeType)} 
                      variant="subtle" 
                      display="flex" 
                      alignItems="center" 
                      px={2}
                      fontSize="xs"
                    >
                      {getBadgeIcon(index)}
                      <Text ml={1}>{badgeType}</Text>
                    </Badge>
                  </HStack>
                </VStack>
                
                <Flex direction="column" align="flex-end">
                  <Text color="white" fontWeight="bold">{user.points || user.contributionPoints}</Text>
                  <Text fontSize="xs" color="gray.400">contribution pts</Text>
                </Flex>
              </HStack>
            );
          })}
        </VStack>
      )}
      
      <Box 
        position="absolute" 
        bottom={0} 
        width="100%" 
        p={3} 
        bg="rgba(0,0,0,0.3)" 
        textAlign="center"
        borderTop="1px"
        borderColor="gray.700"
      >
        <Text color="gray.300" fontSize="sm">
          <Award size={14} style={{ display: 'inline', marginRight: '4px' }} />
          Updated daily based on contributions
        </Text>
      </Box>
    </Box>
  );
}

export default UserRankings;