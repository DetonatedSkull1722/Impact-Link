import React from 'react';
import { Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import Banner from '../components/Banner';
import { FaUsers, FaChartLine, FaMoneyBillWave, FaExclamationTriangle, FaHandshake, FaHeadset } from 'react-icons/fa';

// Add a route field for each feature to navigate to the appropriate page
const features = [
  {
    title: 'Organise an initiative',
    subtitle: '',
    icon: FaUsers,
    buttonText: 'Organise',
    buttonColor: 'red.500',
    route: '/createevent', // Navigates to event creation page
  },
  {
    title: 'NGO Activity',
    subtitle: 'Check your Organisations statistics',
    icon: FaChartLine,
    buttonText: 'View',
    buttonColor: 'teal.500',
    route: '/ngosummary', // Example route; adjust as needed
  },
  {
    title: 'Grant Applications',
    subtitle: '',
    icon: FaMoneyBillWave,
    buttonText: 'Apply',
    buttonColor: 'red.500',
    route: '/grantapplications', // Example route; adjust as needed
  },
  {
    title: 'Emergency',
    subtitle: 'Ask for collaboration in emergency cases',
    icon: FaExclamationTriangle,
    buttonText: 'Request',
    buttonColor: 'teal.500',
    route: '/emergency', // Example route; adjust as needed
  },
  {
    title: 'Participate in an initiative',
    subtitle: '',
    icon: FaHandshake,
    buttonText: 'Participate',
    buttonColor: 'red.500',
    route: '/participate', // Example route; adjust as needed
  },
  {
    title: 'Support Center',
    subtitle: 'Report, Consult from our advisory team',
    icon: FaHeadset,
    buttonText: 'Contact',
    buttonColor: 'teal.500',
    route: '/support', // Example route; adjust as needed
  },
];

function Dashboard() {
  const navigate = useNavigate();
  // Responsive column count based on screen size
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  return (
    <>
      <Banner />
      <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6}>
        {features.map((feature, index) => (
          <GridItem
            key={index}
            onClick={() => navigate(feature.route)}
            cursor="pointer"
            _hover={{ transform: 'scale(1.02)', transition: 'all 0.2s ease-in-out' }}
          >
            <FeatureCard {...feature} />
          </GridItem>
        ))}
      </Grid>
    </>
  );
}

export default Dashboard;
