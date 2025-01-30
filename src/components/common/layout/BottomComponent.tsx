import { HStack, Box } from "@chakra-ui/react";
import React, { memo } from "react";

interface BottomComponentProps {
  items: Array<{ [key: string]: any }>;
  selectedItem: string | null;
  onSelectItem: (item: string) => void;
  labelKey?: string;
  valueKey?: string;
}

const BottomComponent: React.FC<BottomComponentProps> = memo(
  ({
    items,
    selectedItem,
    onSelectItem,
    labelKey = "label",
    valueKey = "value",
  }) => {
    return (
      <HStack
        pt={4}
        gap={2}
        overflowX="auto"
        sx={{
          "::-webkit-scrollbar": {
            width: "0",
          },
        }}
      >
        {items.map((item: any) => {
          const value =
            typeof item === "object" && valueKey in item
              ? item[valueKey]
              : (item as string);
          const label =
            typeof item === "object" && labelKey in item
              ? (item as Record<string, string>)[labelKey]
              : (item as string);
          return (
            <Box
              key={value}
              bg={value === selectedItem ? "darkBlue.500" : "transparent"}
              borderColor={value === selectedItem ? "primary.500" : "white"}
              borderWidth={value === selectedItem ? "1px" : "1px"}
              color="white"
              fontFamily="Inter"
              lineHeight="16.41px"
              fontSize="14px"
              fontWeight="500"
              cursor="pointer"
              px="10px"
              py="7px"
              whiteSpace="nowrap"
              textTransform="capitalize"
              rounded={8}
              onClick={() => onSelectItem(value)}
            >
              {label}
            </Box>
          );
        })}
      </HStack>
    );
  }
);

export default BottomComponent;
