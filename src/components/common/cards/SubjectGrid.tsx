import React, { memo } from "react";
import { HStack, VStack, Image, Progress } from "@chakra-ui/react";
import IconByName from "../icons/Icon";
import CustomHeading from "../typography/Heading";
import english from "../../../assets/icons/english_icon.svg";
import kannada from "../../../assets/icons/kannada_icon.svg";
import math from "../../../assets/icons/maths_icon.svg";
import odia from "../../../assets/icons/odiya_icon.svg";
import physics from "../../../assets/icons/physics_icon.svg";
import { useNavigate } from "react-router-dom";

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
}

const SubjectGrid: React.FC<SubjectGridProps> = memo(
  ({ subjects, selectedSubject, onSelectSubject, isClickable }) => {
    const navigate = useNavigate();
    const handleSelectSubject = (subject: string) => {
      onSelectSubject?.(subject);
      navigate(`/class-details`, {
        state: { selectedSubject: subject },
      });
    };

    return (
      <>
        <HStack
          w="100%"
          justifyContent="flex-start"
          spacing={4}
          flexWrap="wrap"
        >
          {subjects?.map(
            (subjectRow: any, index: number) =>
              subjectRow?.subject && (
                <VStack
                  key={`subject-${index}`}
                  spacing={"2.5"}
                  p="2.5"
                  onClick={() =>
                    isClickable && handleSelectSubject(subjectRow.subject)
                  }
                  cursor={isClickable ? "pointer" : "default"}
                  rounded={
                    subjectRow.subject === selectedSubject ? "1rem" : "16px"
                  }
                  bg={
                    subjectRow.subject === selectedSubject
                      ? "primary.50"
                      : "white"
                  }
                  border={
                    subjectRow.subject === selectedSubject
                      ? "3px solid"
                      : "transparent"
                  }
                  borderColor={
                    subjectRow.subject === selectedSubject
                      ? "primary.500"
                      : "borderColor"
                  }
                  width="77px"
                  height="87px"
                  justifyContent="center"
                  alignItems="center"
                >
                  <VStack spacing={1}>
                    <Image
                      boxSize="32px"
                      src={
                        subjectIcons[
                          subjectRow.subject?.toLowerCase() as keyof typeof subjectIcons
                        ]?.icon || kannada
                      }
                      alt={`${subjectRow.subject} icon`}
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
                          subjectRow.subject?.toLowerCase() as keyof typeof subjectIcons
                        ]?.label || subjectRow.subject
                      }
                      color={"primary.500"}
                    />
                  </VStack>
                  {(typeof subjectRow?.averageCompletionPercentage ===
                    "string" &&
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
                    <IconByName
                      name="CheckCircleIcon"
                      color="progressBarGreen.500"
                    />
                  )}
                </VStack>
              )
          )}
        </HStack>
      </>
    );
  }
);

export default SubjectGrid;
