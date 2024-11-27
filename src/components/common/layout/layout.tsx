import React, { useState } from "react";
import { Box, Center, useDisclosure } from "@chakra-ui/react";
import Loading from "../Loading";
import useDeviceSize from "./useDeviceSize";
import Footer from "./Footer";
import Header from "./Header";
import PopupModal from "../PopupModal";
import PrimaryButton from "../button/PrimaryButton";
import { useTranslation } from "react-i18next";
import CustomHeading from "../typography/Heading";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  loading?: boolean;
  isFooterVisible?: boolean;
  isHeaderVisible?: boolean;
}
const Layout: React.FC<Props> = ({
  children,
  loading = false,
  isFooterVisible = true,
  isHeaderVisible = true,
}) => {
  const { width, height } = useDeviceSize();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modalContent] = useState({
    title: `${t("POPUP_CONFIRM_LOGOUT")}`,
    message: `${t("POPUP_CONFIRM_MSG")}`,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    navigate(0);
  };

  const menuList = [
    { route: "/home", icon: "HomeIcon", title: "Home" },
    { route: "/leaderboard", icon: "LeaderboardIcon", title: "Leaderboard" },
    { route: "/videos", icon: "WatchIcon", title: "Watch", isOutOFBox: true },
    { route: "/guide", icon: "QuestionIcon", title: "Guide" },
    { icon: "LogoutIcon", title: "Logout", onClick: onOpen }, // Opens the modal on Logout click
  ];

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
      <PopupModal
        isOpen={isOpen}
        onClose={onClose}
        title={modalContent.title}
        showIcon={true}
        footerContent={
          <PrimaryButton
            onClick={() => {
              onClose();
              handleLogout();
            }}
            width="100%"
            color="white"
            bg="primary.500"
          >
            {t("POPUP_LOGOUT")}
          </PrimaryButton>
        }
      >
        <CustomHeading
          variant="p"
          fontSize="14px"
          title={modalContent.message}
          color="textSecondary"
        />
      </PopupModal>
    </Center>
  );
};

export default Layout;
