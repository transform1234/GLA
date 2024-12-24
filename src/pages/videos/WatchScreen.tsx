import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loading";
import { fetchSearchResults } from "../../services/content";
import {
  Badge,
  Box,
  Grid,
  GridItem,
  Image,
  Text,
  VStack,
  Tag,
  TagLabel,
  HStack,
} from "@chakra-ui/react";
import Layout from "../../components/common/layout/layout";
import defaultImage from "../../assets/images/default-img.png";
import { useTranslation } from "react-i18next";
import { chunk } from "lodash";
import { getSubjectList } from "../../services/home";

type Filter = {
  searchTerm: string;
  subject: string | null;
};

const Watch = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>({
    searchTerm: "",
    subject: localStorage.getItem("language") || null,
  });
  const [subjects, setSubjects] = useState<Array<any>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(
    localStorage.getItem("language") || null
  );
  const [language, setLanguage] = useState(localStorage.getItem('language') || '');
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const fetchSuggestions = async (filter: {
    searchTerm: string;
    subject: string | null;
  }) => {
    const isSearchTermChange = !!filter.searchTerm;
    const limit = isSearchTermChange ? 5 : 100;
  
    const payload = {
      searchQuery: filter.searchTerm,
      programId: localStorage.getItem("programID"),
      subject: filter.subject,
      limit,
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
    fetchSuggestions(filter);
  }, [filter]);

  useEffect(() => {
    getSubject();
  }, []);

  const handleSelectSubject = (subject: string) => {
    if (subject === "ALL") {
      localStorage.setItem("language", "");
      setSelectedSubject(null);
      setFilter((prevFilter) => ({ ...prevFilter, subject: "" }));
    } else {
      localStorage.setItem("language", subject);
      setSelectedSubject(subject);
      setFilter((prevFilter) => ({ ...prevFilter, subject }));
    }
  };
  
  const handleSearchChange = (value: string) => {
    setFilter((prevFilter) => ({ ...prevFilter, searchTerm: value }));
  };

  const handleVideoClick = (video: any, index: number) => {
    localStorage.setItem("videos", JSON.stringify([video]));
    navigate(
      `/videos?index=${encodeURIComponent(index)}&search=${encodeURIComponent(
        video?.name
      )}&subject=${encodeURIComponent(video?.category[0])}`
    );
  };

  const getSubject = async () => {
    try {
      let storedSubject = localStorage.getItem("language") || "";
      const res: any = await getSubjectList();
      const subjectR = chunk(res, 4);
      if (!storedSubject && res.length > 0) {
        storedSubject = res[0]?.subject;
        localStorage.setItem("language", storedSubject);
      }
      setSelectedSubject(storedSubject);
      setSubjects(subjectR);
    } catch (error) {
      console.error("Error fetching program data:", error);
    }
  };

  return error ? (
    <Loading
      showSpinner={false}
      message={error}
      onBackClick={() => navigate(-1)}
    />
  ) : (
    <Layout
      _header={{
        searchTerm: filter.searchTerm,
        suggestions: suggestions,
        onSearchChange: handleSearchChange,
        onSuggestionClick: (value: string) =>
          navigate(`/search?search=${value}`),
        onSubjectSelect: handleSelectSubject,
        bottomComponent: (
          <BottomComponent
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSelectSubject={handleSelectSubject}
          />
        ),
      }}
      isFooterVisible={false}
      isHeaderVisible={true}
    >
      <Box>
        <VStack mt={4} spacing={10} align={"stretch"} px="4">
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
                      <Text color="white" fontSize="sm" py={1} textAlign="left">
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
    </Layout>
  );
};

export default Watch;

interface BottomComponentProps {
  subjects: Array<any>;
  selectedSubject: string | null;
  onSelectSubject: (subject: string) => void;
}

const BottomComponent: React.FC<BottomComponentProps> = ({
  subjects,
  selectedSubject,
  onSelectSubject,
}) => {
  return (
    <HStack pt={4} mt={4} justifyContent="center">
      {/* Default ALL Subject Tag */}
      <Tag
        size="md"
        variant="outline"
        bg={selectedSubject === "ALL" ? "primary.500" : "#E3F9FF33"}
        color="white"
        borderColor={selectedSubject === null ? "none" : "white"}
        border={selectedSubject === null ? "none" : "1px solid"}
        borderRadius="8px"
        fontFamily="Inter"
        fontWeight="700"
        fontSize="14px"
        onClick={() => onSelectSubject("ALL")}
        cursor="pointer"
        height="30px"
        padding="0 10px"
      >
        <HStack spacing={1} align="center" justify="center" width="100%">
          <TagLabel>ALL</TagLabel>
        </HStack>
      </Tag>

      {subjects &&
        subjects?.map((subject, index) => (
          <HStack key={`subject-${index}`}>
            {subject &&
              subject.map((sub: any) => (
                <Tag
                  key={sub.subject}
                  size="md"
                  variant="outline"
                  bg={
                    sub.subject === selectedSubject
                      ? "primary.500"
                      : "#E3F9FF33"
                  }
                  color="white"
                  borderColor={
                    sub.subject === selectedSubject ? "none" : "white"
                  }
                  border={
                    sub.subject === selectedSubject ? "none" : "1px solid"
                  }
                  borderRadius="8px"
                  fontFamily="Inter"
                  fontWeight="700"
                  fontSize="14px"
                  onClick={() => onSelectSubject(sub.subject)}
                  cursor="pointer"
                  height="30px"
                  padding="0 10px"
                >
                  <HStack
                    spacing={1}
                    align="center"
                    justify="center"
                    width="100%"
                  >
                    <TagLabel>{sub.subject}</TagLabel>
                  </HStack>
                </Tag>
              ))}
          </HStack>
        ))}
    </HStack>
  );
};
