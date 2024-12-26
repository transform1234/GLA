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
  HStack,
} from "@chakra-ui/react";
import Layout from "../../components/common/layout/layout";
import defaultImage from "../../assets/images/default-img.png";
import { useTranslation } from "react-i18next";
import { getSubjectList } from "../../services/home";
import ContentCard from "../../components/common/cards/ContentCard";
import { impression } from "../../services/telemetry";

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
    subject: null,
  });
  const [subjects, setSubjects] = useState<Array<any>>([]);
  const { t } = useTranslation();
  const setCustomFilter = (customFilter: Filter) => {
    localStorage.setItem("watchFilter", JSON.stringify(customFilter));
    setFilter(customFilter);
  };

  useEffect(() => {
    const fetchSuggestions = async (filter: {
      searchTerm: string;
      subject: string | null;
    }) => {
      const limit = 100;
      const payload = {
        searchQuery: filter.searchTerm,
        programId: localStorage.getItem("programID"),
        subject: filter.subject,
        limit,
      };

      try {
        const response = await fetchSearchResults(payload);
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

    if (filter.subject !== null) {
      fetchSuggestions(filter);
    }
  }, [filter]);

  const getLocalStorageFilter = () => {
    const filterString = localStorage.getItem("watchFilter");
    try {
      return filterString
        ? JSON.parse(filterString)
        : { searchTerm: "", subject: "" };
    } catch (err) {
      return { searchTerm: "", subject: "" };
    }
  };

  useEffect(() => {
    const getSubject = async () => {
      impression({
        edata: {
          type: "Watch",
          pageid: "WATCH",
          uri: "/watch",
          query: Object.fromEntries(
            new URLSearchParams(location.search).entries()
          ),
          visits: [],
        },
      });
      try {
        let storedSubject = localStorage.getItem("language") || "";
        const res: any = await getSubjectList();
        if (!storedSubject && res.length > 0) {
          storedSubject = res[0]?.subject;
          localStorage.setItem("language", storedSubject);
        }
        setSubjects(res);
        const filterLocal = getLocalStorageFilter();
        setCustomFilter({
          ...(filterLocal || {}),
          subject:
            res?.filter((e: any) => e.subject === filterLocal.subject).length >
            0
              ? filterLocal.subject
              : "",
        });
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };
    getSubject();
  }, []);

  const handleSelectSubject = (subject: string) => {
    setCustomFilter({
      ...(filter || {}),
      subject,
    });
  };

  const handleSearchChange = (value: string) => {
    setCustomFilter({
      ...(filter || {}),
      searchTerm: value,
    });
  };

  const handleVideoClick = (video: any, index: number) => {
    navigate(
      `/videos?index=${encodeURIComponent(index)}&search=${encodeURIComponent(
        filter.searchTerm
      )}&subject=${encodeURIComponent(video?.category[0])}&redirect=/watch`
    );
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
        onSearchChange: handleSearchChange,
        onSubjectSelect: handleSelectSubject,
        bottomComponent: (
          <BottomComponent
            subjects={subjects}
            selectedSubject={filter.subject || ""}
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
                    <ContentCard item={item} />
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
    <HStack
      pt={5}
      gap={2}
      overflowX="auto"
      sx={{
        "::-webkit-scrollbar": {
          width: "0",
        },
      }}
    >
      {/* Default ALL Subject Tag */}
      <Box
        bg={selectedSubject === "" ? "primary.500" : "#E3F9FF33"}
        borderColor={selectedSubject === "" ? "none" : "white"}
        border={selectedSubject === "" ? "none" : "1px solid"}
        color="white"
        fontFamily="Inter"
        fontWeight="700"
        cursor="pointer"
        px="10px"
        py="7px"
        rounded={8}
        onClick={() => onSelectSubject("")}
      >
        ALL
      </Box>

      {subjects &&
        subjects.map((sub: any) => (
          <Box
            key={sub.subject}
            bg={sub.subject === selectedSubject ? "primary.500" : "#E3F9FF33"}
            borderColor={sub.subject === selectedSubject ? "none" : "white"}
            border={sub.subject === selectedSubject ? "none" : "1px solid"}
            color="white"
            fontFamily="Inter"
            fontWeight="700"
            cursor="pointer"
            px="10px"
            py="7px"
            rounded={8}
            onClick={() => onSelectSubject(sub.subject)}
          >
            {sub.subject}
          </Box>
        ))}
    </HStack>
  );
};
