import { Box, Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/images/default-img.png";
import ContentCard from "../../components/common/cards/ContentCard";
import Layout from "../../components/common/layout/layout";
import Loading from "../../components/common/Loading";
import { fetchSearchResults } from "../../services/content";
import { getSubjectList } from "../../services/home";
import { impression } from "../../services/telemetry";
import BottomComponent from "../../components/common/layout/BottomComponent";

type Filter = {
  searchTerm: string;
  subject: string | null;
};

const Watch = (prop: any) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<any>();
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
      const limit = 500;
      const payload = {
        searchQuery: filter.searchTerm,
        programId: localStorage.getItem("programID"),
        subject: filter.subject,
        limit,
      };

      try {
        const response = await fetchSearchResults(payload);
        setVideos(response?.paginatedData);
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
        const res: any = await getSubjectList();
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
      searchTerm: "",
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
      )}&subject=${
        filter.subject === "all"
          ? ""
          : encodeURIComponent(filter?.subject || "")
      }&redirect=/watch`
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
        points: prop?.authUser?.points,
        keyDownSearchFilter: {
          from: "watch",
          subject: JSON.parse(localStorage.getItem("watchFilter") || "{}")
            .subject,
        },
        bottomComponent: (
          <BottomComponent
            items={[
              { subject: "all", value: "" },
              ...subjects.map((e: any) => ({ ...e, value: e.subject })),
            ]}
            selectedItem={filter.subject || ""}
            labelKey="subject"
            onSelectItem={handleSelectSubject}
          />
        ),
        userInfo: false,
        backIconAndHeading: {
          icon: true,
          heading: t("HOME_WATCH"),
          backTo: "class",
        },
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
    </Layout>
  );
};

export default Watch;
