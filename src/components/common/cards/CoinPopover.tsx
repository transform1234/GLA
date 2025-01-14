import React, { memo } from "react";
import {
  Box,
  HStack,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/react";
import IconByName from "../icons/Icon"; // adjust the import path as necessary
import { formatNumber } from "../../../pages/videos/utils"; // adjust the import path as necessary

interface CoinPopoverProps {
  points: number;
  _hstack?: React.ComponentProps<typeof HStack>;
}

const CoinPopover: React.FC<CoinPopoverProps> = memo(({ points, _hstack }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Box>
          <HStack
            alignItems="center"
            spacing={"5px"}
            pt="2.5px"
            pb="1"
            pl="1"
            pr="2"
            bg="#FFD500"
            rounded={"80px"}
            {..._hstack}
          >
            <IconByName name={"CoinIcon"} color="white" boxSize="24px" />
            <Text
              fontSize="12px"
              color="#483E09"
              fontWeight={900}
              h="24px"
              textAlign={"center"}
              lineHeight={"25px"}
            >
              {formatNumber(points)}
            </Text>
          </HStack>
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody width={"auto"}>{points}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
});

export default CoinPopover;
