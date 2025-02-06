import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomHeading from "../../components/common/typography/Heading";
import ActionSheet from "../../components/common/ActionSheet";
import { getTeacherData } from "../../services/home";
import IconByName from "../../components/common/icons/Icon";

interface payload {
  groupId: string;
  schoolUdise: string;
  grade: string;
  medium: string;
  board: string;
  subject?: string;
}

const subjectSort = [
  { label: "TEACHER_A_Z", value: "a-z" },
  { label: "TEACHER_Z_A", value: "z-a" },
  { label: "TEACHER_COMPLETIOIN_RATE_HIGH", value: "highToLow" },
  { label: "TEACHER_COMPLETIOIN_RATE_LOW", value: "lowToHigh" },
];

const Students: React.FC<payload> = (payload) => {
  const { t } = useTranslation();

  const [students, setstudents] = useState<Array<{
    completionPercentage: string;
    username: string;
  }> | null>(null);

  const [activeCollapse, setActiveCollapse] = useState<string | undefined>(
    undefined
  );
  const [radioSelection, setRadioSelection] = useState<string | undefined>(
    undefined
  );
  const [selectedView, setSelectedView] = useState<string | undefined>(
    undefined
  );
  const [searchText, setSearchText] = useState<string>("");

  const handleCollapseToggle = (collapse: string) => {
    setActiveCollapse(collapse === activeCollapse ? undefined : collapse);
  };

  const handleViewChange = (view: string) => {
    setSelectedView(view);
    setActiveCollapse(undefined);
  };

  const filterSubjects = (students: Array<any>) => {
    const filteredStudents = students.filter((student) =>
      student.username.toLowerCase().includes(searchText.toLowerCase())
    );
    if (selectedView === "highToLow") {
      filteredStudents.sort(
        (a, b) =>
          Number(b.completionPercentage) - Number(a.completionPercentage)
      );
    } else if (selectedView === "lowToHigh") {
      filteredStudents.sort(
        (a, b) =>
          Number(a.completionPercentage) - Number(b.completionPercentage)
      );
    } else if (selectedView === "a-z") {
      filteredStudents.sort((a, b) => a.username.localeCompare(b.username));
    } else if (selectedView === "z-a") {
      filteredStudents.sort((a, b) => b.username.localeCompare(a.username));
    }
    return filteredStudents;
  };

  React.useEffect(() => {
    const init = async () => {
      let students = await getTeacherData({
        ...payload,
        studentProgress: "true",
      });
      setstudents(
        students?.userCompletionPercentages || students?.classResults || []
      );
    };
    init();
  }, [payload]);

  return (
    <VStack align={"stretch"} spacing={4}>
      <ActionSheet
        isOpen={activeCollapse === "sorting"}
        onClose={() => handleCollapseToggle("none")}
        headerComponent={
          <Flex alignItems="center" justifyContent="space-between">
            <Text
              fontFamily="Bebas Neue"
              fontSize="24px"
              lineHeight="28px"
              fontWeight="400"
              color="primary.500"
            >
              {t("TEACHER_SORT")}
            </Text>
          </Flex>
        }
      >
        <VStack spacing={4} alignItems={"flex-start"} px="4">
          <RadioGroup
            value={radioSelection}
            onChange={(value) => setRadioSelection(value)}
            w="100%"
          >
            <VStack align={"stretch"} spacing={"6px"}>
              {subjectSort.map(({ label, value }) => (
                <Radio
                  value={value}
                  key={value}
                  py="4"
                  colorScheme="primary"
                  size="lg"
                >
                  <Text fontWeight="400" fontSize="20px" lineHeight="16px">
                    {t(label)}
                  </Text>
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
          <Button
            colorScheme="blue"
            isDisabled={radioSelection === selectedView}
            onClick={() => handleViewChange(radioSelection || "")}
            width="100%"
            mb="3"
          >
            {t("TEACHER_APPLY")}
          </Button>
        </VStack>
      </ActionSheet>
      {/* Header Section */}
      <VStack spacing={4} align="stretch">
        <CustomHeading
          lineHeight="20px"
          fontFamily="Inter"
          variant="h2"
          fontSize="20px"
          fontWeight="500"
          title={t("TEACHER_STUDENT_PROGRESS")}
          color="textPrimary"
        />
        <HStack w="100%" gap="8px">
          <InputGroup flex="4" height="46px">
            <InputRightElement pointerEvents="none">
              <SearchIcon color="primary.500" />
            </InputRightElement>
            <Input
              placeholder={t("TEACHER_SEARCH_STUDENT")}
              height="100%"
              borderRadius="8px"
              padding="12px"
              border="2px solid #C5C5C5"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
          </InputGroup>

          <Button
            flex="1"
            p={1}
            variant="solid"
            color="#3A3A3A"
            bg="tsSeaBlue20"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="16px"
            height="46px"
            _hover={{
              bg: "tsSeaBlue30",
              cursor: "pointer",
            }}
            _active={{
              bg: "tsSeaBlue20",
            }}
            onClick={() => handleCollapseToggle("sorting")}
          >
            <Text mr="8px">Sort</Text>
            <IconByName
              boxSize="15px"
              name="SwapVertIcon"
              color="primary.500"
            />
          </Button>
        </HStack>
      </VStack>
      <Table variant="simple">
        <Thead bg={"backgroundGrey"}>
          <Tr>
            <Th p="3">
              <Text
                lineHeight="14.4px"
                fontFamily="Bebas Neue"
                fontWeight="400"
                fontSize="12px"
              >
                {t("LEADERBOARD_NAME")}
              </Text>
            </Th>
            <Th p="3" isNumeric>
              <Text
                lineHeight="14.4px"
                fontFamily="Bebas Neue"
                fontWeight="400"
                fontSize="12px"
              >
                {t("TEACHER_COMPLETION_RATE")}
              </Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {filterSubjects(students || []).map((student, index) => (
            <Tr key={index}>
              <Td p="2">{student.username}</Td>
              <Td p="2" isNumeric>
                {student.completionPercentage} %
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default memo(Students);
