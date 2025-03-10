// src/components/Header.jsx
import { Box, Flex, Heading, Avatar, IconButton, useBreakpointValue } from '@chakra-ui/react'
import { FaBars } from 'react-icons/fa'

function Header() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box 
      bg="bg.secondary" 
      color="white" 
      px={4} 
      py={4} 
      borderBottom="1px solid" 
      borderColor="gray.700"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">Cluster NGO</Heading>
        {isMobile ? (
          <IconButton
            icon={<FaBars />}
            variant="ghost"
            color="white"
            aria-label="Menu"
            _hover={{ bg: 'gray.700' }}
          />
        ) : (
          <Flex alignItems="center">
            <Avatar 
              size="sm" 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop" 
              border="2px solid" 
              borderColor="brand.primary"
            />
          </Flex>
        )}
      </Flex>
    </Box>
  )
}

export default Header