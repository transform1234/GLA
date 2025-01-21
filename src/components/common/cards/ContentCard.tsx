import { memo } from "react";
import { Box, Image, Badge, Text, HStack } from "@chakra-ui/react";
import defaultImage from "../../../assets/images/default-img.png";
import scienceImage from "../../../assets/images/science-sub.png";
import englishImage from "../../../assets/images/english-sub.png";
import mathImage from "../../../assets/images/math-sub.png";
import IconByName from "../icons/Icon";

interface ContentCardProps {
  item: {
    thumbnailUrl: string;
    alt: string;
    name: string;
    category?: string[];
    subject?: string;
    lesson_questionset_status?: string;
    lesson_status?: string;
    lesson_questionset?: string;
  };
}

const subjectImages: { [key: string]: string } = {
  English: englishImage,
  Science: scienceImage,
  Kannada: defaultImage,
  Mathematics: mathImage,
};

const ContentCard: React.FC<ContentCardProps> = memo(({ item }) => {
  const subjectImage = item.subject && subjectImages[item.subject] ? subjectImages[item.subject] : defaultImage;
  const imageSrc = item.thumbnailUrl && item.thumbnailUrl.trim() !== "" ? item.thumbnailUrl : subjectImage;

  return (
    <Box position="relative">
      {/* Badge Section */}
      <BadgeWithDetails item={item} />

      {/* Image Section */}
      <Image
        src={imageSrc}
        alt={item.alt}
        borderRadius="md"
        objectFit="cover"
        width="100%"
      />

      {/* Details Section */}
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
        {Array.isArray(item.category)
          ? item.category.map((cat: any, catIndex: number) => (
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
            ))
          : item?.subject && (
              <Badge
                fontSize="10px"
                colorScheme="whiteAlpha"
                bg="whiteAlpha.300"
                color="white"
                mx="1"
              >
                {item?.subject}
              </Badge>
            )}
      </Box>
    </Box>
  );
});

export default ContentCard;

interface BadgeWithDetailsProps {
  item: {
    lesson_questionset_status?: string;
    lesson_status?: string;
    lesson_questionset?: string;
  };
}

const BadgeWithDetails: React.FC<BadgeWithDetailsProps> = ({ item }) => {
  const getBadgeDetails = () => {
    if (
      item.lesson_questionset &&
      item.lesson_questionset_status === "pending" &&
      item.lesson_status === "completed"
    ) {
      return {
        text: "Take Quiz",
        iconName: {
          name: "QuizIcon",
          color: "yellow.500",
          width: "20px",
          height: "20px",
        },
        bgColor: "yellow.lightYellow",
      };
    } else if (
      (!item.lesson_questionset || item.lesson_questionset_status === "pending") &&
      item.lesson_status === "completed"
    ) {
      return {
        text: "Completed",
        iconName: {
          name: "CheckIcon",
        },
        bgColor: "greenColor",
      };
    } else if (
      item.lesson_questionset_status === "completed" &&
      item.lesson_status === "pending"
    ) {
      return {
        text: "Watch Video",
        iconName: {
          name: "WatchVideoIcon",
          color:"yellow.500",
          width: "20px",
          height: "20px",
        },
        bgColor: "yellow.lightYellow",
      };
    }
    else if (
      item.lesson_questionset_status === "completed" &&
      item.lesson_status === "completed"
    ) {
      return  {
        text: "Completed",
        iconName: {
          name: "CheckIcon",
        },
        bgColor: "greenColor",
      };
    }
    return null;
  };

  const badgeDetails = getBadgeDetails();

  if (!badgeDetails) return null;

  return (
        <Badge
          position="absolute"
          top="12px"
          left="12px"
          borderRadius="4px"
          padding="2px 6px"
          bg={badgeDetails.bgColor}
          color="white"
        >
          <HStack spacing={1} alignItems="center">
          <IconByName
             alt={badgeDetails?.text}
             cursor="pointer"
             color="white"
             width="16px"
             height="12px"
             top="8px"
             left="9px"
             {...badgeDetails.iconName}
      />
            <Text lineHeight="26.07px" fontWeight="700" fontSize="12px" color="white" >{badgeDetails.text}</Text>
          </HStack>
        </Badge>
  );
};
