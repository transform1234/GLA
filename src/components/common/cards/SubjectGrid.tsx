import { HStack, Image, Progress, VStack } from "@chakra-ui/react";
import React, { memo } from "react";
import english from "../../../assets/icons/english_icon.svg";
import kannada from "../../../assets/icons/kannada_icon.svg";
import math from "../../../assets/icons/maths_icon.svg";
import odia from "../../../assets/icons/odiya_icon.svg";
import physics from "../../../assets/icons/physics_icon.svg";
import IconByName from "../icons/Icon";
import CustomHeading from "../typography/Heading";
import { chunk } from "lodash";

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
    const [subjectItems, setSubjects] = React.useState<Array<any>>([]);
    const handleSelectSubject = (subject: string) => {
      onSelectSubject?.(subject);
    };
    React.useEffect(() => {
      if (!subjects) return;
      let newSubject = [...subjects];
      if (isAllSubjectPersentage) {
        newSubject = [
          {
            subject: "all",
            percentage: isAllSubjectPersentage,
            isClickable,
          },
          ...newSubject,
        ];
      }
      const data = chunk(newSubject, 4);
      setSubjects(data);
    }, [subjects]);

    return (
      <VStack w="100%" spacing={4}>
        {subjectItems?.map((subject, index) => (
          <HStack
            key={`subject-${index}`}
            w="100%"
            // divider={<StackDivider borderColor="gray.200" margin="0" />}
            justifyContent={subject.length < 4 ? "flex-start" : "space-around"}
          >
            {subject &&
              subject?.map(
                (subjectRow: any, index: number) =>
                  subjectRow?.subject && (
                    <SubjectCard
                      key={`subject-${index}1`}
                      {...{
                        percentage: subjectRow?.percentage || 0,
                        subject: subjectRow?.subject,
                        isClickable,
                        selectedSubject: selectedSubject || undefined,
                        onSelectSubject: handleSelectSubject,
                      }}
                    />
                  )
              )}
          </HStack>
        ))}
      </VStack>
    );
  }
);

export default SubjectGrid;

const SubjectCard = ({
  isClickable,
  percentage,
  subject,
  selectedSubject,
  onSelectSubject,
}: {
  percentage: number;
  subject: string;
  isClickable?: boolean;
  selectedSubject?: string;
  onSelectSubject?: (subject: string) => void;
}) => {
  const handleSelectSubject = (subject: string) => {
    if (isClickable) {
      onSelectSubject?.(subject);
    }
  };

  return (
    <VStack
      bg={subject === selectedSubject ? "primary.50" : "white"}
      border={subject === selectedSubject ? "3px solid" : "transparent"}
      borderColor={subject === selectedSubject ? "primary.500" : "borderColor"}
      width="77px"
      height="87px"
      justifyContent="center"
      alignItems="center"
      key={`subject-${subject}`}
      spacing={"2.5"}
      p="2.5"
      onClick={() => handleSelectSubject(subject)}
      cursor={isClickable ? "pointer" : "default"}
      rounded={subject === selectedSubject ? "1rem" : "16px"}
    >
      <VStack spacing={1}>
        {subjectIcons[subject?.toLowerCase() as keyof typeof subjectIcons]
          ?.icon && (
          <Image
            boxSize="32px"
            src={
              subjectIcons[subject?.toLowerCase() as keyof typeof subjectIcons]
                ?.icon || kannada
            }
            alt={`${subject} icon`}
          />
        )}
        <CustomHeading
          marginBottom="0"
          textAlign="center"
          lineHeight="9px"
          fontSize="12px"
          fontWeight="700"
          textTransform="uppercase"
          title={
            subjectIcons[subject?.toLowerCase() as keyof typeof subjectIcons]
              ?.label || subject
          }
          color={"primary.500"}
        />
      </VStack>
      {(typeof percentage === "string" && parseInt(percentage) < 100) ||
      percentage < 100 ? (
        <Progress
          w={"100%"}
          colorScheme="progressBarGreen"
          bg="progressLightBG"
          color={"white"}
          size="xs"
          value={percentage || 0}
          rounded={"full"}
          isAnimated
        />
      ) : (
        <IconByName name="CheckCircleIcon" color="progressBarGreen.500" />
      )}
    </VStack>
  );
};
