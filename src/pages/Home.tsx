import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import english from "../assets/icons/english_icon.png";
import kannada from "../assets/icons/kannada_icon.png";
import math from "../assets/icons/maths_icon.png";
import physics from "../assets/icons/physics_icon.png";
import background from "../assets/images/home-bg.png";
import transformSchool from "../assets/logo/SG_Transform Schools_Logo.png";
import Footer from "../components/common/footer/Footer";
import Layout from "../components/common/layout/layout";
import CustomHeading from "../components/common/typography/Heading";
import { getProgramId, getSubjectList } from "../services/home";
export default function Homepage() {
  const { t } = useTranslation();
  const [subject, setSubject] = useState<Array<any>>([]);
  const subjectIcons = {
    Science: physics,
    Mathematics: math,
    English: english,
    Kannada: kannada,
  };
  const [activeIcon, setActiveIcon] = useState("home");
  useEffect(() => {
    const fetchProgramId = async () => {
      const programData = await getProgramId();
      if (programData) {
        const res: any = await getSubjectList();
        setSubject(res);
      }
    };

    fetchProgramId();
  }, []);

  return (
    <Layout>
      <Center bg="gray.50" pb="80px">
        <Box w="100%">
          {/* Header Section */}
          <Box backgroundImage={`url(${background})`} paddingX="4">
            <VStack align="flex-start" spacing={2}>
              {/* Logo Section */}
              <Box
                backgroundImage={`url(${transformSchool})`}
                backgroundRepeat="no-repeat"
                backgroundSize="contain"
                mt="52px"
                width="50%"
                height="50px"
              />

              {/* Greeting Text */}
              <VStack align="flex-start" spacing={1}>
                <CustomHeading
                  lineHeight="21px"
                  fontFamily="Inter"
                  variant="h2"
                  fontSize="12px"
                  fontWeight="400"
                  title={t("HOME_GOOD_EVENING")}
                  color="white"
                />
                <CustomHeading
                  lineHeight="21px"
                  fontFamily="Inter"
                  variant="h2"
                  fontSize="20px"
                  fontWeight="600"
                  title={localStorage.getItem("name")}
                  color="white"
                />
              </VStack>

              {/* Search Input */}
              <InputGroup mb="4" height="28px">
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon color="textSecondary" />}
                />
                <Input
                  placeholder="Search..."
                  bg="white"
                  borderColor="backgroundGrey"
                />
              </InputGroup>
            </VStack>
          </Box>

          {/* Learn Something Today Section */}
          <Box mt={6}>
            <CustomHeading
              marginBottom="16px"
              textAlign="center"
              lineHeight="20px"
              fontFamily="Inter"
              variant="h2"
              fontSize="20px"
              fontWeight="400"
              title={t("HOME_LEARN_SOMETHING_TODAY")}
              color="primary.500"
            />

            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
              {subject &&
                subject.map((sub, index) => (
                  <GridItem key={sub.subject} position="relative">
                    <VStack spacing={1}>
                      {/* Render the specific image for each subject */}
                      <Image
                        boxSize="32px"
                        src={
                          subjectIcons[
                            sub.subject as keyof typeof subjectIcons
                          ] || kannada
                        }
                        alt={`${sub.subject} icon`}
                      />
                      <CustomHeading
                        textAlign="center"
                        lineHeight="20px"
                        fontFamily="Inter"
                        variant="h2"
                        fontSize="20px"
                        fontWeight="700"
                        title={sub.subject}
                        color="textPrimary"
                      />
                    </VStack>
                    {/* Vertical divider */}
                    {index < subject.length - 1 && (
                      <Box
                        position="absolute"
                        top="0"
                        right="-2"
                        height="100%"
                        width="1px"
                        bgColor="textSecondary"
                      />
                    )}
                  </GridItem>
                ))}
            </Grid>
          </Box>
          {/* Watch Section */}
          <Box mt={6}>
            <HStack justifyContent="space-between" mb={2}>
              <Text fontSize="lg" fontWeight="bold" color="textPrimary">
                Watch
              </Text>
              <Link fontSize="sm" color="primary.500">
                See all
              </Link>
            </HStack>
            <HStack spacing={4}>
              <Box w="100px" h="150px" bg="backgroundGrey" borderRadius="md">
                <Image
                  src="/path-to-image-1.jpg"
                  alt="Lesson"
                  borderRadius="md"
                />
                <Text
                  fontSize="sm"
                  textAlign="center"
                  mt={2}
                  color="textSecondary"
                >
                  Learn easy mixed fraction
                </Text>
              </Box>
              <Box w="100px" h="150px" bg="backgroundGrey" borderRadius="md">
                <Image
                  src="/path-to-image-2.jpg"
                  alt="Lesson"
                  borderRadius="md"
                />
                <Text
                  fontSize="sm"
                  textAlign="center"
                  mt={2}
                  color="textSecondary"
                >
                  Evolution of human species
                </Text>
              </Box>

              <Box w="100px" h="150px" bg="backgroundGrey" borderRadius="md">
                <Image
                  src="/path-to-image-2.jpg"
                  alt="Lesson"
                  borderRadius="md"
                />
                <Text
                  fontSize="sm"
                  textAlign="center"
                  mt={2}
                  color="textSecondary"
                >
                  Evolution of human species
                </Text>
              </Box>
            </HStack>
          </Box>

          {/* Footer Navigation */}

          <Footer activeIcon={activeIcon} />
        </Box>
      </Center>
    </Layout>
  );
}
