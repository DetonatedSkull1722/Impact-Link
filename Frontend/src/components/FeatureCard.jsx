import { Box, Flex, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function FeatureCard({ title, subtitle, icon, buttonText, buttonColor, route, ...rest }) {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    if (route) navigate(route);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent the card click event
    if (route) navigate(route);
  };

  return (
    <Box
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
      cursor={route ? "pointer" : "default"}
      _hover={{
        transform: route ? "translateY(-5px)" : "none",
        boxShadow: "xl",
        borderColor: buttonColor,
      }}
      onClick={handleCardClick}
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
        colorScheme={buttonColor.split('.').length > 1 ? buttonColor.split('.')[0] : buttonColor}
        rightIcon={<span>→</span>}
        alignSelf="flex-start"
        size="sm"
        borderRadius="12px"
        onClick={handleButtonClick}
      >
        {buttonText}
      </Button>
    </Box>
  );
}

export default FeatureCard;