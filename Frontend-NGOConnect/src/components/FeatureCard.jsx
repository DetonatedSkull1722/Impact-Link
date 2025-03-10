// src/components/FeatureCard.jsx
import { Box, Flex, Heading, Text, Button, Icon } from '@chakra-ui/react'
import { useNavigate } from 'react-router'

function FeatureCard({ title, subtitle, icon, buttonText, buttonColor, route, ...rest }) {
 const navigate = useNavigate();
  return (
    <Box 
      onClick={rest.onClick}
      borderWidth="1px" 
      borderColor="gray.700"
      borderRadius="20px" 
      overflow="hidden"
      bg="bg.card"
      boxShadow="lg"
      p={5}
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      transition="all 0.3s"
      _hover={{ 
        transform: "translateY(-5px)",
        boxShadow: "xl",
        borderColor: buttonColor 
      }}
      {...rest}
    >
      <Box>
        <Flex align="center" mb={4}>
          <Icon as={icon} boxSize={6} mr={3} color={buttonColor} />
          <Heading size="md" color="white">{title}</Heading>
        </Flex>
        {subtitle && <Text color="gray.400" fontSize="sm">{subtitle}</Text>}
      </Box>
      <Button 
        mt={4}
        colorScheme={buttonColor.split('.')[1]} 
        rightIcon={<span>→</span>}
        alignSelf="flex-start"
        size="sm"
        borderRadius="12px"
        onClick={(e) => {
          e.stopPropagation(); // Prevents the click from bubbling to parent elements
          onClick();
        }}
      >
        {buttonText}
    </Button>
    </Box>
  )
}

export default FeatureCard