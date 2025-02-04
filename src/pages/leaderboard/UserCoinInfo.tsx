import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ActionSheet from "../../components/common/ActionSheet";
import { getCurrentUserdetail } from "../../services/home";

const IdentifiersList = {
  subject_completion: {
    label: "Subject Completion",
  },
  assesment_completion: {
    label: "Quiz Completion",
  },
  content: {
    label: "Content Completion",
  },
  lesson_completion: {
    label: "Content Completion",
  },
};

interface CoinInfoProps {
  activeCollapse: string | undefined;
  width: string;
  handleCollapseToggle: (content: string) => void;
  handleViewChange: (radioSelection: string) => void;
  myData: any;
}

const UserCoinInfo: React.FC<CoinInfoProps> = ({
  activeCollapse,
  width,
  handleCollapseToggle,
  handleViewChange,
  myData,
}) => {
  const { t } = useTranslation();
  return (
    <Box
      position="fixed"
      bottom="0"
      zIndex="10"
      roundedTop="4"
      width={width}
      bg={activeCollapse === "history" ? "yellow.500" : "white"}
    >
      <PopupCustom
        {...{
          activeCollapse,
          width,
          handleCollapseToggle,
          handleViewChange,
          myData,
        }}
      />
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
        <HStack
          justifyContent="space-between"
          alignItems="center"
          divider={
            <Box
              height="24px"
              width="2px"
              bg="yellow.900"
              mx="3"
              opacity="40%"
            />
          }
        >
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
          <VStack spacing={0}>
            <HStack>
              <Text
                fontWeight="900"
                fontSize="12px"
                lineHeight="16px"
                color="yellow.900"
                whiteSpace="nowrap"
              >
                +{myData?.lastEarnedPoints?.[0]?.points}
              </Text>
              <Text
                fontWeight="900"
                fontSize="12px"
                lineHeight="16px"
                color="yellow.900"
                whiteSpace="nowrap"
              >
                {t("LEADERBOARD_CONIS")}
              </Text>
            </HStack>
            <Text
              fontWeight="900"
              fontSize="12px"
              lineHeight="16px"
              color="yellow.900"
              whiteSpace="nowrap"
            >
              {t(
                myData?.lastEarnedPoints?.[0]?.identifier ===
                  "subject_completion"
                  ? "LEADERBOARD_SUBJECT"
                  : myData?.lastEarnedPoints?.[0]?.identifier ===
                    "assesment_completion"
                  ? "LEADERBOARD_QUIZ"
                  : "LEADERBOARD_CONTENT"
              )}
            </Text>
            <Text
              fontWeight="400"
              fontSize="8px"
              color="yellow.900"
              textAlign="start"
              lineHeight="16px"
            >
              {myData?.lastEarnedPoints?.[0]?.created_at &&
                moment(myData?.lastEarnedPoints?.[0]?.created_at).fromNow()}
            </Text>
          </VStack>
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
      </Box>
    </Box>
  );
};

export default React.memo(UserCoinInfo);

interface PopupProps {
  activeCollapse: string | undefined;
  width: string | number;
  handleCollapseToggle: (content: string) => void;
  myData: any;
}

const PopupCustom: React.FC<PopupProps> = ({
  activeCollapse,
  handleCollapseToggle,
  myData,
}) => {
  const [coninsData, setCoinsData] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const { t } = useTranslation();
  const handleClose = () => {
    handleCollapseToggle("");
    setPage(1);
    setCoinsData([]);
    setHasMoreData(true);
    setLoadingMore(false);
  };

  const fetchUserData = async (currentPage: number) => {
    try {
      if (loadingMore) return;
      setLoadingMore(true);
      const data: any = await getCurrentUserdetail(currentPage);

      if (!data || (data.totalPages === page && data.totalPages !== 1)) {
        setHasMoreData(false);
        setLoadingMore(false);
        return;
      }
      setCoinsData((prevData: any) => [...(prevData || []), ...data?.points]);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setLoadingMore(false);
    } finally {
    }
  };
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  React.useEffect(() => {
    if (!page || !hasMoreData || !activeCollapse) return;
    fetchUserData(page);
  }, [page, activeCollapse]);
  return (
    <ActionSheet
      isOpen={Boolean(activeCollapse == "history")}
      onClose={handleClose}
      _props={{ bg: "yellow.500" }}
      _header={{ pt: 3 }}
      headerComponent={
        <HStack alignItems="center" borderBottom="1px solid #10162E" pb="15px">
          {/* Title: Coins History */}
          <Text
            flex={1}
            fontSize="24px"
            fontFamily="Bebas Neue"
            fontWeight="700"
            whiteSpace="nowrap"
          >
            {t("LEADERBOARD_COINS_HISTORY")}
          </Text>
          {/* Right Section: Rank, Coins, and Close Button */}
          {/* Your Rank */}

          <HStack
            flex={1}
            divider={
              <Box
                height="24px"
                width="2px"
                bg="yellow.900"
                opacity="40%"
                style={{ margin: "0 16px" }}
              />
            }
          >
            <VStack alignItems={"center"} spacing={1}>
              <Text
                fontFamily="Bebas Neue"
                fontWeight="400"
                fontSize="12px"
                whiteSpace="nowrap"
                lineHeight={"16px"}
              >
                {t("LEADERBOARD_YOUR_RANK")}
              </Text>
              <Text
                fontSize="20px"
                fontWeight="700"
                textAlign="left"
                lineHeight={"16px"}
              >
                {myData?.rank}
              </Text>
            </VStack>
            {/* Your Coins */}
            <VStack alignItems={"center"} spacing={1}>
              <Text
                fontFamily="Bebas Neue"
                fontWeight="400"
                fontSize="12px"
                whiteSpace="nowrap"
                lineHeight={"16px"}
              >
                {t("LEADERBOARD_YOUR_COINS")}
              </Text>
              <Text
                textAlign="left"
                fontSize="20px"
                fontWeight="700"
                lineHeight={"16px"}
              >
                {myData?.points}
              </Text>
            </VStack>
          </HStack>
        </HStack>
      }
    >
      <Box px="4" pb="4">
        <Box
          onScroll={handleScroll}
          height="calc(100vh - 300px)"
          overflowY="auto"
          bg="yellow.300"
          p="10px"
          rounded={"16px"}
        >
          {coninsData?.map((item: any, index: number) => (
            <Box
              key={index}
              p="5px"
              borderBottom="1px solid"
              borderColor="lightGrey"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              title={item?.id}
            >
              <VStack>
                <Text lineHeight="19.36px" fontSize="16px" fontWeight="700">
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
              </VStack>
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
          ))}
          {loadingMore ? (
            <Flex justifyContent="center" alignItems="center" height="50px">
              <Spinner color="yellow.900" />
            </Flex>
          ) : (
            <Flex
              justifyContent="center"
              alignItems="center"
              height="50px"
              color="lightGrey"
            >
              {t("LEADERBOARD_NO_DATA")}
            </Flex>
          )}
        </Box>
      </Box>
    </ActionSheet>
  );
};
