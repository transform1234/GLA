import {
  HStack,
  Icon,
  Box,
  Text,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import IconByName from "../icons/Icon";

interface StarRatingProps {
  value?: any;
  onChange?: (value: any) => void;
  required?: boolean;
  ratingLabels?: string[];
  totalStars?: number;
  readOnly?: boolean;
  hStackProps?: React.ComponentProps<typeof HStack>;
  iconProps?: React.ComponentProps<typeof Icon>;
}
const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  required = false,
  ratingLabels = [],
  totalStars = 5,
  readOnly = false,
  hStackProps = {},
  iconProps = {},
}) => {
  const [rating, setRating] = useState(value);
  const { t } = useTranslation();

  const handleStarClick = (starIndex: any) => {
    const starvalue = starIndex + 1;
    if (!readOnly) {
      setRating(`${starvalue}`);
      onChange?.(`${starvalue}`);
    }
  };

  React.useEffect(() => {
    setRating(`${value}`);
  }, [value]);

  return (
    <HStack
      width={"80%"}
      mx={"auto"}
      my={1}
      justifyContent={"space-evenly"}
      {...hStackProps}
    >
      {[...Array(totalStars)].map((_, index) => (
        <Box
          key={_}
          onClick={() => handleStarClick(index)}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <IconByName
            isDisabled
            name={"KidStarIcon"}
            boxSize={"24px"}
            color={index < rating ? "yellow.500" : "gray.300"}
            {...iconProps}
          />
          {ratingLabels?.[index] && (
            <Text color={index < rating ? "yellow.400" : "gray.300"}>
              {t(ratingLabels?.[index])}
            </Text>
          )}
        </Box>
      ))}
      {!rating && (
        <FormControl>
          <FormLabel>{required && <Text color="red.500">*</Text>}</FormLabel>
        </FormControl>
      )}
    </HStack>
  );
};

export default StarRating;
