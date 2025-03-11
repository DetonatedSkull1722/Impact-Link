// src/components/UserRanking.jsx
import React from 'react';
import { Box, VStack, Heading, Flex, Text, Avatar, Divider } from '@chakra-ui/react';

const mockUsers = [
  { id: 1, name: 'Sarah Johnson', points: 1250, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150' },
  { id: 2, name: 'David Chen', points: 980, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150' },
  { id: 3, name: 'Maria Rodriguez', points: 840, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150' },
  { id: 4, name: 'James Wilson', points: 720, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150' },
];

function UserRanking() {
  return (
    <Box
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="20px"
      overflow="hidden"
      bg="bg.card"
      boxShadow="lg"
      p={4}
      height="100%"
    >
      <Heading size="md" mb={4} color="white">Top Contributors</Heading>
      
      <VStack spacing={3} align="stretch">
        {mockUsers.map((user, index) => (
          <React.Fragment key={user.id}>
            <Flex align="center" justify="space-between">
              <Flex align="center">
                <Text fontWeight="bold" color={index === 0 ? "yellow.400" : index === 1 ? "gray.300" : index === 2 ? "orange.400" : "white"} mr={2}>
                  #{index + 1}
                </Text>
                <Avatar size="sm" src={user.avatar} mr={3} />
                <Text color="white" fontSize="sm" noOfLines={1}>{user.name}</Text>
              </Flex>
              <Text color="brand.primary" fontWeight="bold">{user.points}</Text>
            </Flex>
            {index < mockUsers.length - 1 && <Divider borderColor="gray.700" />}
          </React.Fragment>
        ))}
      </VStack>
    </Box>
  );
}

export default UserRanking;