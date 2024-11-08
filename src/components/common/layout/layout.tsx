import React from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import Loading from "../Loading";
import useDeviceSize from "./useDeviceSize";

interface Props {
  children: React.ReactNode;
  loading?: boolean;
}

const Layout: React.FC<Props> = ({ children, loading = false }) => {
  const { width, height } = useDeviceSize();
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={window.innerHeight}
      width={window.innerWidth}
      bg="white"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
    >
      {loading || width === 0 ? (
        <Loading message="Loading..." />
      ) : (
        <Box height={height} width={width} bg="white" margin="0 auto">
          {children}
        </Box>
      )}
    </Flex>
  );
};

export default Layout;
