import React, { memo } from "react";
import { Box, Progress, Text, HStack, VStack } from "@chakra-ui/react";
import IconByName from "../icons/Icon";
import { useTranslation } from "react-i18next";
import SubjectGrid from "./SubjectGrid";
import { use } from "i18next";

interface ClassCardProps {
  title: boolean;
  selectedSubject?: string | null;
  subjectClick?: (subject: string) => void;
  data: any;
  onClick?: () => void;
}

const ClassCard: React.FC<ClassCardProps> = memo(
  ({ title, data, onClick, subjectClick, selectedSubject }) => {
    const { t } = useTranslation();
    const [selectedSubjectNew, setSelectedSubject] = React.useState<
      string | undefined
    >(undefined);

    React.useEffect(() => {
      setSelectedSubject(selectedSubject || "");
    }, [selectedSubject]);

    const onSelectSubject = (subject: string) => {
      setSelectedSubject(subject);
      subjectClick?.(subject);
    };
    return (
      <Box
        bg="backgroundGrey"
        borderRadius="16px"
        padding={4}
        boxShadow="0px 2px 4px rgba(0, 0, 0, 0.25)"
      >
        <Box onClick={onClick}>
          {/* Class Header */}
          {title && (
            <VStack align={"stretch"}>
              <HStack justifyContent="space-between" alignItems="center" mb={4}>
                <Text
                  lineHeight="21px"
                  fontFamily="Bebas Neue"
                  fontWeight="400"
                  fontSize="20px"
                >
                  {data?.title}
                </Text>
                <IconByName
                  boxSize={"20px"}
                  name={"ChevronRightIcon"}
                  color={"primary.500"}
                />
              </HStack>

              <Text
                color="#10162E99"
                lineHeight="12px"
                fontFamily="Inter"
                fontWeight="500"
                fontSize="12px"
                borderTop={title ? "1px solid #BDBDBD" : ""}
                pt={5}
              >
                {t("TEACHER_OVERALL_PROGRESS")}
              </Text>

              {/* Overall Progress Bar with Percentage */}
              <HStack justifyContent="space-between" alignItems="center" mb={4}>
                <Progress
                  w={"100%"}
                  colorScheme="progressBarGreen"
                  bg="progressLightBG"
                  color={"white"}
                  size="xs"
                  rounded={"full"}
                  value={data?.classCompletionPercentage}
                  isAnimated
                />

                <HStack justifyContent="center" alignItems="center" gap={0}>
                  <Text
                    textAlign="center"
                    lineHeight="20px"
                    fontFamily="Inter"
                    fontWeight="700"
                    fontSize="20px"
                  >
                    {data?.classCompletionPercentage}
                  </Text>
                  <Text
                    lineHeight="20px"
                    fontFamily="Inter"
                    fontWeight="700"
                    fontSize="16px"
                    textAlign="center"
                  >
                    %
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          )}
        </Box>
        <SubjectGrid
          subjects={data?.subjects}
          isClickable={subjectClick ? true : false}
          isAllSubjectPersentage={!title ? data?.classCompletionPercentage : 0}
          selectedSubject={selectedSubjectNew}
          onSelectSubject={onSelectSubject}
        />
      </Box>
    );
  }
);

export default ClassCard;
