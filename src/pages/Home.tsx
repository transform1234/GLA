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
import odia from "../assets/icons/odiya_icon.svg";
import math from "../assets/icons/maths_icon.svg";
import physics from "../assets/icons/physics_icon.svg";
import Layout from "../components/common/layout/layout";
import CustomHeading from "../components/common/typography/Heading";
import { getProgramId, getSubjectList } from "../services/home";
import { chunk } from "lodash";
import { useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../services/content";
import ContentCard from "../components/common/cards/ContentCard";
import { impression } from "../services/telemetry";

const subjectIcons = {
  science: { icon: physics, label: "Science" },
  mathematics: { icon: math, label: "Math" },
  math: { icon: math, label: "Math" },
  english: { icon: english, label: "English" },
  kannada: { icon: kannada, label: "Kannada" },
  odia: { icon: odia, label: "Odia" },
};
export default function Homepage(props: any) {
  const { t } = useTranslation();
  const [subjects, setSubjects] = useState<Array<any>>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null); // set null
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState();
  const [videos, setVideos] = useState<any>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { authUser } = props;

  useEffect(() => {
    const fetchProgramId = async () => {
      if (!authUser?.Student?.School) {
        setError(t("NO_SCHOOL_FOUND"));
        return;
      }
      if (!authUser?.GroupMemberships?.[0]?.Group?.board) {
        setError(t("NO_BOARD_FOUND"));
        return;
      }
      if (!authUser?.GroupMemberships?.[0]?.Group?.grade) {
        setError(t("NO_CLASS_FOUND"));
        return;
      }

      try {
        let storedSubject = localStorage.getItem("subject") || "";
        const programData = await getProgramId();
        if (programData?.programId) {
          const res: any = await getSubjectList();
          const subjectR = chunk(res, 4);
          if (!storedSubject && res.length > 0) {
            storedSubject = res[0]?.subject;
            localStorage.setItem("subject", storedSubject);
          }
          handleSelectSubject(storedSubject);
          setSelectedSubject(storedSubject);
          setSubjects(subjectR);
        } else {
          setError(t("NO_PROGRAM_FOUND"));
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
        setError(t("An unexpected error occurred. Please try again later."));
      }
    };

    fetchProgramId();
  }, [authUser]);

  const handleSelectSubject = async (subject: string) => {
    setSelectedSubject(subject);
    localStorage.setItem("subject", subject);
    await getVideos("subject");
  };

  const getVideos = async (type: string = "search") => {
    const payload = {
      searchQuery: type === "search" ? searchTerm : "",
      programId: localStorage.getItem("programID"),
      subject: localStorage.getItem("subject"),
      limit: type === "search" ? 5 : 500,
    };

    try {
      const response = await fetchSearchResults(payload);
      if (type === "search") {
        setSuggestions(Boolean(searchTerm) && response?.paginatedData);
      } else {
        setVideos(response?.paginatedData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      if (type === "search") {
        setSuggestions([]);
      } else {
        setVideos([]);
      }
    }
  };

  useEffect(() => {
    if (searchTerm || searchTerm == "") {
      getVideos();
    }
  }, [searchTerm]);

  useEffect(() => {
    impression({
      edata: {
        type: "Home",
        pageid: "HOME",
        uri: "/home",
        query: Object.fromEntries(
          new URLSearchParams(location.search).entries()
        ),
        visits: [],
      },
    });
  }, []);

  const handleSuggestionClick = (
    obj: { search?: string; index?: string | number | null } = {
      search: "",
      index: null,
    }
  ) => {
    if (obj?.index !== null && obj?.index !== undefined) {
      navigate(
        `/videos?index=${encodeURIComponent(
          obj?.index || ""
        )}&search=${encodeURIComponent(
          (obj.search ?? "").trim()
        )}&subject=${encodeURIComponent(selectedSubject || "")}`
      );
    } else {
      navigate(
        `/search?search=${encodeURIComponent(
          (obj.search ?? "").trim()
        )}&subject=${encodeURIComponent(selectedSubject || "")}`
      );
    }
  };

  const handleVideoClick = (video: any, index: number) => {
    navigate(
      `/videos?index=${encodeURIComponent(index)}&search=${encodeURIComponent(
        (searchTerm ?? "").trim()
      )}&subject=${encodeURIComponent(video.subject)}`
    );
  };

  return (
    <Layout
      _header={{
        searchTerm: searchTerm,
        suggestions: suggestions,
        onSearchChange: setSearchTerm,
        onSuggestionClick: handleSuggestionClick,
      }}
    >
      <VStack spacing={10} align={"stretch"} px="4">
        {error ? (
          <Text color="red.500" fontSize="xl" textAlign="center" mt="10">
            {error}
          </Text>
        ) : (
          <>
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
                      {videos?.map((item: any, index: number) => (
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
                          <ContentCard item={item} />
                        </GridItem>
                      ))}
                    </Grid>
                  )}
                </Box>
              </VStack>
            </Box>
          </>
        )}
      </VStack>
    </Layout>
  );
}
