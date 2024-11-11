import React from "react";
import { Box, Spinner, Text, Center, Button, Icon } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

interface LoadingComponentProps {
  message?: string; // Optional prop for custom loading message
  showSpinner?: boolean; // Optional prop to handle spinner visibility
  onBackClick?: () => void; // Optional prop to handle back button click
}

const Loading: React.FC<LoadingComponentProps> = ({
  message = "Loading...",
  showSpinner = true,
  onBackClick,
}) => {
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
        {onBackClick && (
          <Button
            variant="link"
            onClick={onBackClick}
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
