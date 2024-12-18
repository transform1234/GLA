import {
  Badge,
  Box,
  Grid,
  GridItem,
  HStack,
  Image,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import english from "../assets/icons/english_icon.svg";
import kannada from "../assets/icons/kannada_icon.svg";
import odia from "../assets/icons/odia_icon.svg";
import math from "../assets/icons/maths_icon.svg";
import physics from "../assets/icons/physics_icon.svg";
import Layout from "../components/common/layout/layout";
import CustomHeading from "../components/common/typography/Heading";
import { getProgramId, getSubjectList } from "../services/home";
import { chunk } from "lodash";
import { useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../services/content";
import defaultImage from "../assets/images/default-img.png"; // add default image

const subjectIcons = {
  science: { icon: physics, label: "Science" },
  mathematics: { icon: math, label: "Math" },
  math: { icon: math, label: "Math" },
  english: { icon: english, label: "English" },
  kannada: { icon: kannada, label: "Kannada" },
  odia: { icon: odia, label: "Odia" },
};
export default function Homepage() {
  const { t } = useTranslation();
  const [subjects, setSubjects] = useState<Array<any>>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null); // set null
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgramId = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchProgramId();
  }, []);

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    localStorage.setItem("subject", subject);
    fetchSuggestions();
  };

  const fetchSuggestions = async () => {
    const payload = {
      searchQuery: searchTerm,
      programId: localStorage.getItem("programID"),
      subject: localStorage.getItem("subject"),
      limit: 5,
    };

    try {
      const response = await fetchSearchResults(payload);
      setSuggestions(response?.paginatedData || []);
      setVideos(
        response?.paginatedData?.map((item: any) => ({
          src: item.img
            ? `/path/to/image/${item?.contentId}.jpg`
            : defaultImage,
          alt: item?.name,
          name: item?.name,
          category: [item?.subject],
          contentId: item?.contentId,
        }))
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setVideos([]);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [searchTerm]);

  useEffect(() => {
    const storedSubject = localStorage.getItem("subject");
    if (storedSubject) {
      handleSelectSubject(storedSubject);
    }

    fetchSuggestions();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const payload = {
        searchQuery: searchTerm,
        programId: localStorage.getItem("programID"),
        subject: localStorage.getItem("subject"),
        limit: 5,
      };
      try {
        const response = await fetchSearchResults(payload);
        setSuggestions(response?.paginatedData || []);
        setVideos(
          response?.paginatedData?.map((item: any) => ({
            src: item.img
              ? `/path/to/image/${item?.contentId}.jpg`
              : defaultImage,
            alt: item?.name,
            name: item?.name,
            category: [item?.subject],
            contentId: item?.contentId,
          }))
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setVideos([]);
      }
    };

    fetchSuggestions();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSuggestionClick = (value: string) => {
    navigate(`/watch?search=${encodeURIComponent(value.trim())}`);
  };

  const handleVideoClick = (video: any, index: number) => {
    localStorage.setItem("videos", JSON.stringify([video]));
    navigate(`/videos?index=${encodeURIComponent(index)}`);
  };

  return (
    <Layout
      _header={{
        searchTerm: searchTerm,
        suggestions: suggestions,
        onSearchChange: handleSearchChange,
        onSuggestionClick: handleSuggestionClick,
      }}
    >
      <VStack spacing={10} align={"stretch"} px="4">
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
            subjects?.map((subject, index) => (
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
                      onClick={() => handleSelectSubject(sub.subject)}
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
                      width="75px"
                      height="85px"
                      justifyContent="center"
                      alignItems="center"
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
          <VStack spacing={10} align={"stretch"} px="4">
            <Box>
              {videos?.length === 0 ? (
                <Text color="red.500" fontSize="xl" textAlign="center">
                  {t("HOME_NO_VIDEOS_AVAILABLE")}
                </Text>
              ) : (
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {videos?.map((item, index) => (
                    <GridItem
                      key={index}
                      position="relative"
                      borderRadius="9px"
                      overflow="hidden"
                      borderWidth="4px"
                      borderColor="borderColor"
                      cursor="pointer"
                      onClick={() => handleVideoClick(item, index)}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        borderRadius="md"
                        objectFit="cover"
                        width="100%"
                      />
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
                          {item.name}
                        </Text>
                        {Array.isArray(item.category) &&
                          item.category.map((cat: any, catIndex: number) => (
                            <Badge
                              key={catIndex}
                              fontSize="10px"
                              colorScheme="whiteAlpha"
                              bg="whiteAlpha.300"
                              color="white"
                              mx="1"
                            >
                              {cat}
                            </Badge>
                          ))}
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              )}
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Layout>
  );
}
