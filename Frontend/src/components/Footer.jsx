// src/components/Footer.jsx
import { Box, Text, Center, HStack, Icon, Link } from '@chakra-ui/react'
import { FaTwitter, FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa'

function Footer() {
  return (
    <Box bg="bg.secondary" color="gray.400" py={6} mt={8} borderTop="1px solid" borderColor="gray.700">
      <Center flexDirection="column">
        <HStack spacing={4} mb={3}>
          <Link href="#" _hover={{ color: 'white' }}>
            <Icon as={FaTwitter} boxSize={5} />
          </Link>
          <Link href="#" _hover={{ color: 'white' }}>
            <Icon as={FaFacebook} boxSize={5} />
          </Link>
          <Link href="#" _hover={{ color: 'white' }}>
            <Icon as={FaInstagram} boxSize={5} />
          </Link>
          <Link href="#" _hover={{ color: 'white' }}>
            <Icon as={FaGithub} boxSize={5} />
          </Link>
        </HStack>
        <Text fontSize="sm">© 2025 Cluster NGO. All rights reserved.</Text>
      </Center>
    </Box>
  )
}

export default Footer