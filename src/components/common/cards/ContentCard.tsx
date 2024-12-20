import { memo } from "react";
import { Box, Image, Badge, Text } from "@chakra-ui/react";
import defaultImage from "../../../assets/images/default-img.png"; // add default image

interface ContentCardProps {
  item: {
    thumbnailUrl: string;
    alt: string;
    name: string;
    category?: string[];
  };
}

const ContentCard: React.FC<ContentCardProps> = memo(({ item }) => {
  return (
    <Box position="relative">
      <Image
        src={item.thumbnailUrl || defaultImage}
        alt={item.alt}
        borderRadius="md"
        objectFit="cover"
        width="100%"
      />
      <Box
        padding={3}
        position="absolute"
        bottom={0}
        width="100%"
        bg="linear-gradient(to top, rgba(0, 0, 0, 1), transparent)"
      >
        <Text color="white" fontSize="sm" py={1} textAlign="left">
          {item.name}
        </Text>
        {Array.isArray(item.category) &&
          item.category.map((cat: any, catIndex: number) => (
            <Badge
              key={catIndex}
              fontSize="10px"
              colorScheme="whiteAlpha"
              bg="whiteAlpha.300"
              color="white"
              mx="1"
            >
              {cat}
            </Badge>
          ))}
      </Box>
    </Box>
  );
});

export default ContentCard;
