import React from "react";
import { Box, Spinner, Text, Center } from "@chakra-ui/react";

interface LoadingComponentProps {
  message?: string; // Optional prop for custom loading message
}

const Loading: React.FC<LoadingComponentProps> = ({
  message = "Loading...",
}) => {
  return (
    <Center height="100vh" width="100vw">
      <Box display="flex" flexDirection="column" alignItems="center" gap="16px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text fontSize="18px" color="#4299e1">
          {message}
        </Text>
      </Box>
    </Center>
  );
};

export default Loading;
