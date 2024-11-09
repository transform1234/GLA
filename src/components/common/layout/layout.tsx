import React from "react";
import { Box, Center } from "@chakra-ui/react";
import Loading from "../Loading";
import useDeviceSize from "./useDeviceSize";
import Footer from "./Footer";
import { useTranslation } from "react-i18next";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
  loading?: boolean;
  isFooterVisible?: boolean;
  isHeaderVisible?: boolean;
}
const menuList = [
  {
    route: "/home",
    icon: "HomeIcon",
    title: "Home",
  },
  {
    route: "/leaderboard",
    icon: "LeaderboardIcon",
    title: "Leaderboard",
  },
  {
    route: "/videos",
    icon: "WatchIcon",
    title: "Watch",
  },
  {
    route: "/guide",
    icon: "QuestionIcon",
    title: "Guide",
  },
  {
    route: "/profile",
    icon: "ProfileIcon",
    title: "Profile",
  },
];
const Layout: React.FC<Props> = ({
  children,
  loading = false,
  isFooterVisible = true,
  isHeaderVisible = true,
}) => {
  const { width, height } = useDeviceSize();
  return (
    <Center
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg="white"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
    >
      {loading || width === 0 ? (
        <Loading message="Loading..." />
      ) : (
        <Box height={height} width={width} bg="white" margin="0 auto">
          {isHeaderVisible && <Header />}
          {children}

          {isFooterVisible && (
            <>
              <Box minH={"96px"} />
              <Footer menues={menuList} />
            </>
          )}
        </Box>
      )}
    </Center>
  );
};

export default Layout;
