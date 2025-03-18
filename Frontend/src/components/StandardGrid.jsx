// src/components/StandardGrid.jsx
import { Box, VStack, Heading } from '@chakra-ui/react';
import Banner from './Banner';
import FeatureCard from './FeatureCard';
import { FaUsers, FaChartLine, FaMoneyBillWave, FaExclamationTriangle, FaHandshake, FaHeadset } from 'react-icons/fa';

// Feature data
const features = [
  {
    title: 'Organise an initiative',
    subtitle: 'Create events & initiatives',
    icon: FaUsers,
    buttonText: 'Organise',
    buttonColor: 'brand.secondary',
    route: '/createevent',
  },
  {
    title: 'NGO Activity',
    subtitle: 'Check your Organisations statistics',
    icon: FaChartLine,
    buttonText: 'View',
    buttonColor: 'brand.primary',
    route: '/ngosummary',  // You'll need to create this route
  },
  {
    title: 'Grant Applications',
    subtitle: 'Apply for funding opportunities',
    icon: FaMoneyBillWave,
    buttonText: 'Apply',
    buttonColor: 'brand.secondary',
    route: '/grantapplications',  // You'll need to create this route
  },
  {
    title: 'Emergency',
    subtitle: 'Ask for collaboration in emergency cases',
    icon: FaExclamationTriangle,
    buttonText: 'Request',
    buttonColor: 'brand.primary',
    route: '/emergency',  // You'll need to create this route
  },
  {
    title: 'Participate in an initiative',
    subtitle: 'Join existing NGO events',
    icon: FaHandshake,
    buttonText: 'Participate',
    buttonColor: 'brand.secondary',
    route: '/participate',
  },
  {
    title: 'Support Center',
    subtitle: 'Report, Consult from our advisory team',
    icon: FaHeadset,
    buttonText: 'Contact',
    buttonColor: 'brand.primary',
    route: '/support',  // You'll need to create this route
  },
];

function StandardGrid() {
  return (
    <Box>
      <Heading mb={6} color="white" fontSize="2xl">NGO Services</Heading>
      
      <VStack spacing={6}>
        <Banner />
        
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} width="100%" />
        ))}
      </VStack>
    </Box>
  );
}

export default StandardGrid;