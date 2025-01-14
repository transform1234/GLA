import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import Layout from "../../components/common/layout/layout";
import { impression } from "../../services/telemetry";
import {
  getLeaderboardFilter,
  getCurrentUserdetail,
} from "../../services/home";
import useDeviceSize from "../../components/common/layout/useDeviceSize";
import { useTranslation } from "react-i18next";
import IconByName from "../../components/common/icons/Icon";
import moment from "moment";
interface UserData {
  rank: number;
  points: number[];
  winTime: string;
  recentWinCoins:number;
}


const LeaderboardScreen: React.FC = (props:any) => {
  const { width } = useDeviceSize();
  const [data, setData] = useState([]);
  const [coninsData, setCoinsData] = useState<any>();
  const [myData, setMyData] = useState<UserData>();
  const [daysFilter, setDaysFilter] = useState([]);
  const [filter, setFilter] = useState({ searchTerm: "", days: null });
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState<string>("School");
  const [activeCollapse, setActiveCollapse] = useState<"none" | "history" | "view">("none");
  const [radioSelection, setRadioSelection] = useState(selectedView);
  const LeaderBoardFilter :any= [
    { subject: "Last 7 Days" , value : "last7days"},
    { subject: "Last 30 Days" , value : "last30days" },
    { subject: "Today" , value : "today" }
  ];
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);
  const isLeaderBoardPoints = useRef(false);
  const IdentifiersList = {
    assesment_completion: {label: "Assement Completion" },
    lesson_completion: { label: "Lesson Completion" },
  };
  const groupId = props?.authUser?.GroupMemberships[0]?.Group?.groupId;

  useEffect(() => {
    localStorage.setItem("dropdownFilter", selectedView);
  }, [selectedView]);


  const handleCollapseToggle = (collapse: "history" | "view") => {
    setActiveCollapse((prevState) =>
      prevState === collapse ? "none" : collapse
    );
  };


  useEffect(() => {
    setDaysFilter(LeaderBoardFilter);
    const localFilter = getLocalStorageFilter();
    setFilter(localFilter || { searchTerm: "", days: null });
  }, []);

  // Fetch user rank, coins, and history
  const getAllData = async (subject: string,selectedView : any) => {
    if (isLeaderBoardPoints.current) return;
    isLeaderBoardPoints.current = true;
    try {
      let filters: { [key: string]: string | null } = {};
      if (subject === "School") {
        filters = {
          schoolUdise: localStorage.getItem("school_udise") || "",
        };
      } else if (subject === "Board") {
        filters = {
          board: localStorage.getItem("board") || "",
        };
      } else if (subject === "Class") {
        filters = {
          groupId: groupId
        };
      }

      const payloadData = {
        filters: filters,
        timeframe: selectedView,
      };
      const leaderboardData: any = await getLeaderboardFilter(payloadData);
      setData(leaderboardData[0]);
      setMyData(leaderboardData[1])
      
    } catch (error) {
      console.error("Error making API call:", error);
    } finally {
      isLeaderBoardPoints.current = false;
    }
  };

  
  useEffect(() => {
    const fetchUserStats = async () => {
      await getAllData("School","allDay");
    };

    fetchUserStats();
  }, []);

  const fetchUserData = async (currentPage: number) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const data: any = await getCurrentUserdetail(currentPage);
      setCoinsData((prevData:any) => ({
        ...prevData,
        points: [...(prevData?.points || []), ...data?.points],
      }));
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchUserData(page);
  }, [page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };   

  const getLocalStorageFilter = () => {
    const filterString = localStorage.getItem("watchFilter");
    try {
      return filterString
        ? JSON.parse(filterString)
        : { searchTerm: "", days: "" };
    } catch (err) {
      return { searchTerm: "", days: "" };
    }
  };

  const handleSelectedViewChange = (newSelectedView: string) => {
    setSelectedView(newSelectedView);
  };


  return (
    <>
      <Box position="relative">
        <Layout
          isFooterVisible={false}
          _header={{
            bottomComponent: (
              <BottomComponent
                daysFilter={daysFilter}
                selectedFilter={filter.days || ""}
                groupId={groupId}
                onSelectFilter={(days) =>
                  setFilter((prev: any) => ({ ...prev, days }))
                }
                selectedView={selectedView}
                setData={setData}
                setMyData={setMyData}
              />
            ),
            onFilterClick: () => handleCollapseToggle("view"),
            selectedView: selectedView,
          }}
        >
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

          <Box mx="auto" my="4" px="4" bg="white" overflowY="auto" maxH="658px">
            <TableContainer>
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th>{t("LEADERBOARD_NAME")}</Th>
                    <Th textAlign="center">{t("LEADERBOARD_RANK")}</Th>
                    <Th textAlign="right">{t("LEADERBOARD_COINS")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((item: any, index) => (
                    <Tr key={index}>
                      <Td>
                        <Text
                          textTransform="capitalize"
                          lineHeight="19.36px"
                          fontWeight="400"
                          fontSize="16px"
                        >
                          {item?.userId === localStorage.getItem("id")
                            ? "You"
                            : item?.name}
                        </Text>
                        <Text
                          variant="italicText"
                          fontWeight="400"
                          fontSize="10px"
                          lineHeight="12.1px"
                          color="lightGrey"
                        >
                          {item?.className}
                        </Text>
                      </Td>

                      <Td textAlign="center">
                        <Text
                          fontWeight="700"
                          fontSize="14px"
                          lineHeight="16.94px"
                          textAlign="center"
                        >
                          {item?.rank}
                        </Text>
                      </Td>
                      <Td textAlign="right">
                        <Text
                          fontWeight="700"
                          fontSize="14px"
                          lineHeight="16.94px"
                          textAlign="right"
                        >
                          {item?.points}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          {/* Sticky Footer */}
          <Box
            position="fixed"
            bottom="0"
            zIndex="10"
            borderTopLeftRadius="16px"
            borderTopRightRadius="16px"
            width={width}
            bg={activeCollapse === "none" ? "yellow.500" : "white"}
          >
            {activeCollapse === "history" && (
              <Box
                bg="yellow.500"
                position="fixed"
                bottom="0"
                boxShadow="0px -1px 3px 0px #0000000D"
                _hover={{
                  boxShadow: '0px -5px 5px 0px #0000000A',
                }}
                _active={{
                  boxShadow: '0px -11px 6px 0px #00000005',
                }}
                p="4"
                zIndex="10"
                borderTopLeftRadius="16px"
                borderTopRightRadius="16px"
                width={width}
              >
                <Collapse in={activeCollapse === "history"} animateOpacity>
                  <Box bg="yellow.500" rounded="md" shadow="lg">
                    <Flex
                      width={width}
                      justifyContent="space-between"
                      alignItems="center"
                      mb="4"
                      borderBottom="1px solid #10162E"
                      pb="2"
                    >
                      {/* Title: Coins History */}
                      <Text
                        fontSize="24px"
                        fontFamily="Bebas Neue"
                        fontWeight="700"
                        whiteSpace="nowrap"
                      >
                        {t("LEADERBOARD_COINS_HISTORY")}
                      </Text>

                      {/* Right Section: Rank, Coins, and Close Button */}
                      <Flex
                        gap="4"
                        alignItems="center"
                        justifyContent="space-between"
                        pr="20px"
                      >
                        {/* Your Rank */}
                        <Box textAlign="center">
                          <Text
                            fontFamily="Bebas Neue"
                            fontWeight="400"
                            fontSize="12px"
                            whiteSpace="nowrap"
                          >
                            {t("LEADERBOARD_YOUR_RANK")}
                          </Text>
                          <Text
                            fontSize="20px"
                            fontWeight="700"
                            textAlign="left"
                          >
                            {myData?.rank}
                          </Text>
                        </Box>

                        {/* Your Coins */}
                        <Box textAlign="center">
                          <Text
                            fontFamily="Bebas Neue"
                            fontWeight="400"
                            fontSize="12px"
                            whiteSpace="nowrap"
                          >
                            {t("LEADERBOARD_YOUR_COINS")}
                          </Text>
                          <Text
                            textAlign="left"
                            fontSize="20px"
                            fontWeight="700"
                          >
                            {myData?.points}
                          </Text>
                        </Box>

                        {/* Close Button */}
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <IconByName
                            name="CloseIcon"
                            color="textPrimary"
                            alt="close"
                            cursor="pointer"
                            width="2em"
                            height="2em"
                            onClick={() => handleCollapseToggle("history")}
                          />
                        </Box>
                      </Flex>
                    </Flex>

                    <VStack
                      align="stretch"
                      spacing="0"
                      onScroll={handleScroll}
                      maxH="620px"
                      overflowY="auto"
                    >
                      <Box
                        bg="yellow.300"
                        p="10px"
                        borderTopLeftRadius="16px"
                        borderTopRightRadius="16px"
                        borderBottom="1px solid"
                        borderColor="yellow.500"
                      >
                        {coninsData?.points?.length > 0 ? (
                          coninsData?.points?.map(
                            (item: any, index: number) => (
                              <Box
                                key={index}
                                p="5px"
                                borderBottom="1px solid"
                                borderColor="lightGrey"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Box>
                                  <Text
                                    lineHeight="19.36px"
                                    fontSize="16px"
                                    fontWeight="700"
                                  >
                                    {item?.points} {t("LEADERBOARD_COINS")}
                                  </Text>
                                  <Text
                                    fontWeight="400"
                                    fontSize="10px"
                                    lineHeight="12.1px"
                                    color="lightGrey"
                                    variant="italicText"
                                  >
                                    {moment(item?.created_at).format(
                                      "D MMM, YYYY"
                                    )}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text
                                    lineHeight="16.94px"
                                    fontSize="14px"
                                    fontWeight="700"
                                    textAlign="center"
                                  >
                                    {IdentifiersList[
                                      item?.identifier?.toLowerCase() as keyof typeof IdentifiersList
                                    ]?.label || item?.identifier}
                                  </Text>
                                </Box>
                              </Box>
                            )
                          )
                        ) : (
                          <Text>No data available</Text>
                        )}
                        {loading && <Text>Loading...</Text>}
                      </Box>
                    </VStack>
                  </Box>
                </Collapse>
              </Box>
            )}

            {activeCollapse === "view" && (
              <Collapse in={activeCollapse === "view"} animateOpacity>
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
                      {t("LEADERBOARD_VIEW")}
                    </Text>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <IconByName
                        name="CloseIcon"
                        color="primary.500"
                        alt="close"
                        cursor="pointer"
                        width="14px"
                        height="14px"
                        onClick={() => handleCollapseToggle("view")}
                      />
                    </Box>
                  </Flex>
                  <Text
                    mb="16px"
                    lineHeight="14px"
                    fontWeight="400"
                    fontSize="14px"
                    color="lightGrey"
                  >
                    {t("LEADERBOARD_HOW_YOU_STAND_WITH_OTHER")}
                  </Text>
                  <RadioGroup
                    value={radioSelection}
                    onChange={(value) => setRadioSelection(value)}
                    gap="8px"
                  >
                    <VStack align="stretch" gap="8px">
                      <Radio mt="16px" mb="16px" value="School">
                        <Flex justify="space-between" width="100%">
                          <Text
                            fontWeight="400"
                            fontSize="20px"
                            lineHeight="16px"
                            mr="2"
                          >
                            {t("LEADERBOARD_SCHOOL")}
                          </Text>
                          <Text
                            fontWeight="400"
                            fontSize="12px"
                            lineHeight="16px"
                            variant="italicText"
                          >
                            {t("LEADERBOARD_DEFAULT")}
                          </Text>
                        </Flex>
                      </Radio>

                      <Radio mb="16px" value="Class">
                        <Text
                          fontWeight="400"
                          fontSize="20px"
                          lineHeight="16px"
                        >
                          {t("LEADERBOARD_CLASS")}
                        </Text>
                      </Radio>
                      <Radio mb="16px" value="Board">
                        <Text
                          fontWeight="400"
                          fontSize="20px"
                          lineHeight="16px"
                        >
                          {t("LEADERBOARD_BOARD")}
                        </Text>
                      </Radio>
                    </VStack>
                  </RadioGroup>
                  <Button
                    mt="4"
                    colorScheme="blue"
                    isDisabled={radioSelection === selectedView}
                    onClick={() => {
                      setSelectedView(radioSelection);
                      setActiveCollapse("none");
                      handleSelectedViewChange(radioSelection);
                      getAllData(radioSelection, filter.days);
                      fetchUserData(page);
                    }}
                    width="100%"
                  >
                    {t("LEADERBOARD_APPLY")}
                  </Button>
                </Box>
              </Collapse>
            )}

            {activeCollapse === "none" && (
              <Box
                bg="yellow.500"
                position="fixed"
                bottom="0"
                boxShadow="0px -1px 3px 0px #0000000D"
                _hover={{
                  boxShadow: "0px -5px 5px 0px #0000000A",
                }}
                _active={{
                  boxShadow: "0px -11px 6px 0px #00000005",
                }}
                p="4"
                zIndex="10"
                borderTopLeftRadius="16px"
                borderTopRightRadius="16px"
                width={width}
              >
                <Flex justifyContent="space-between" alignItems="center">
                  {!activeCollapse.includes("history") ? (
                    <>
                      <Flex flexDirection="column">
                        <Text
                          fontFamily="Bebas Neue"
                          fontWeight="400"
                          fontSize="12px"
                          lineHeight="16px"
                          color="yellow.900"
                          whiteSpace="nowrap"
                        >
                          {t("LEADERBOARD_YOUR_RANK")}
                        </Text>
                        <Text
                          fontWeight="700"
                          fontSize="20px"
                          color="yellow.900"
                          textAlign="start"
                        >
                          {myData?.rank}
                        </Text>
                      </Flex>

                      {/* Vertical Divider */}
                      <Box
                        height="40px"
                        width="1px"
                        bg="yellow.900"
                        mx="4"
                        opacity="40%"
                      />

                      {/* YOUR COINS */}
                      <Flex flexDirection="column">
                        <Text
                          fontFamily="Bebas Neue"
                          fontWeight="400"
                          fontSize="12px"
                          lineHeight="16px"
                          color="yellow.900"
                          whiteSpace="nowrap"
                        >
                          {t("LEADERBOARD_YOUR_COINS")}
                        </Text>
                        <Text
                          fontWeight="700"
                          fontSize="20px"
                          color="yellow.900"
                          textAlign="start"
                        >
                          {myData?.points}
                        </Text>
                      </Flex>

                      {/* Vertical Divider */}

                      {/* +32 Coins for Quiz */}
                      <Flex flexDirection="column">
                        <Text
                          fontWeight="900"
                          fontSize="12px"
                          lineHeight="16px"
                          color="yellow.900"
                          whiteSpace="nowrap"
                        >
                          +{myData?.recentWinCoins}{" "}
                          {t("LEADERBOARD_CONIS_FOR_QUIZ")}
                        </Text>
                        <Text
                          fontWeight="400"
                          fontSize="8px"
                          color="yellow.900"
                          textAlign="start"
                        >
                          {myData?.winTime}
                        </Text>
                      </Flex>

                      {/* VIEW HISTORY Button */}
                      <Button
                        width="122px"
                        height="40px"
                        borderRadius="46px"
                        fontWeight="700"
                        fontSize="12px"
                        bg="white"
                        color="yellow.900"
                        lineHeight="24px"
                        px="6"
                        onClick={() => handleCollapseToggle("history")}
                        _hover={{
                          borderColor: "transparent",
                          bg: "yellow.300",
                          boxShadow: "0px -5px 5px 0px #0000000A",
                        }}
                      
                      >
                        {t("LEADERBOARD_VIEW_HISTORY")}
                      </Button>
                    </>
                  ) : (
                    <div></div>
                  )}
                </Flex>
              </Box>
            )}
          </Box>
        </Layout>
      </Box>
    </>
  );
};

export default LeaderboardScreen;

interface BottomComponentProps {
  daysFilter: Array<any>;
  selectedFilter: string | null;
  onSelectFilter: (subject: string) => void;
  selectedView: string;
  setData: (data: any) => void;
  setMyData: (data:any) => void;
  groupId: string;
}

const BottomComponent: React.FC<BottomComponentProps> = ({
  daysFilter,
  selectedFilter,
  onSelectFilter,
  selectedView,
  setData,
  setMyData,
  groupId
}) => {
  const handleFilterSelect = async (subject: string) => {
    try {
      let filters: { [key: string]: string | null } = {};

      if (selectedView === "School") {
        filters = {
          schoolUdise: localStorage.getItem("school_udise") || "",
        };
      } else if (selectedView === "Board") {
        filters = {
          board: localStorage.getItem("board") || "",
        };
      } else if (selectedView === "Class") {
        filters = {
          groupId: groupId
        };
      }

      const payloadData = {
        filters: filters,
        timeframe: subject,
      };
      const leaderboardData: any = await getLeaderboardFilter(payloadData);

      onSelectFilter(subject);
      setData(leaderboardData[0]);
      setMyData(leaderboardData[1])
    } catch (error) {
      console.error("Error making API call:", error);
    }
  };

  return (
    <HStack
      gap={2}
      overflowX="auto"
      sx={{
        "::-webkit-scrollbar": {
          width: "0",
        },
      }}
    >
      <Box
        bg={
          selectedFilter === "" || "allDay" === selectedFilter
            ? "primary.500"
            : "#E3F9FF33"
        }
        borderColor={
          selectedFilter === "" || "allDay" === selectedFilter
            ? "none"
            : "white"
        }
        border={
          selectedFilter === "" || "allDay" === selectedFilter
            ? "none"
            : "1px solid"
        }
        color="white"
        fontFamily="Inter"
        fontWeight="700"
        cursor="pointer"
        px="10px"
        py="7px"
        rounded={8}
        onClick={() => handleFilterSelect("allDay")}
      >
        All Time
      </Box>

      {daysFilter &&
        daysFilter.map((sub: any) => (
          <Box
            key={sub.value}
            bg={sub.value === selectedFilter ? "primary.500" : "#E3F9FF33"}
            borderColor={sub.value === selectedFilter ? "none" : "white"}
            border={sub.value === selectedFilter ? "none" : "1px solid"}
            color="white"
            fontFamily="Inter"
            lineHeight="16.41px"
            fontSize="14px"
            fontWeight="500"
            cursor="pointer"
            px="10px"
            py="7px"
            rounded={8}
            onClick={() => handleFilterSelect(sub.value)}
          >
            {sub.subject}
          </Box>
        ))}
    </HStack>
  );
};
