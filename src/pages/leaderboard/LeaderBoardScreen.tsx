import { HStack, Text } from "@chakra-ui/react";
import React, { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import IconByName from "../../components/common/icons/Icon";
import BottomComponent from "../../components/common/layout/BottomComponent";
import Layout from "../../components/common/layout/layout";
import useDeviceSize from "../../components/common/layout/useDeviceSize";
import Loading from "../../components/common/Loading";
import {
  getCurrentUserdetail,
  getLeaderboardFilter,
} from "../../services/home";
import { impression } from "../../services/telemetry";
import Students from "./Students";
import UserCoinInfo from "./UserCoinInfo";
interface UserData {
  rank: number;
  points: number;
  lastEarnedPoints: any[];
}

const LeaderboardScreen: React.FC = (props: any) => {
  const { width } = useDeviceSize();
  const [data, setData] = useState([]);
  const [myData, setMyData] = useState<UserData>();
  const { t } = useTranslation();
  const [activeCollapse, setActiveCollapse] = useState<string | undefined>();
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
  const [loading, setLoading] = useState(false);
  const isLeaderBoardPoints = useRef(false);
  const [bodyHeight, setBodyHeight] = useState<number>(0);
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

  const handleCollapseToggle = (collapse: any) => {
    setActiveCollapse((prevState) =>
      prevState === collapse ? undefined : collapse
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

  const handleViewChange = (radioSelection: string) => {
    setActiveCollapse("");
    setFilter((prev: any) => ({ ...prev, type: radioSelection }));
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
            selectedView={filter?.type}
          />
        ),
        // isLeaderBoardFilters: {
        //   icon: true,
        //   heading: t("LEADERBOARD"),
        //   backTo: "home",
        // },
      }}
    >
      {/* list of students */}
      {loading ? (
        <Loading width="100%" height={bodyHeight} />
      ) : (
        <Students
          radioValue={filter?.type}
          handleViewChange={handleViewChange}
          data={data}
          bodyHeight={`${bodyHeight}px`}
          activeCollapse={activeCollapse}
        />
      )}

      {/* Sticky Footer */}
      <UserCoinInfo
        activeCollapse={activeCollapse}
        myData={myData}
        width={`${width}px`}
        handleCollapseToggle={handleCollapseToggle}
        handleViewChange={handleViewChange}
      />
    </Layout>
  );
};

export default LeaderboardScreen;

interface HeaderWithFiltersProps {
  heading: string;
  onBack?: () => void;
  onFilterClick?: (type: string) => void;
  selectedView?: string;
  rightComponent?: React.ReactNode;
}

const HeaderWithFilters: React.FC<HeaderWithFiltersProps> = memo(
  ({ heading, onBack, onFilterClick, selectedView, rightComponent }) => {
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
                {selectedView || "School" || "Select"}
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
  }
);
