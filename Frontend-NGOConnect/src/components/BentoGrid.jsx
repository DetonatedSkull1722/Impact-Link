// src/components/BentoGrid.jsx
import { Box, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import Banner from './Banner'
import FeatureCard from './FeatureCard'
import { FaUsers, FaChartLine, FaMoneyBillWave, FaExclamationTriangle, FaHandshake, FaHeadset } from 'react-icons/fa'

// Feature data
const features = [
  {
    title: 'Organise an initiative',
    subtitle: '',
    icon: FaUsers,
    buttonText: 'Organise',
    buttonColor: 'brand.secondary',
    gridArea: 'organize',
  },
  {
    title: 'NGO Activity',
    subtitle: 'Check your Organisations statistics',
    icon: FaChartLine,
    buttonText: 'View',
    buttonColor: 'brand.primary',
    gridArea: 'activity',
  },
  {
    title: 'Grant Applications',
    subtitle: '',
    icon: FaMoneyBillWave,
    buttonText: 'Apply',
    buttonColor: 'brand.secondary',
    gridArea: 'grant',
  },
  {
    title: 'Emergency',
    subtitle: 'Ask for collaboration in emergency cases',
    icon: FaExclamationTriangle,
    buttonText: 'Request',
    buttonColor: 'brand.primary',
    gridArea: 'emergency',
  },
  {
    title: 'Participate in an intiative',
    subtitle: '',
    icon: FaHandshake,
    buttonText: 'Participate',
    buttonColor: 'brand.secondary',
    gridArea: 'participate',
  },
  {
    title: 'Support Center',
    subtitle: 'Report, Consult from our advisory team',
    icon: FaHeadset,
    buttonText: 'Contact',
    buttonColor: 'brand.primary',
    gridArea: 'support',
  },
]

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
  )
}

export default BentoGrid