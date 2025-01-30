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
import BottomComponent from "../../components/common/layout/BottomComponent";
import Loading from "../../components/common/Loading";
import { useNavigate } from "react-router-dom";
interface UserData {
  rank: number;
  points: number;
  lastEarnedPoints: any[];
}

const LeaderboardScreen: React.FC = (props: any) => {
  const { width } = useDeviceSize();
  const [data, setData] = useState([]);
  const [coninsData, setCoinsData] = useState<any>();
  const [myData, setMyData] = useState<UserData>();
  const { t } = useTranslation();
  const [activeCollapse, setActiveCollapse] = useState<
    "none" | "history" | "view"
  >("none");
  const daysFilter = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last 30 Days", value: "last30days" },
    { label: "All time", value: "allday" },
  ];
  const [filter, setFilter] = useState<{ days: string; type: string }>({
    days: "last7days",
    type: "School",
  });
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);
  const isLeaderBoardPoints = useRef(false);
  const IdentifiersList = {
    assesment_completion: { label: "Assement Completion" },
    lesson_completion: { label: "Lesson Completion" },
  };
  const [bodyHeight, setBodyHeight] = useState<number>(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    impression({
      edata: {
        type: "Leaderboard",
        pageid: "LEADERBOARD",
        uri: "/leaderboard",
        query: Object.fromEntries(
          new URLSearchParams(location.search).entries()
        ),
        visits: [],
      },
    });
  }, []);

  const handleCollapseToggle = (collapse: "history" | "view") => {
    setActiveCollapse((prevState) =>
      prevState === collapse ? "none" : collapse
    );
  };

  // Fetch user rank, coins, and history
  const getAllData = async () => {
    if (isLeaderBoardPoints.current) return;
    isLeaderBoardPoints.current = true;
    try {
      let newFilters: { [key: string]: string | null } = {};
      if (filter?.type === "School") {
        newFilters = {
          schoolUdise:
            props?.authUser?.GroupMemberships[0]?.School?.udiseCode || "" || "",
        };
      } else if (filter?.type === "Board") {
        newFilters = {
          board: props?.authUser?.GroupMemberships[0]?.Group?.board || "",
        };
      } else if (filter?.type === "Class") {
        newFilters = {
          groupId: props?.authUser?.GroupMemberships[0]?.Group?.groupId || "",
        };
      }
      const payloadData = {
        filters: newFilters,
        timeframe: filter?.days,
      };
      const leaderboardData = await getLeaderboardFilter(payloadData);
      setData(leaderboardData?.[0]);
      setMyData(leaderboardData?.[1]);
    } catch (error) {
      console.error("Error making API call:", error);
    } finally {
      isLeaderBoardPoints.current = false;
    }
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      setLoading(true);
      try {
        await getAllData();
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [JSON.stringify(filter)]);

  const fetchUserData = async (currentPage: number) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const data: any = await getCurrentUserdetail(currentPage);

      if (!data || !Array.isArray(data.points) || data.points.length === 0) {
        setHasMoreData(false);
        return;
      }
      setCoinsData((prevData: any) => ({
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
    if (scrollHeight - scrollTop === clientHeight && !loading && hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleViewChange = (radioSelection: string) => {
    setActiveCollapse("none");
    setCoinsData({ points: [] });
    setFilter((prev: any) => ({ ...prev, type: radioSelection }));
    fetchUserData(1);
    setPage(1);
    setHasMoreData(true);
  };

  return (
    <Layout
      getHeight={({ bodyHeight: bHeight }) => setBodyHeight(bHeight)}
      isFooterVisible={false}
      _header={{
        bottomComponent: (
          <BottomComponent
            selectedItem={filter.days || ""}
            items={daysFilter}
            onSelectItem={(days) =>
              setFilter((prev: any) => ({ ...prev, days }))
            }
          />
        ),
        selectedView: filter?.type,
        userInfo: false,
        rightComponent: (
          <HeaderWithFilters
            heading={t("LEADERBOARD")}
            onBack={() => navigate("/home")}
            onFilterClick={() => handleCollapseToggle("view")}
            selectedView="Class"
          />
        ),
        // isLeaderBoardFilters: {
        //   icon: true,
        //   heading: t("LEADERBOARD"),
        //   backTo: "home",
        // },
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
      {loading ? (
        <Loading width="100%" height={bodyHeight} />
      ) : (
        <TableContainer p="4" pb="80px" overflowY="auto" maxHeight={bodyHeight}>
          <Table variant="simple" size="md">
            <Thead position="sticky" top="0" zIndex="1" bg="white">
              <Tr>
                <Th color="textPrimary">{t("LEADERBOARD_NAME")}</Th>
                <Th color="textPrimary" textAlign="center">
                  {t("LEADERBOARD_RANK")}
                </Th>
                <Th color="textPrimary" textAlign="right">
                  {t("LEADERBOARD_COINS")}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item: any, index) => (
                <Tr key={index}>
                  <Td p="2">
                    <Text
                      textTransform="capitalize"
                      lineHeight="19.36px"
                      fontWeight="400"
                      fontSize="16px"
                      color={"darkBlue.500"}
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
                  <Td textAlign="center" p="2">
                    <Text
                      fontWeight="700"
                      fontSize="14px"
                      lineHeight="16.94px"
                      textAlign="center"
                    >
                      {item?.rank}
                    </Text>
                  </Td>
                  <Td textAlign="right" p="2">
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
      )}

      {/* Sticky Footer */}
      <Box
        position="fixed"
        bottom="0"
        zIndex="10"
        roundedTop="4"
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
                      <Text fontSize="20px" fontWeight="700" textAlign="left">
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
                      <Text textAlign="left" fontSize="20px" fontWeight="700">
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
                      coninsData?.points?.map((item: any, index: number) => (
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
                              {moment(item?.created_at).format("D MMM, YYYY")}
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
                      ))
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
        <PopupCustom
          {...{
            activeCollapse,
            width,
            defaultValue: filter?.type || "",
            handleCollapseToggle,
            handleViewChange,
            t,
          }}
        />
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
            {!activeCollapse.includes("history") ? (
              <HStack justifyContent="space-between" alignItems="center">
                <HStack spacing={3}>
                  <VStack spacing={0}>
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
                  </VStack>

                  {/* Vertical Divider */}
                  <Box
                    height="24px"
                    width="1px"
                    bg="yellow.900"
                    mx="3"
                    opacity="40%"
                  />

                  {/* YOUR COINS */}
                  <VStack spacing={0}>
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
                  </VStack>

                  {/* +32 Coins for Quiz */}
                  <VStack spacing={0} pl="1">
                    <Text
                      fontWeight="900"
                      fontSize="12px"
                      lineHeight="16px"
                      color="yellow.900"
                      whiteSpace="nowrap"
                    >
                      +{myData?.lastEarnedPoints?.[0]?.points}
                      {t("LEADERBOARD_CONIS_FOR_QUIZ")}
                    </Text>
                    <Text
                      fontWeight="400"
                      fontSize="8px"
                      color="yellow.900"
                      textAlign="start"
                      lineHeight="16px"
                    >
                      {myData?.lastEarnedPoints?.[0]?.created_at &&
                        moment(
                          myData?.lastEarnedPoints?.[0]?.created_at
                        ).fromNow()}
                    </Text>
                  </VStack>
                </HStack>
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
              </HStack>
            ) : (
              <div></div>
            )}
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default LeaderboardScreen;

interface PopupProps {
  activeCollapse: "history" | "view" | "none";
  width: string | number;
  defaultValue: string;
  handleCollapseToggle: (collapse: "history" | "view") => void;
  handleViewChange: (type: string) => void;
  t: any;
}

const PopupCustom: React.FC<PopupProps> = ({
  activeCollapse,
  width,
  defaultValue,
  handleCollapseToggle,
  handleViewChange,
  t,
}) => {
  const [radioValue, setRadioValue] = useState(defaultValue || "School");

  return (
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
          <Box display="flex" alignItems="center" justifyContent="center">
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
          value={radioValue}
          onChange={(value) => setRadioValue(value)}
          gap="8px"
        >
          <VStack align="stretch" gap="8px">
            <Radio mt="16px" mb="16px" value="School">
              <Flex justify="space-between" width="100%">
                <Text fontWeight="400" fontSize="20px" lineHeight="16px" mr="2">
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
              <Text fontWeight="400" fontSize="20px" lineHeight="16px">
                {t("LEADERBOARD_CLASS")}
              </Text>
            </Radio>
            <Radio mb="16px" value="Board">
              <Text fontWeight="400" fontSize="20px" lineHeight="16px">
                {t("LEADERBOARD_BOARD")}
              </Text>
            </Radio>
          </VStack>
        </RadioGroup>
        <Button
          mt="4"
          colorScheme="blue"
          onClick={() => {
            handleViewChange(radioValue);
          }}
          width="100%"
        >
          {t("LEADERBOARD_APPLY")}
        </Button>
      </Box>
    </Collapse>
  );
};

interface HeaderWithFiltersProps {
  heading: string;
  onBack?: () => void;
  onFilterClick?: (type: string) => void;
  selectedView?: string;
  rightComponent?: React.ReactNode;
}

const HeaderWithFilters: React.FC<HeaderWithFiltersProps> = ({
  heading,
  onBack,
  onFilterClick,
  selectedView,
  rightComponent,
}) => {
  return (
    <HStack alignItems="center" justifyContent={"space-between"} mb={4}>
      {/* Back Icon & Heading */}
      <HStack spacing={2}>
        <IconByName
          name={"BackIcon"}
          color="white"
          alt="Back"
          cursor="pointer"
          onClick={onBack}
        />
        <Text
          lineHeight="16px"
          fontWeight="400"
          fontSize="20px"
          color="white"
          fontFamily="Bebas Neue"
        >
          {heading}
        </Text>
      </HStack>

      {/* Right Side (Customizable) */}
      {rightComponent || (
        <HStack spacing={2}>
          <Text
            color="white"
            fontWeight="400"
            fontSize="10px"
            lineHeight="12.1px"
            cursor="default"
          >
            VIEW
          </Text>
          <HStack
            height={"38px"}
            bg="white"
            color="black"
            padding="7px 6px 7px 10px"
            borderRadius="8px"
            border="1px solid borderGrey"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => onFilterClick && onFilterClick("dropdown")}
            cursor="pointer"
          >
            <Text fontSize="14px" color="black">
              {selectedView || "School" || "Select"}{" "}
            </Text>
            <IconByName
              name="TriangleDownIcon"
              color="primary.500"
              fontSize="10px"
            />
          </HStack>
        </HStack>
      )}
    </HStack>
  );
};
