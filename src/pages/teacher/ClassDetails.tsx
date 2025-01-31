import {
  Box,
  Button,
  Collapse,
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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { impression } from "../../services/telemetry";
import CustomHeading from "../../components/common/typography/Heading";
import Layout from "../../components/common/layout/layout";
import ClassCard from "../../components/common/cards/ClassCard";
import { getTeacherData } from "../../services/home";
import { SearchIcon } from "@chakra-ui/icons";
import IconByName from "../../components/common/icons/Icon";
import useDeviceSize from "../../components/common/layout/useDeviceSize";

export default function ClassDetails(props: any) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const { authUser } = props;
  const { board, schoolUdise, grade, medium, groupId, subject } = useParams();
  const [classDetails, setClassDetails] = useState<any>({});
  const [activeCollapse, setActiveCollapse] = useState<"sorting" | "none">(
    "none"
  );
  const { width } = useDeviceSize();
  const [selectedView, setSelectedView] = useState<string>("A-Z");
  const [radioSelection, setRadioSelection] = useState(selectedView);
  const navigate = useNavigate();
  const [students, setstudents] = useState<Array<{
    completionPercentage: string;
    username: string;
  }> | null>(null);

  useEffect(() => {
    const fetchProgramId = async () => {
      try {
        const payload = {
          groupId: groupId,
          schoolUdise: schoolUdise,
          grade: String(grade),
          medium: medium,
          board: board,
        };

        let data = await getTeacherData(payload);
        let students = await getTeacherData({
          ...payload,
          studentProgress: "true",
        });
        setstudents(students?.classResults || []);

        const classObj = {
          ...data,
          subjects: data?.subjectResults || [],
        };
        setClassDetails(classObj);
      } catch (error) {
        console.error("Error fetching program data:", error);
        setError(t("An unexpected error occurred. Please try again later."));
      }
    };

    fetchProgramId();
  }, [authUser]);

  useEffect(() => {
    impression({
      edata: {
        type: "TeacherPage",
        pageid: "TeacherPage",
        uri: "/teacher",
        query: Object.fromEntries(
          new URLSearchParams(location.search).entries()
        ),
        visits: [],
      },
    });
  }, []);

  const handleCollapseToggle = (collapse: "sorting") => {
    setActiveCollapse((prevState) => {
      const newState = prevState === collapse ? "none" : collapse;
      return newState;
    });
  };

  const handleViewChange = (radioSelection: string) => {
    if (radioSelection !== selectedView) {
      setSelectedView(radioSelection);
      setActiveCollapse("none");
    }
  };

  return (
    <Layout
      isFooterVisible={false}
      _header={{
        userInfo: false,
        isShowBackButton: true,
        headingTitle: `CLASS ${grade}`,
        onBack: () => navigate("/class"),
      }}
    >
      <VStack align={"stretch"}>
        {error ? (
          <Text color="red.500" fontSize="xl" textAlign="center" mt="10">
            {error}
          </Text>
        ) : (
          <>
            <Box p={4}>
              <ClassCard
                title={false}
                data={classDetails}
                subjectClick={() => {}}
                selectedSubject={subject || "all"}
              />
            </Box>

            <Box>
              {/* Header Section */}
              <VStack spacing={4} align="stretch" px="4">
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

              {/* Table Section */}
              <Table variant="simple" size="sm" mt={4}>
                <Thead bg={"#F2F2F2"}>
                  <Tr>
                    <Th>
                      <Text
                        lineHeight="14.4px"
                        fontFamily="Bebas Neue"
                        fontWeight="400"
                        fontSize="12px"
                      >
                        {t("LEADERBOARD_NAME")}
                      </Text>
                    </Th>
                    <Th isNumeric>
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
                  {students?.map((student, index) => (
                    <Tr key={index}>
                      <Td>{student?.username}</Td>
                      <Td isNumeric>{student?.completionPercentage}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </>
        )}

        {activeCollapse !== "none" && (
          <Box
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            bg="#0C0C0CAD"
            zIndex="10"
            onClick={() => setActiveCollapse("none")}
          />
        )}
        <Box
          position="fixed"
          bottom="0"
          zIndex="10"
          roundedTop="4"
          width={width}
          bg="white"
        >
          <Collapse in={activeCollapse === "sorting"} animateOpacity>
            <Box p="4" bg="white" borderRadius="8px" mt="2" width={width}>
              <Flex alignItems="center" justifyContent="space-between">
                <Text
                  fontFamily="Bebas Neue"
                  fontSize="24px"
                  lineHeight="28px"
                  fontWeight="400"
                  color="primary.500"
                  mb="8px"
                >
                  {t("TEACHER_SORT")}
                </Text>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <IconByName
                    name="CloseIcon"
                    color="primary.500"
                    alt="close"
                    cursor="pointer"
                    width="14px"
                    height="14px"
                    onClick={() => handleCollapseToggle("sorting")}
                  />
                </Box>
              </Flex>
              <RadioGroup
                value={radioSelection}
                onChange={(value) => setRadioSelection(value)}
                gap="8px"
              >
                <VStack align="stretch" gap="8px">
                  <Radio mt="16px" mb="16px" value="a-z">
                    <Flex justify="space-between" width="100%">
                      <Text
                        fontWeight="400"
                        fontSize="20px"
                        lineHeight="16px"
                        mr="2"
                      >
                        {t("TEACHER_A_Z")}
                      </Text>
                    </Flex>
                  </Radio>

                  <Radio mb="16px" value="z-a">
                    <Text fontWeight="400" fontSize="20px" lineHeight="16px">
                      {t("TEACHER_Z_A")}
                    </Text>
                  </Radio>
                  <Radio mb="16px" value="highToLow">
                    <Text fontWeight="400" fontSize="20px" lineHeight="16px">
                      {t("TEACHER_COMPLETIOIN_RATE_HIGH")}
                    </Text>
                  </Radio>
                  <Radio mb="16px" value="lowToHigh">
                    <Text fontWeight="400" fontSize="20px" lineHeight="16px">
                      {t("TEACHER_COMPLETIOIN_RATE_LOW")}
                    </Text>
                  </Radio>
                </VStack>
              </RadioGroup>
              <Button
                mt="4"
                colorScheme="blue"
                isDisabled={radioSelection === selectedView}
                onClick={() => handleViewChange(radioSelection)}
                width="100%"
              >
                {t("TEACHER_APPLY")}
              </Button>
            </Box>
          </Collapse>
        </Box>
      </VStack>
    </Layout>
  );
}
