// src/components/BentoGrid.jsx
import { Box, Grid, GridItem, Heading } from '@chakra-ui/react';
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
    gridArea: 'organize',
    route: '/createevent',
  },
  {
    title: 'NGO Activity',
    subtitle: 'Check your Organisations statistics',
    icon: FaChartLine,
    buttonText: 'View',
    buttonColor: 'brand.primary',
    gridArea: 'activity',
    route: '/ngosummary',  // You'll need to create this route
  },
  {
    title: 'Grant Applications',
    subtitle: 'Apply for funding opportunities',
    icon: FaMoneyBillWave,
    buttonText: 'Apply',
    buttonColor: 'brand.secondary',
    gridArea: 'grant',
    route: '/grantapplications',  // You'll need to create this route
  },
  {
    title: 'Emergency',
    subtitle: 'Ask for collaboration in emergency cases',
    icon: FaExclamationTriangle,
    buttonText: 'Request',
    buttonColor: 'brand.primary',
    gridArea: 'emergency',
    route: '/emergency',  // You'll need to create this route
  },
  {
    title: 'Participate in an initiative',
    subtitle: 'Join existing NGO events',
    icon: FaHandshake,
    buttonText: 'Participate',
    buttonColor: 'brand.secondary',
    gridArea: 'participate',
    route: '/participate',
  },
  {
    title: 'Support Center',
    subtitle: 'Report, Consult from our advisory team',
    icon: FaHeadset,
    buttonText: 'Contact',
    buttonColor: 'brand.primary',
    gridArea: 'support',
    route: '/support',  // You'll need to create this route
  },
];

function BentoGrid() {
  return (
    <Box>
      <Heading mb={6} color="white" fontSize="2xl">NGO Services</Heading>
      
      <Grid
        templateColumns="repeat(4, 1fr)"
        templateRows="repeat(3, auto)"
        gap={6}
        templateAreas={`
          "donate donate donate donate"
          "organize activity grant emergency"
          "participate participate support support"
        `}
      >
        <GridItem gridArea="donate">
          <Banner />
        </GridItem>
        
        {features.map((feature) => (
          <GridItem key={feature.gridArea} gridArea={feature.gridArea}>
            <FeatureCard {...feature} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}

export default BentoGrid;