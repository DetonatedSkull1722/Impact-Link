import React, { useContext } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { AuthContext } from '../contexts/Context'; // Import AuthContext
import { useNavigate } from 'react-router-dom'; // To redirect after logout

function ProfileHoverCard() {
  const { userInfo, setUserInfo } = useContext(AuthContext); // Get user info from context
  const navigate = useNavigate(); // Hook for navigation

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove session token
    setUserInfo(null); // Clear user context
    navigate('/'); // Redirect to login page
  };

  return (
    <Box
      position="absolute"
      top="40px"
      right="0"
      bg="white"
      color="black"
      p={4}
      borderRadius="md"
      boxShadow="lg"
      zIndex="popover"
      minW="200px"
    >
      {userInfo ? (
        <>
          <Text fontWeight="bold">{userInfo.name || 'User'}</Text>
          <Text fontSize="sm" color="gray.600">
            Points: {userInfo.participationPoints || 0}
          </Text>
          <Button
            size="sm"
            mt={3}
            colorScheme="red"
            w="full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      ) : (
        <Text fontSize="sm" color="gray.600">
          Not logged in
        </Text>
      )}
    </Box>
  );
}

export default ProfileHoverCard;
