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
    onSearchChange?: (value: any) => void;
    onSuggestionClick?: (suggestion: any) => void;
    onSubjectSelect?: (subject: string) => void;
    bottomComponent?: React.ReactNode;
    progress?: string;
    onFilterClick?: (filter: string) => void;
    selectedView?: any;
    points?: number;
    recentSearch?: string[];
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
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const cancel = () => {
    onClose();
    setSelectedIndex(0);
  };
  const menuList = [
    { route: "/home", icon: "HomeIcon", title: "Home" },
    { route: "/leaderboard", icon: "LeaderboardIcon", title: "Leaderboard" },
    { route: "/watch", icon: "WatchIcon", title: "Watch", isOutOFBox: true },
    { route: "/guide", icon: "QuestionIcon", title: "Guide" },
    { icon: "LogoutIcon", title: "Logout", onClick: onOpen },
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
          id="bodyBox"
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
              <Footer
                menues={menuList}
                selectedIndex={selectedIndex}
                onSelect={(index: number) => setSelectedIndex(index)}
              />
            </>
          )}
        </Box>
      )}
      <PopupModal
        isOpen={isOpen}
        onClose={cancel}
        title={modalContent.title}
        showIcon={true}
        maxWidth="380px"
        height="182px"
        footerContent={
          <PrimaryButton
            onClick={() => {
              cancel();
              handleLogout();
            }}
            width="100%"
            color="white"
            bg="primary.500"
            fontFamily="Inter"
            fontWeight="700"
            fontSize="16px"
            lineHeight="24px"
          >
            {t("POPUP_LOGOUT")}
          </PrimaryButton>
        }
      >
        <CustomHeading
          fontSize="14px"
          fontWeight="400"
          title={modalContent.message}
          color="textSecondary"
        />
      </PopupModal>
    </Center>
  );
};

export default Layout;
