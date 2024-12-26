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
import { logout } from "../../../services/auth/auth";

interface Props {
  children: React.ReactNode;
  loading?: boolean;
  isFooterVisible?: boolean;
  isHeaderVisible?: boolean;
  _header?: {
    suggestions?: string[];
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    onSuggestionClick?: (suggestion: any) => void;
    onSubjectSelect?: (subject: string) => void;
    bottomComponent?: React.ReactNode;
  };
}

const Layout: React.FC<Props> = ({
  children,
  loading = false,
  isFooterVisible = true,
  isHeaderVisible = true,
  _header,
}) => {
  const { width, height } = useDeviceSize();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modalContent] = useState({
    title: `${t("POPUP_CONFIRM_LOGOUT")}`,
    message: `${t("POPUP_CONFIRM_MSG")}`,
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const menuList = [
    { route: "/home", icon: "HomeIcon", title: "Home" },
    { route: "/leaderboard", icon: "LeaderboardIcon", title: "Leaderboard" },
    { route: "/watch", icon: "WatchIcon", title: "Watch", isOutOFBox: true },
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
          overflowY="auto"
        >
          {isHeaderVisible && <Header {..._header} />}

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
