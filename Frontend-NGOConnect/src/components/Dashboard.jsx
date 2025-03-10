// src/components/Dashboard.jsx
import { Grid, GridItem, useBreakpointValue } from '@chakra-ui/react'
import FeatureCard from './FeatureCard'
import Banner from './Banner'
import { FaUsers, FaChartLine, FaMoneyBillWave, FaExclamationTriangle, FaHandshake, FaHeadset } from 'react-icons/fa'

const features = [
  {
    title: 'Organise an initiative',
    subtitle: '',
    icon: FaUsers,
    buttonText: 'Organise',
    buttonColor: 'red.500',
  },
  {
    title: 'NGO Activity',
    subtitle: 'Check your Organisations statistics',
    icon: FaChartLine,
    buttonText: 'View',
    buttonColor: 'teal.500',
  },
  {
    title: 'Grant Applications',
    subtitle: '',
    icon: FaMoneyBillWave,
    buttonText: 'Apply',
    buttonColor: 'red.500',
  },
  {
    title: 'Emergency',
    subtitle: 'Ask for collaboration in emergency cases',
    icon: FaExclamationTriangle,
    buttonText: 'Request',
    buttonColor: 'teal.500',
  },
  {
    title: 'Participate in an intiative',
    subtitle: '',
    icon: FaHandshake,
    buttonText: 'Participate',
    buttonColor: 'red.500',
  },
  {
    title: 'Support Center',
    subtitle: 'Report, Consult from our advisory team',
    icon: FaHeadset,
    buttonText: 'Contact',
    buttonColor: 'teal.500',
  },
]

function Dashboard() {
  // Responsive column count
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 })

  return (
    <>
      <Banner />
      <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6}>
        {features.map((feature, index) => (
          <GridItem key={index}>
            <FeatureCard {...feature} />
          </GridItem>
        ))}
      </Grid>
    </>
  )
}

export default Dashboard