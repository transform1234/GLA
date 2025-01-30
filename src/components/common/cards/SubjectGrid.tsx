import { HStack, Image, Progress, VStack } from "@chakra-ui/react";
import React, { memo } from "react";
import english from "../../../assets/icons/english_icon.svg";
import kannada from "../../../assets/icons/kannada_icon.svg";
import math from "../../../assets/icons/maths_icon.svg";
import odia from "../../../assets/icons/odiya_icon.svg";
import physics from "../../../assets/icons/physics_icon.svg";
import IconByName from "../icons/Icon";
import CustomHeading from "../typography/Heading";

const subjectIcons = {
  science: { icon: physics, label: "Science" },
  mathematics: { icon: math, label: "Math" },
  math: { icon: math, label: "Math" },
  english: { icon: english, label: "English" },
  kannada: { icon: kannada, label: "Kannada" },
  odia: { icon: odia, label: "Odia" },
};

interface SubjectGridProps {
  subjects: any[];
  selectedSubject?: string | null;
  onSelectSubject?: (subject: string) => void;
  isClickable: boolean;
  isAllSubjectPersentage?: number;
}

const SubjectGrid: React.FC<SubjectGridProps> = memo(
  ({
    subjects,
    selectedSubject,
    onSelectSubject,
    isClickable,
    isAllSubjectPersentage,
  }) => {
    const handleSelectSubject = (subject: string) => {
      onSelectSubject?.(subject);
      console.log(subject, "subject");
    };
    console.log(selectedSubject);
    return (
      <HStack w="100%" justifyContent="flex-start" spacing={4} flexWrap="wrap">
        {isAllSubjectPersentage && (
          <VStack
            spacing={"2.5"}
            p="2.5"
            onClick={() => isClickable && handleSelectSubject("all")}
            cursor={isClickable ? "pointer" : "default"}
            rounded={"all" === selectedSubject ? "1rem" : "16px"}
            bg={"all" === selectedSubject ? "primary.50" : "white"}
            border={"all" === selectedSubject ? "3px solid" : "transparent"}
            borderColor={
              "all" === selectedSubject ? "primary.500" : "borderColor"
            }
            width="77px"
            height="87px"
            justifyContent="center"
            alignItems="center"
          >
            <VStack spacing={1}>
              <CustomHeading
                marginBottom="0"
                textAlign="center"
                lineHeight="9px"
                fontSize="12px"
                fontWeight="700"
                textTransform="uppercase"
                title={
                  subjectIcons[
                    "all"?.toLowerCase() as keyof typeof subjectIcons
                  ]?.label || "all"
                }
                color={"primary.500"}
              />
            </VStack>
            {(typeof isAllSubjectPersentage === "string" &&
              parseInt(isAllSubjectPersentage) < 100) ||
            isAllSubjectPersentage < 100 ? (
              <Progress
                w={"100%"}
                colorScheme="progressBarGreen"
                bg="progressLightBG"
                color={"white"}
                size="xs"
                value={isAllSubjectPersentage || 0}
                rounded={"full"}
                isAnimated
              />
            ) : (
              <IconByName name="CheckCircleIcon" color="progressBarGreen.500" />
            )}
          </VStack>
        )}
        {subjects?.map(
          (subjectRow: any, index: number) =>
            subjectRow?.subject && (
              <SubjectCard
                {...{
                  subjectRow,
                  isClickable,
                  selectedSubject,
                  onSelectSubject: handleSelectSubject,
                }}
              />
            )
        )}
      </HStack>
    );
  }
);

export default SubjectGrid;

const SubjectCard = ({
  subjectRow,
  isClickable,
  selectedSubject,
  onSelectSubject,
}: {
  subjectRow: any;
  isClickable: boolean;
  selectedSubject: string;
  onSelectSubject?: (subject: string) => void;
}) => {
  const handleSelectSubject = (subject: string) => {
    if (isClickable) {
      onSelectSubject?.(subject);
    }
  };

  return (
    <VStack
      bg={subjectRow?.subject === selectedSubject ? "primary.50" : "white"}
      border={
        subjectRow?.subject === selectedSubject ? "3px solid" : "transparent"
      }
      borderColor={
        subjectRow?.subject === selectedSubject ? "primary.500" : "borderColor"
      }
      width="77px"
      height="87px"
      justifyContent="center"
      alignItems="center"
      key={`subject-${subjectRow?.subject}`}
      spacing={"2.5"}
      p="2.5"
      onClick={() => handleSelectSubject(subjectRow?.subject)}
      cursor={isClickable ? "pointer" : "default"}
      rounded={subjectRow?.subject === selectedSubject ? "1rem" : "16px"}
    >
      <VStack spacing={1}>
        <Image
          boxSize="32px"
          src={
            subjectIcons[
              subjectRow?.subject?.toLowerCase() as keyof typeof subjectIcons
            ]?.icon || kannada
          }
          alt={`${subjectRow?.subject} icon`}
        />
        <CustomHeading
          marginBottom="0"
          textAlign="center"
          lineHeight="9px"
          fontSize="12px"
          fontWeight="700"
          textTransform="uppercase"
          title={
            subjectIcons[
              subjectRow?.subject?.toLowerCase() as keyof typeof subjectIcons
            ]?.label || subjectRow?.subject
          }
          color={"primary.500"}
        />
      </VStack>
      {(typeof subjectRow?.averageCompletionPercentage === "string" &&
        parseInt(subjectRow?.averageCompletionPercentage) < 100) ||
      subjectRow?.averageCompletionPercentage < 100 ? (
        <Progress
          w={"100%"}
          colorScheme="progressBarGreen"
          bg="progressLightBG"
          color={"white"}
          size="xs"
          value={subjectRow?.averageCompletionPercentage || 0}
          rounded={"full"}
          isAnimated
        />
      ) : (
        <IconByName name="CheckCircleIcon" color="progressBarGreen.500" />
      )}
    </VStack>
  );
};
