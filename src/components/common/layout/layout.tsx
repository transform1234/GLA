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
    isOutOFBox: true,
  },
  {
    route: "/guide",
    icon: "QuestionIcon",
    title: "Guide",
  },
  {
    icon: "LogoutIcon",
    title: "Logout",
    onClick: () => {
      localStorage.removeItem("token");
      window.location.href = "/";
    },
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
      bg="transparent"
    >
      {loading || width === 0 ? (
        <Loading message="Loading..." />
      ) : (
        <Box
          height={height}
          width={width}
          bg="white"
          boxShadow="0px 0px 15px 0px #e1e1e1"
        >
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
