// src/components/Banner.jsx
import { Box, Image, Heading, Text, Flex } from '@chakra-ui/react'

function Banner() {
  return (
    <Box 
      borderRadius="24px" 
      overflow="hidden" 
      mb={6}
      boxShadow="lg"
      position="relative"
      height="240px"
    >
      <Image 
        src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&h=400&fit=crop" 
        alt="Donation Banner" 
        width="100%" 
        height="100%"
        objectFit="cover"
        filter="brightness(0.7)"
      />
      <Flex
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        direction="column"
        justify="center"
        align="center"
        p={6}
        textAlign="center"
        bg="rgba(0,0,0,0.4)"
      >
        <Heading size="xl" mb={3} color="white">Make a Difference Today</Heading>
        <Text color="white" fontSize="lg">Your contribution can help change lives around the world</Text>
      </Flex>
    </Box>
  )
}

export default Banner