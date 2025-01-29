import {
  Box,
  Grid,
  GridItem,
  HStack,
  Image,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { chunk } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import english from "../assets/icons/english_icon.svg";
import kannada from "../assets/icons/kannada_icon.svg";
import math from "../assets/icons/maths_icon.svg";
import odia from "../assets/icons/odiya_icon.svg";
import physics from "../assets/icons/physics_icon.svg";
import ContentCard from "../components/common/cards/ContentCard";
import Layout from "../components/common/layout/layout";
import CustomHeading from "../components/common/typography/Heading";
import { fetchSearchResults, getProgramProgress } from "../services/content";
import { getProgramId, getSubjectList } from "../services/home";
import { impression } from "../services/telemetry";
import IconByName from "../components/common/icons/Icon";

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
  const [progress, setProgress] = useState<string>("");
  const [recentSearch, setRecentSearch] = useState<string[]>([]);
  const RECENT_SEARCH_KEY = "recentSearches";

  useEffect(() => {
    try {
      const savedSearches = JSON.parse(
        localStorage.getItem(RECENT_SEARCH_KEY) || "[]"
      );
      if (Array.isArray(savedSearches) && setRecentSearch) {
        setRecentSearch(savedSearches);
      }
    } catch (error) {
      console.error("Error parsing recent searches:", error);
      if (setRecentSearch) {
        setRecentSearch([]);
      }
    }
  }, [setRecentSearch]);

  useEffect(() => {
    const fetchProgramId = async () => {
      if (!authUser?.GroupMemberships?.[0]?.School) {
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
          const result = await getProgramProgress({
            programId: programData?.programId,
          });
          setProgress(result?.percentage || "0");
          const resultSubject: any = await getSubjectList();
          const res = await Promise.all(
            resultSubject?.map(async (e: any) => {
              const progress = await getProgramProgress({
                programId: programData?.programId,
                subject: e?.subject,
              });
              return { ...e, progress };
            })
          );
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

        if (response?.paginatedData?.length) {
          setRecentSearch((prev: any) => {
            if (searchTerm) {
              const updatedSearches = [
                searchTerm,
                ...prev.filter((term: any) => term !== searchTerm),
              ];
              const limitedSearches = updatedSearches.slice(0, 5); // Keep the recent searches limited to 5

              localStorage.setItem(
                RECENT_SEARCH_KEY,
                JSON.stringify(limitedSearches)
              );
              return limitedSearches;
            }
            return prev;
          });
        }
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
    if (searchTerm) {
      getVideos();
    } else {
      setSuggestions([]);
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
        progress: progress,
        recentSearch: recentSearch,
        points: authUser?.points,
        keyDownSearchFilter: {
          from: "home",
          subject: localStorage.getItem("subject") || "",
        },
        userInfo: true,
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
                fontWeight="500"
                title={t("HOME_LEARN_SOMETHING_NOW")}
                color="textPrimary"
              />

              {subjects &&
                subjects?.map((subject, index) => (
                  <HStack
                    key={`subject-${index}`}
                    w="100%"
                    // divider={<StackDivider borderColor="gray.200" margin="0" />}
                    justifyContent={"space-around"}
                  >
                    {subject &&
                      subject.map((sub: any) => (
                        <VStack
                          key={sub.subject}
                          spacing={"2.5"}
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
                          width="77px"
                          height="87px"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {/* Render the specific image for each subject */}
                          <VStack spacing={1}>
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
                              lineHeight="9px"
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
                          {(typeof sub?.progress?.percentage === "string" &&
                            parseInt(sub?.progress?.percentage) < 100) ||
                          sub?.progress?.percentage < 100 ? (
                            <Progress
                              w={"100%"}
                              colorScheme="progressBarGreen"
                              bg="progressLightBG"
                              color={"white"}
                              size="xs"
                              value={sub?.progress?.percentage || 0}
                              rounded={"full"}
                              isAnimated
                            />
                          ) : (
                            <IconByName
                              name="CheckCircleIcon"
                              color="progressBarGreen.500"
                            />
                          )}
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
              <VStack spacing={10} align={"stretch"}>
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
