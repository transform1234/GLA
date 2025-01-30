import { Box, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContentCard from "../../components/common/cards/ContentCard";
import Layout from "../../components/common/layout/layout";
import Loading from "../../components/common/Loading";
import { fetchSearchResults } from "../../services/content";
import { impression } from "../../services/telemetry";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();

  const getParameter = (key: string) => {
    const params = new URLSearchParams(location.search);
    return params.get(key) || "";
  };
  useEffect(() => {
    impression({
      edata: {
        type: "Search",
        pageid: "SEARCH",
        uri: "/search",
        query: Object.fromEntries(
          new URLSearchParams(location.search).entries()
        ),
        visits: [],
      },
    });
  }, []);
  useEffect(() => {
    const query = getParameter("search");
    setSearchTerm(query);
  }, [location.search]);

  useEffect(() => {
    if (searchTerm == undefined) return;
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetchSearchResults({
          searchQuery: searchTerm,
          programId: localStorage.getItem("programID"),
          subject: getParameter("subject"),
          limit: 500,
          isTelemetryEnabled: true,
        });

        setVideos(response?.paginatedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleVideoClick = (video: any, index: number) => {
    navigate(
      `/videos?index=${encodeURIComponent(index)}&search=${encodeURIComponent(
        searchTerm || ""
      )}&subject=${encodeURIComponent(video?.subject)}`
    );
  };

  return (
    <Layout
      loading={loading}
      _header={{
        searchTerm: searchTerm,
        onSearchChange: setSearchTerm,
      }}
    >
      {loading && <Loading />}
      {error && (
        <VStack spacing={4} mt={6}>
          <Text color="red.500">Error: {error}</Text>
          <Text>Please try again later.</Text>
        </VStack>
      )}
      {!loading && !error && videos.length > 0 ? (
        <VStack mt={4} spacing={10} align={"stretch"} px="4">
          <Box>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {videos.map((item, index) => (
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
          </Box>
        </VStack>
      ) : (
        !loading &&
        !error && (
          <VStack>
            <Text mt={6} textAlign="center">
              No videos found.
            </Text>
          </VStack>
        )
      )}
    </Layout>
  );
};

export default SearchPage;
