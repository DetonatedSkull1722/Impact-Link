import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Avatar, 
  IconButton, 
  useBreakpointValue,
  Text,
  HStack,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { FaBars, FaBell, FaRegBookmark } from 'react-icons/fa';
import ProfileHoverCard from './ProfileHoverCard';

function Header() {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Subtle gradient for header background
  const headerBg = "linear-gradient(to right, #1a202c, #2d3748)";
  const glowColor = "rgba(66, 153, 225, 0.15)"; // Subtle blue glow

  return (
    <Box 
      bg={headerBg}
      color="white" 
      px={4} 
      py={3} 
      borderBottom="1px solid" 
      borderColor="gray.700" 
      position="sticky" 
      top="0" 
      zIndex="sticky"
      boxShadow="0 2px 10px rgba(0, 0, 0, 0.3)"
      borderRadius="16px 16px"
    >
      <Container maxW="1200px">
        <Flex justifyContent="space-between" alignItems="center">
          <HStack spacing={2} align="center">
            <Heading 
              size="lg" 
              bgGradient="linear(to-r, teal.400, blue.500)" 
              bgClip="text" 
              letterSpacing="tight"
              fontWeight="extrabold"
            >
              IMPACT LINK
            </Heading>
            <Box 
              h="8px" 
              w="8px" 
              borderRadius="full" 
              bg="green.400" 
              boxShadow={`0 0 8px ${glowColor}`} 
              ml={1} 
              display={{ base: 'none', md: 'block' }}
            />
          </HStack>
          
          {isMobile ? (
            <IconButton
              icon={<FaBars />}
              variant="ghost"
              color="white"
              aria-label="Menu"
              _hover={{ bg: 'whiteAlpha.200' }}
              _active={{ bg: 'whiteAlpha.300' }}
              size="md"
            />
          ) : (
            <HStack spacing={6}>
              <HStack spacing={4} color="gray.300">
                <IconButton
                  icon={<FaBell />}
                  variant="ghost"
                  color="gray.300"
                  aria-label="Notifications"
                  _hover={{ color: 'white', bg: 'whiteAlpha.200' }}
                  size="sm"
                  borderRadius="full"
                />
                <IconButton
                  icon={<FaRegBookmark />}
                  variant="ghost"
                  color="gray.300"
                  aria-label="Saved Items"
                  _hover={{ color: 'white', bg: 'whiteAlpha.200' }}
                  size="sm"
                  borderRadius="full"
                />
              </HStack>
              
              <Flex
                alignItems="center"
                position="relative"
                onMouseEnter={() => setShowProfileCard(true)}
                onMouseLeave={() => setShowProfileCard(false)}
              >
                <Box 
                  position="relative" 
                  transition="transform 0.2s"
                  _hover={{ transform: 'scale(1.05)' }}
                >
                  <Avatar 
                    size="sm" 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop" 
                    border="2px solid" 
                    borderColor="teal.400"
                    boxShadow={`0 0 10px ${glowColor}`}
                  />
                  <Box 
                    position="absolute" 
                    bottom="-1px" 
                    right="-1px" 
                    w="10px" 
                    h="10px" 
                    bg="green.400" 
                    borderRadius="full" 
                    border="2px solid"
                    borderColor="gray.800"
                  />
                </Box>
                {showProfileCard && <ProfileHoverCard />}
              </Flex>
            </HStack>
          )}
        </Flex>
      </Container>
    </Box>
  );
}

export default Header;