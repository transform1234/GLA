import React from "react";
import { Box, Spinner, Text, Center, Button, Icon } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

interface LoadingComponentProps {
  message?: string; // Optional prop for custom loading message
  showSpinner?: boolean; // Optional prop to handle spinner visibility
  showBackButton?: boolean; // Optional prop to handle back button visibility
}

const Loading: React.FC<LoadingComponentProps> = ({
  message = "Loading...",
  showSpinner = true,
  showBackButton = false,
}) => {
  const navigate = useNavigate();

  return (
    <Center height="100vh" width="100vw">
      <Box display="flex" flexDirection="column" alignItems="center" gap="16px">
        {showSpinner && (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        )}
        <Text fontSize="18px" color="gray.600">
          {message}
        </Text>
        {showBackButton && (
          <Button
            variant="link"
            onClick={() => navigate(-1)}
            colorScheme="primary"
            leftIcon={<Icon as={ChevronLeftIcon} />}
          >
            Back
          </Button>
        )}
      </Box>
    </Center>
  );
};

export default Loading;
