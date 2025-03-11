import React, { useContext, useState, useEffect } from 'react';
import { Box, Heading, Text, Image, Flex, Skeleton } from '@chakra-ui/react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/Context';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MotionBox = motion(Box);

function EventCarousel() {
  const { drives } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    // Simulate loading of content
    if (drives.length > 0) {
      setLoading(false);
    }
  }, [drives]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    adaptiveHeight: false,
    centerMode: true,
    centerPadding: '0',
    beforeChange: (current, next) => setCurrentSlide(next),
    cssEase: "cubic-bezier(0.45, 0, 0.55, 1)",
    dotsClass: "slick-dots custom-dots",
  };

  // Custom arrow components
  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "15px", zIndex: 1 }}
        onClick={onClick}
      />
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: "15px", zIndex: 1 }}
        onClick={onClick}
      />
    );
  };

  return (
    <Box mb={8} maxW="800px" mx="auto">
      <Heading mb={4} color="white" fontSize="2xl">Nearby Events</Heading>
      <Box 
        borderRadius="24px" 
        overflow="hidden" 
        boxShadow="lg" 
        bg="bg.card" 
        borderWidth="1px" 
        borderColor="gray.700"
        height="380px"
      >
        {loading ? (
          <Skeleton height="380px" width="100%" startColor="gray.700" endColor="gray.600" />
        ) : (
          <Slider {...settings} nextArrow={<NextArrow />} prevArrow={<PrevArrow />}>
            {drives.length > 0 ? (
              drives.map((event, index) => (
                <Box key={event._id} position="relative" height="380px">
                  <Image 
                    src={event.imageUrl || 'https://via.placeholder.com/800x380'}
                    alt={event.title}
                    width="100%"
                    height="380px"
                    objectFit="cover"
                    opacity="0.85"
                    transition="all 0.5s ease"
                  />
                  <MotionBox
                    position="absolute"
                    bottom="0"
                    width="100%"
                    bg="rgba(0,0,0,0.75)"
                    color="white"
                    p={4}
                    backdropFilter="blur(8px)"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ 
                      y: 0, 
                      opacity: 1,
                      transition: { 
                        delay: 0.2,
                        duration: 0.5
                      }
                    }}
                  >
                    <Heading size="md" mb={2}>{event.title}</Heading>
                    <Flex justify="space-between" mt={2}>
                      <Text fontSize="sm">{event.location}</Text>
                      <Text fontSize="sm">
                        {new Date(event.startDate).toLocaleDateString()}
                      </Text>
                    </Flex>
                    <Text 
                      fontSize="sm" 
                      fontStyle="italic" 
                      mt={2} 
                      color="gray.300"
                    >
                      Organized by: {event.createdBy?.name || "Unknown NGO"}
                    </Text>
                  </MotionBox>
                </Box>
              ))
            ) : (
              <Box textAlign="center" p={6} color="gray.400" height="380px" display="flex" alignItems="center" justifyContent="center">
                <Text>No events available.</Text>
              </Box>
            )}
          </Slider>
        )}
      </Box>
      
      {/* Add some custom CSS for better dots */}
      <style jsx global>{`
        .custom-dots {
          bottom: 10px;
        }
        .custom-dots li button:before {
          font-size: 8px;
          color: white;
          opacity: 0.5;
        }
        .custom-dots li.slick-active button:before {
          color: white;
          opacity: 1;
        }
        .slick-prev:before, .slick-next:before {
          font-size: 24px;
          opacity: 0.8;
        }
        .slick-slide {
          transition: transform 0.5s ease;
        }
      `}</style>
    </Box>
  );
}

export default EventCarousel;