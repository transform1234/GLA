import React from "react";
import {
  Stack,
  HStack,
  Center,
  SkeletonCircle,
  Skeleton,
  VStack,
  Box,
} from "@chakra-ui/react";

interface CustomSkeletonProps {
  size?: string;
  startColor?: string;
  endColor?: string;
  display?: string;
  type?: string;
}

const CustomSkeleton: React.FC<CustomSkeletonProps> = ({
  size = "8",
  startColor = "primary.500",
  endColor = "primary.50",
  display = "block",
  type = "video",
}) => {
  if (type === "assessment") {
    return (
      <Stack
        display={display}
        pt={"52px"}
        width="100%"
        height="100%"
        overflow={"auto"}
        // justifyContent={"center"}
        // alignItems={"center"}
      >
        <VStack bg="white" width="100%" height="100%" rounded={"16"} p="4">
          <HStack
            justifyContent={"space-between"}
            w="100%"
            pt="36px"
            spacing={0}
          >
            <SkeletonCircle
              size={"15px"}
              startColor={startColor}
              endColor={endColor}
            />
            <Skeleton
              height="2px"
              width="100%"
              startColor={startColor}
              endColor={endColor}
            />
            <SkeletonCircle
              size={"15px"}
              startColor={startColor}
              endColor={endColor}
            />
          </HStack>
          <VStack w="100%" align={"flex-start"}>
            <Skeleton
              mt="2"
              height="14px"
              width="100%"
              startColor={startColor}
              endColor={endColor}
            />
            <Skeleton
              height="14px"
              width="80%"
              startColor={startColor}
              endColor={endColor}
            />
            <VStack w="100%" align={"center"} overflow={"scroll"}>
              <HStack w="100%" align={"center"}>
                <Skeleton
                  boxShadow="0px 4px 0px 0px #c5c5c5 !important"
                  border="1px solid #c5c5c5 !important"
                  borderRadius="4px"
                  height="50px"
                  flex={1}
                  startColor={startColor}
                  endColor={endColor}
                />
                <Skeleton
                  boxShadow="0px 4px 0px 0px #c5c5c5 !important"
                  border="1px solid #c5c5c5 !important"
                  borderRadius="4px"
                  height="50px"
                  flex={1}
                  startColor={startColor}
                  endColor={endColor}
                />
              </HStack>
              <HStack w="100%" align={"center"}>
                <Skeleton
                  boxShadow="0px 4px 0px 0px #c5c5c5 !important"
                  border="1px solid #c5c5c5 !important"
                  borderRadius="4px"
                  height="50px"
                  flex={1}
                  startColor={startColor}
                  endColor={endColor}
                />
                <Skeleton
                  boxShadow="0px 4px 0px 0px #c5c5c5 !important"
                  border="1px solid #c5c5c5 !important"
                  borderRadius="4px"
                  height="50px"
                  flex={1}
                  startColor={startColor}
                  endColor={endColor}
                />
              </HStack>
            </VStack>
          </VStack>
          <HStack
            bg="white"
            align={"center"}
            position={"absolute"}
            bottom={"0"}
            width={"100%"}
            p="4"
            zIndex="5"
            padding="0.5rem 1rem 0.5rem 1rem"
          >
            <Box flex={1}>
              <Skeleton
                width={"24px"}
                height={"24px"}
                startColor={startColor}
                endColor={endColor}
              />
            </Box>
            <HStack flex={1}>
              <Skeleton
                boxShadow="0px 4px 0px 0px #c5c5c5 !important"
                border="1px solid #c5c5c5 !important"
                borderRadius="60px"
                height="30px"
                flex={1}
                startColor={startColor}
                endColor={endColor}
              />
              <Skeleton
                boxShadow="0px 4px 0px 0px #c5c5c5 !important"
                border="1px solid #c5c5c5 !important"
                borderRadius="60px"
                height="30px"
                flex={1}
                startColor={startColor}
                endColor={endColor}
              />
            </HStack>
          </HStack>
        </VStack>
      </Stack>
    );
  }
  return (
    <Stack
      gap="6"
      width="100%"
      height="100%"
      bg={"blackAlpha.400"}
      display={display}
    >
      <HStack gap="5" padding={4} justifyContent={"space-between"}>
        <HStack gap="5">
          <SkeletonCircle
            size={size}
            startColor={startColor}
            endColor={endColor}
          />
          <SkeletonCircle
            size={size}
            startColor={startColor}
            endColor={endColor}
          />
        </HStack>
        <SkeletonCircle
          size={size}
          startColor={startColor}
          endColor={endColor}
        />
      </HStack>
      <Center
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <HStack gap="10" padding={4} align={"center"}>
          <SkeletonCircle
            size="25px"
            startColor={startColor}
            endColor={endColor}
          />
          <SkeletonCircle
            size="50px"
            startColor={startColor}
            endColor={endColor}
          />
          <SkeletonCircle
            size="25px"
            startColor={startColor}
            endColor={endColor}
          />
        </HStack>
      </Center>
      <HStack
        width="full"
        position="absolute"
        justifyContent="end"
        bottom="32px"
      >
        <Skeleton
          height="48px"
          roundedLeft={"full"}
          width={"110px"}
          startColor={startColor}
          endColor={endColor}
        />
      </HStack>
    </Stack>
  );
};

export default CustomSkeleton;
