import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Image,
  Icon,
  Grid,
  GridItem,
  Link,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaHome, FaTrophy, FaVideo, FaBookOpen, FaUser } from "react-icons/fa";
import background from '../assets/images/home-bg.png';
import transformSchool from '../assets/logo/SG_Transform Schools_Logo.png';
import { useTranslation } from 'react-i18next';
import { getProgramId, getSubjectList } from "../services/home/home";
import english from '../assets/icons/english_icon.png';
import physics from '../assets/icons/physics_icon.png';
import math from '../assets/icons/maths_icon.png';
import kannada from '../assets/icons/kannada_icon.png';

export default function Homepage() {
  const { t } = useTranslation();
  const [subject, setSubject] = useState();
  const subjectIcons = {
    Science: physics,
    Mathematics: math,
    English: english,
    Kannada: kannada,

  };


  useEffect(() => {
    const fetchProgramId = async () => {
      const programData = await getProgramId();
      if (programData) {
        const res: any = await getSubjectList()
        setSubject(res)
      }
    };

    fetchProgramId();
  }, []);


  return (
    <Center bg="gray.50">
      <Box w="100%">
        {/* Header Section */}
        <Box backgroundImage={`url(${background})`} paddingX="4">
          <VStack align="flex-start" spacing={2}>

            {/* Logo Section */}
            <Box
              backgroundImage={`url(${transformSchool})`}
              backgroundRepeat="no-repeat"
              backgroundSize="contain"
              mt="10px"
              width="50%"
              height="100px"
            />

            {/* Greeting Text */}
            <VStack align="flex-start" spacing={1}>
              <Text fontSize="xl" color="brand.white" fontWeight="bold">
                {t("GOOD_EVENING")}
              </Text>
              <Text fontSize="xl" color="brand.white" fontWeight="bold">
                {localStorage.getItem("name")}
              </Text>
            </VStack>

            {/* Search Input */}
            <InputGroup mb="4">
              <InputLeftElement pointerEvents="none" children={<SearchIcon color="brand.textSecondary" />} />
              <Input placeholder="Search..." bg="white" borderColor="brand.backgroundGrey" />
            </InputGroup>

          </VStack>
        </Box>



        {/* Learn Something Today Section */}
        <Box mt={6}>
          <Text fontSize="20px" fontFamily="Inter" color="brand.primary" mb={3}>
            Learn Something Today
          </Text>
          <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            {subject && subject.map((sub, index) => (
              <GridItem key={sub.subject} position="relative">
                <VStack spacing={1}>
                  {/* Render the specific image for each subject */}
                  <Image
                    boxSize="32px" // Adjust size as needed
                    src={subjectIcons[sub.subject] || kannada} // Access the icon based on the subject
                    alt={`${sub.subject} icon`}
                  />
                  <Text fontSize="sm" color="brand.textSecondary">{sub.subject}</Text>
                </VStack>
                {/* Vertical divider */}
                {index < subject.length - 1 && (
                  <Box
                    position="absolute"
                    top="0"
                    right="-2" // Adjust to center divider
                    height="100%"
                    width="1px"
                    bgColor="brand.textSecondary" // Change color as needed
                  />
                )}
              </GridItem>
            ))}
          </Grid>
        </Box>
        {/* Watch Section */}
        <Box mt={6}>
          <HStack justifyContent="space-between" mb={2}>
            <Text fontSize="lg" fontWeight="bold" color="brand.textPrimary">
              Watch
            </Text>
            <Link fontSize="sm" color="brand.primary">See all</Link>
          </HStack>
          <HStack spacing={4}>
            <Box w="100px" h="150px" bg="brand.backgroundGrey" borderRadius="md">
              <Image src="/path-to-image-1.jpg" alt="Lesson" borderRadius="md" />
              <Text fontSize="sm" textAlign="center" mt={2} color="brand.textSecondary">Learn easy mixed fraction</Text>
            </Box>
            <Box w="100px" h="150px" bg="brand.backgroundGrey" borderRadius="md">
              <Image src="/path-to-image-2.jpg" alt="Lesson" borderRadius="md" />
              <Text fontSize="sm" textAlign="center" mt={2} color="brand.textSecondary">Evolution of human species</Text>
            </Box>
          </HStack>
        </Box>

        {/* Footer Navigation */}
        <HStack spacing={8} mt={6} justifyContent="space-around" bg="white" py={3} borderTopRadius="md" boxShadow="sm">
          <Icon as={FaHome} boxSize="6" color="brand.primary" />
          <Icon as={FaTrophy} boxSize="6" color="brand.textSecondary" />
          <Icon as={FaVideo} boxSize="6" color="brand.textSecondary" />
          <Icon as={FaBookOpen} boxSize="6" color="brand.textSecondary" />
          <Icon as={FaUser} boxSize="6" color="brand.textSecondary" />
        </HStack>
      </Box>
    </Center>
  );
}
