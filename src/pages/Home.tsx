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
import english from "../assets/icons/english_icon.svg";
import kannada from "../assets/icons/kannada_icon.svg";
import math from "../assets/icons/maths_icon.svg";
import physics from "../assets/icons/physics_icon.svg";
import Layout from "../components/common/layout/layout";
import CustomHeading from "../components/common/typography/Heading";
import { getProgramId, getSubjectList } from "../services/home";
import reelImg from "../assets/images/reel.png";
import reelImg2 from "../assets/images/reel2.png";
import { chunk } from "lodash";
import arrow from "../assets/icons/chevron_forward.svg";
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
const subjectIcons = {
  science: { icon: physics, label: "Science" },
  mathematics: { icon: math, label: "Math" },
  math: { icon: math, label: "Math" },
  english: { icon: english, label: "English" },
  kannada: { icon: kannada, label: "Kannada" },
};
export default function Homepage() {
  const { t } = useTranslation();
  const [subjects, setSubjects] = useState<Array<any>>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  useEffect(() => {
    const fetchProgramId = async () => {
      let storedSubject = localStorage.getItem("subject") || "";
      const programData = await getProgramId();
      if (programData) {
        const res: any = await getSubjectList();
        const subjectR = chunk(res, 4);
        if (!storedSubject && res.length > 0) {
          storedSubject = res[0]?.subject;
          localStorage.setItem("subject", storedSubject);
        }
        setSelectedSubject(storedSubject);
        setSubjects(subjectR);
      }
    };

    fetchProgramId();
  }, []);
  const handelSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    localStorage.setItem("subject", subject);
  };

  return (
    <Layout>
      <VStack spacing={10} align={"stretch"} px="4">
        {/* Learn Something Today Section */}
        <VStack pt="6" spacing={4}>
          <CustomHeading
            textAlign="center"
            lineHeight="20px"
            fontFamily="Inter"
            variant="h2"
            fontSize="20px"
            fontWeight="400"
            title={t("HOME_LEARN_SOMETHING_NOW")}
            color="textPrimary"
          />
          {subjects &&
            subjects.map((subject, index) => (
              <HStack
                key={`subject-${index}`}
                w="100%"
                divider={<StackDivider borderColor="gray.200" margin="0" />}
                justifyContent={"space-around"}
              >
                {subject &&
                  subject.map((sub: any) => (
                    <VStack
                      key={sub.subject}
                      spacing={3}
                      p="2.5"
                      onClick={() => handelSelectSubject(sub.subject)}
                      cursor="pointer"
                      rounded={
                        sub.subject === selectedSubject ? "1rem" : "none"
                      }
                      bg={
                        sub.subject === selectedSubject
                          ? "primary.50"
                          : "transparent"
                      }
                      border={
                        sub.subject === selectedSubject
                          ? "3px solid"
                          : "transparent"
                      }
                      borderColor={
                        sub.subject === selectedSubject
                          ? "primary.500"
                          : "borderColor"
                      }
                    >
                      {/* Render the specific image for each subject */}
                      <Image
                        boxSize="32px"
                        src={
                          subjectIcons[
                            sub.subject?.toLowerCase() as keyof typeof subjectIcons
                          ]?.icon || kannada
                        }
                        alt={`${sub.subject} icon`}
                      />
                      <CustomHeading
                        marginBottom="0"
                        textAlign="center"
                        lineHeight="11px"
                        fontSize="12px"
                        fontWeight="700"
                        textTransform="uppercase"
                        title={
                          subjectIcons[
                            sub.subject?.toLowerCase() as keyof typeof subjectIcons
                          ]?.label || sub.subject
                        }
                        color={"primary.500"}
                      />
                    </VStack>
                  ))}
              </HStack>
            ))}
        </VStack>
        {/* Watch Section */}
        <Box>
          {/* <HStack mb={2}>
            <Text fontSize="20px" fontWeight="bold" color="primary.500">
              {t("HOME_WATCH")}
            </Text>
            <Image src={arrow} alt="Arrow" boxSize="12px" />
          </HStack> */}
          <HStack spacing={4}>
            <VStack spacing={4}>
              {chunk(watchSectionData, 2).map((chunk, rowIndex) => (
                <HStack key={rowIndex} spacing={5}>
                  {chunk.map((item, index) => (
                    <Box
                      key={index}
                      position="relative"
                      borderRadius="9px"
                      overflow="hidden"
                      borderWidth="4px"
                      borderColor="borderColor"
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
