import React from "react";
import { Box, Image, IconButton, Text, VStack } from "@chakra-ui/react";
import IconByName from "../../../components/common/icons/Icon";
import defaultImage from "../../../assets/images/default-img.png";

interface OverlayProps {
  width?: number;
  height?: number;
  thumbnailUrl?: string;
}

const Overlay: React.FC<OverlayProps> = ({ width, height, thumbnailUrl }) => {
  return (
    <Box
      width={width}
      height={height}
      position="absolute"
      top={0}
      left={0}
      bg="rgba(0,0,0,0.9)"
    >
      <VStack
        align="center"
        position="absolute"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
        zIndex="10"
        bg="transparent"
        _focus={{ boxShadow: "none", outline: "none" }}
        onClick={() => console.log("Replay button clicked")}
        spacing={2}
      >
        <IconButton
          aria-label="Replay"
          icon={<IconByName name={"ReplayIcon"} boxSize="2rem" color="white" />}
          size="lg"
          height="56px"
          borderRadius="90px"
          border="1px solid white"
          bg={"#FFFFFF1A"}
          padding="11px"
          variant="ghost"
          _hover={{ bg: "#FFFFFF1A", borderColor: "white" }}
          _active={{
            bg: "#FFFFFF1A",
            transform: "none",
            boxShadow: "none",
          }}
          _focus={{
            boxShadow: "none",
            outline: "none",
          }}
        />
        <Text
          fontSize="16px"
          lineHeight="24px"
          letterSpacing="2px"
          fontWeight="700"
          color="white"
        >
          REPLAY
        </Text>
      </VStack>
      <Image
        left={0}
        top={0}
        src={thumbnailUrl || defaultImage}
        {...{ width, height }}
        opacity={0.2}
      />
    </Box>
  );
};

export default Overlay;
