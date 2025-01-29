import React from "react";
import { Box, Image, IconButton, Text, VStack, Button } from "@chakra-ui/react";
import IconByName from "../../../components/common/icons/Icon";
import defaultImage from "../../../assets/images/default-img.png";

interface VideoEndProps {
  width?: number;
  height?: number;
  thumbnailUrl?: string;
  setVideoEndId: any;
  isIntro?: boolean;
}

const VideoEnd: React.FC<VideoEndProps> = ({
  width,
  height,
  thumbnailUrl,
  setVideoEndId,
  isIntro,
}) => {
  return (
    <Box
      width={width}
      height={height}
      position="absolute"
      top={0}
      left={0}
      bg="rgba(0,0,0,0.9)"
    >
      {isIntro ? (
        <VStack
          spacing={6}
          align="center"
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          zIndex="10"
          bg="transparent"
          _focus={{ boxShadow: "none", outline: "none" }}
        >
          <VStack spacing={4}>
            <IconByName name={"ScrollHandIcon"} boxSize="50px" color="white" />
            <VStack spacing={2}>
              <Text
                fontSize="16px"
                lineHeight="21px"
                fontWeight="400"
                color="white"
                textAlign={"center"}
              >
                Swipe up to view
              </Text>
              <Text
                fontSize="16px"
                lineHeight="21px"
                fontWeight="400"
                color="white"
                textAlign={"center"}
              >
                more videos
              </Text>
            </VStack>
          </VStack>
          <Button
            variant="outline"
            color="white"
            height={"44px"}
            px="10"
            _hover={{
              background: "transparent",
              color: "white",
              borderColor: "white",
            }}
            onClick={() => setVideoEndId(undefined)}
          >
            Got it
          </Button>
        </VStack>
      ) : (
        <VStack
          align="center"
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          zIndex="10"
          bg="transparent"
          _focus={{ boxShadow: "none", outline: "none" }}
          onClick={() => setVideoEndId(undefined)}
          spacing={2}
        >
          <IconButton
            aria-label="Replay"
            icon={
              <IconByName name={"ReplayIcon"} boxSize="2rem" color="white" />
            }
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
      )}
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

export default React.memo(VideoEnd);
