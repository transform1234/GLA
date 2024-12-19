import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Badge,
  Box,
  Image,
  Text,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Loading from "../../components/common/Loading";
import { fetchSearchResults } from "../../services/content";
import Layout from "../../components/common/layout/layout";
import defaultImage from "../../assets/images/default-img.png";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<any[]>([]);
  // const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let query = params.get("search") || "";
    setSearchTerm(query);
  }, [location.search]);

  useEffect(() => {
    fetchData(searchTerm);
  }, [searchTerm])

  const fetchData = async (search :any) => {
    const payload = {
      searchQuery: search || '',
      programId: localStorage.getItem("programID"),
      subject: localStorage.getItem("subject"),
      limit: 100,
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
    } finally {
      setLoading(false);
    }
  };

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
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, []);

  const handleSearchChange = (value: string) => {
    console.log(value);
    
    setSearchTerm(value);
  };

  const handleSuggestionClick = (value: string) => {
    console.log("Selected suggestion:", value);
  };

  const handleVideoClick = (video: any, index: number) => {
    localStorage.setItem(
      "filter",
      JSON.stringify({
        searchQuery: searchTerm,
        programId: localStorage.getItem("programID"),
        subject: localStorage.getItem("subject"),
        limit: 10,
      })
    );
    navigate(`/videos?index=${encodeURIComponent(index)}&search=${encodeURIComponent(video?.name)}&subject=${encodeURIComponent(video?.category[0])}`);
  };

  return (
    <Box>
      {loading && <Loading />}
      {error && (
        <Layout>
          <VStack spacing={4} mt={6}>
            <Text color="red.500">Error: {error}</Text>
            <Text>Please try again later.</Text>
          </VStack>
        </Layout>
      )}
      {!loading && !error && videos.length > 0 ? (
        <Layout
          _header={{
            searchTerm: searchTerm,
            suggestions: suggestions,
            onSearchChange: handleSearchChange,
            onSuggestionClick: handleSuggestionClick,
          }}
        >
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
            </Box>
          </VStack>
        </Layout>
      ) : (
        !loading &&
        !error && (
          <Layout>
            <VStack>
              <Text mt={6} textAlign="center">
                No videos found.
              </Text>
            </VStack>
          </Layout>
        )
      )}
    </Box>
  );
};

export default SearchPage;
