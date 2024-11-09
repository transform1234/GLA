import {
  Badge,
  Box,
  HStack,
  Image,
  Link,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import english from "../assets/icons/english_icon.png";
import kannada from "../assets/icons/kannada_icon.png";
import math from "../assets/icons/maths_icon.png";
import physics from "../assets/icons/physics_icon.png";
import Layout from "../components/common/layout/layout";
import CustomHeading from "../components/common/typography/Heading";
import { getProgramId, getSubjectList } from "../services/home";
import reelImg from "../assets/images/reel.png";
import reelImg2 from "../assets/images/reel2.png";
import { chunkArray } from "../utils/helper";

const watchSectionData: Array<any> = [
  {
    category: ["Math", "Mixed Fraction"],
    src: reelImg,
    alt: "Lesson",
    title: "Learn easy mixed fraction",
  },
  {
    category: ["Science", "Human Evolution"],
    src: reelImg2,
    alt: "Lesson",
    title: "Evolution of human species",
  },
  {
    category: ["Science", "Human Evolution"],
    src: reelImg,
    alt: "Lesson",
    title: "Evolution of human species",
  },
  {
    category: ["Science", "Human Evolution"],
    src: reelImg2,
    alt: "Lesson",
    title: "Evolution of human species",
  },
];

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
      <VStack spacing={4} align={"stretch"} px="4">
        {/* Learn Something Today Section */}
        <VStack pt="6" spacing={4}>
          <CustomHeading
            textAlign="center"
            lineHeight="20px"
            fontFamily="Inter"
            variant="h2"
            fontSize="20px"
            fontWeight="400"
            title={t("HOME_LEARN_SOMETHING_TODAY")}
            color="primary.500"
          />

          <HStack
            w="100%"
            divider={<StackDivider borderColor="gray.200" margin="0" />}
            justifyContent={"space-around"}
          >
            {subject &&
              subject.map((sub, index) => (
                <VStack key={sub.subject} spacing={4} p="3" maxW={"120px"}>
                  {/* Render the specific image for each subject */}
                  <Image
                    boxSize="32px"
                    src={
                      subjectIcons[sub.subject as keyof typeof subjectIcons] ||
                      kannada
                    }
                    alt={`${sub.subject} icon`}
                  />
                  <CustomHeading
                    textAlign="center"
                    lineHeight="20px"
                    fontSize="20px"
                    fontWeight="700"
                    title={sub.subject}
                    color="textPrimary"
                  />
                </VStack>
              ))}
          </HStack>
        </VStack>
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
            <VStack spacing={4}>
              {chunkArray(watchSectionData, 2).map((chunk, rowIndex) => (
                <HStack key={rowIndex} spacing={5}>
                  {chunk.map((item, index) => (
                    <Box
                      key={index}
                      position="relative"
                      borderRadius="md"
                      overflow="hidden"
                    >
                      <Image src={item.src} alt={item.alt} borderRadius="md" />
                      <Box
                        padding={3}
                        position="absolute"
                        bottom={0}
                        width="100%"
                        bg="linear-gradient(to top, rgba(0, 0, 0, 1), transparent)"
                      >
                        <Text
                          color="white"
                          fontSize="sm"
                          py={1}
                          textAlign="left"
                        >
                          {item.title}
                        </Text>
                        {Array.isArray(item.category) &&
                          item.category.map((cat: any, catIndex: number) => (
                            <Badge
                              key={catIndex}
                              colorScheme="whiteAlpha"
                              bg="whiteAlpha.300"
                              borderColor="white"
                              borderWidth="0"
                              mx="1"
                              fontSize="12px"
                              fontWeight="400"
                              color="white"
                            >
                              {cat}
                            </Badge>
                          ))}
                      </Box>
                    </Box>
                  ))}
                </HStack>
              ))}
            </VStack>
          </HStack>
        </Box>
      </VStack>
    </Layout>
  );
}
