// src/App.tsx
import React, { useEffect, useState } from "react";
import { Box, IconButton, Flex } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import VideoReel from "./VideoReels";
import { getAltUserContent } from "../../services/content";

const App = () => {
  const [videos, setVideos] = useState<Array<any>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const result = await getAltUserContent({ page: 1, limit: 6 });
      setVideos(result?.data || []);
    };
    init();
  }, []);

  return (
    <Box>
      <IconButton
        aria-label="Go back"
        icon={<ChevronLeftIcon boxSize="2rem" color="white" />}
        onClick={() => navigate(-1)}
        size="mg"
        variant="ghost"
        position="absolute"
        top="10px"
        left="10px"
        zIndex="10"
        bg="whiteAlpha.300"
        p="1"
        rounded={"full"}
      />
      <VideoReel videos={videos} />
    </Box>
  );
};

export default App;
