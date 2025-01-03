import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Collapse,
  HStack,
  Image,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import searchIcon from "../../../assets/icons/search.svg";
import background from "../../../assets/images/home-bg.png";
import palooza_logo from "../../../assets/logo/Logo-Large.png";
import IconByName from "../icons/Icon";
import CustomInputWithDropdown from "../input/CustomDropDown";
import CustomHeading from "../typography/Heading";
// import notificationIcon from "../../../assets/icons/icn-notification.svg";
import { debounce } from "lodash";

interface HeaderProps {
  children?: React.ReactNode;
  suggestions?: string[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void | undefined;
  onSuggestionClick?: (suggestion: string) => void;
  bottomComponent?: React.ReactNode;
  progress?: string | undefined;
}

const Header: React.FC<HeaderProps> = ({
  suggestions,
  searchTerm,
  onSearchChange,
  onSuggestionClick,
  bottomComponent,
  progress,
}: HeaderProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isWatchPage = location.pathname === "/watch";
  const isSearchPage = location.pathname === "/search";
  const [ref, setRef] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (ref) {
      ref.value = searchTerm || "";
    }
  }, [ref, searchTerm]);

  const debouncedSearch = debounce((value: string) => {
    onSearchChange?.(value);
  }, 1000);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value; // Type assertion here
    if (e.key === "Enter" && value.trim()) {
      navigate(`/search?search=${encodeURIComponent(value.trim())}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollValues = document.getElementById("bodyBox")?.scrollTop ?? 0;
      setIsScrolled(scrollValues > 0);
      if (scrollValues === 0) {
        setIsOpen(false);
        setIsScrolled(false);
      }
    };
    document
      .getElementById("bodyBox")
      ?.addEventListener("scroll", handleScroll);
    return () => {
      document
        .getElementById("bodyBox")
        ?.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <Box
      backgroundImage={`url(${background})`}
      p="4"
      roundedBottom={"16px"}
      position="sticky"
      top="0"
      zIndex={10}
      transition="all 0.3s"
    >
      {isWatchPage && (
        <HStack>
          <IconByName
            name={"BackIcon"}
            color="white"
            alt="Back"
            cursor="pointer"
            width="2em"
            height="2em"
            onClick={() => navigate("/home")}
          />
          <Text fontSize="20px" color="white">
            {t("HOME_WATCH")}
          </Text>
        </HStack>
      )}
      <VStack align={"stretch"} spacing={3} marginTop="20px">
        {!isWatchPage && !isSearchPage && (
          <>
            <HStack> </HStack>
            <HStack justifyContent="space-between" alignItems="center" w="100%">
              {/* Left-hand side: Palooza logo */}
              {!isOpen && <Image src={`${palooza_logo}`} height="25px" />}

              {/* Right-hand side: SearchIcon and NotificationIcon */}
              <HStack spacing={4}>
                {isScrolled && progress !== "" && (
                  <CircularProgress
                    value={Math.round(Number(progress) || 0)}
                    color="progressBarGreen.500"
                    size="26px"
                    thickness="5px"
                    trackColor={"progressCircaleDarkBG"}
                  >
                    <CircularProgressLabel
                      color="white"
                      fontSize={"8px"}
                    >{`${Math.round(
                      Number(progress) || 0
                    )}%`}</CircularProgressLabel>
                  </CircularProgress>
                )}
                {/* <Image
                  src={notificationIcon}
                  alt="Notification"
                  cursor="pointer"
                  boxSize="1.5rem"
                  onClick={() => navigate("/home")}
                /> */}
                {isScrolled && !isOpen && (
                  <IconByName
                    name={"SearchIcon"}
                    minW="24px"
                    height="24px"
                    cursor="pointer"
                    color="white"
                    onClick={(e: any) => setIsOpen(true)}
                  />
                )}
              </HStack>
            </HStack>

            <Collapse
              in={!isScrolled && !isOpen}
              transition={{ enter: { duration: 0.2 }, exit: { duration: 0.2 } }}
            >
              <HStack align={"stretch"}>
                <VStack align="flex-start" spacing={1} flex={10}>
                  <CustomHeading
                    lineHeight="21px"
                    fontFamily="Inter"
                    variant="h2"
                    fontSize="12px"
                    fontWeight="400"
                    title={t("HOME_HELLO")}
                    color="white"
                  />
                  <CustomHeading
                    lineHeight="21px"
                    fontFamily="Inter"
                    variant="h2"
                    fontSize="20px"
                    fontWeight="600"
                    title={localStorage.getItem("name")}
                    color="white"
                    textTransform="capitalize"
                  />
                </VStack>
                {progress !== "" && (
                  <Box
                    w={"100%"}
                    flex={15}
                    rounded={"8"}
                    p="2.5"
                    bg={"#355F6A"}
                  >
                    <HStack align={"center"}>
                      <VStack align={"stretch"} w={"100%"}>
                        <CustomHeading
                          lineHeight="12px"
                          fontFamily="Inter"
                          variant="h2"
                          fontSize="12px"
                          fontWeight="600"
                          title={"Your Progress"}
                          color="white"
                          textTransform="uppercase"
                        />
                        <Progress
                          colorScheme="progressBarGreen"
                          size="sm"
                          value={Math.round(Number(progress) || 0)}
                          rounded={"full"}
                          bg="progressDarkBG"
                        />
                      </VStack>
                      <CustomHeading
                        fontFamily="Inter"
                        variant="h2"
                        fontSize="20px"
                        lineHeight="20px"
                        textAlign={"center"}
                        fontWeight="500"
                        title={`${Math.round(Number(progress) || 0)}%`}
                        color="white"
                      />
                    </HStack>
                  </Box>
                )}
              </HStack>
            </Collapse>
          </>
        )}

        <Collapse
          in={isOpen || isWatchPage || isSearchPage}
          transition={{ enter: { duration: 0.2 }, exit: { duration: 0.2 } }}
        >
          <CustomInputWithDropdown
            getInputRef={(e) => setRef(e)}
            placeholder={t("HOME_SEARCH")}
            icon={searchIcon}
            showClearIcon={true}
            isBackButton={isSearchPage || isWatchPage}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            suggestions={suggestions || []}
            onSuggestionClick={onSuggestionClick}
          />
        </Collapse>

        {!isOpen && !isScrolled && !isWatchPage && !isSearchPage && (
          <CustomInputWithDropdown
            getInputRef={(e) => setRef(e)}
            placeholder={t("HOME_SEARCH")}
            icon={searchIcon}
            showClearIcon={true}
            isBackButton={isWatchPage || isSearchPage}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            suggestions={suggestions}
            onSuggestionClick={onSuggestionClick}
          />
        )}
      </VStack>
      {bottomComponent && bottomComponent}
    </Box>
  );
};

export default Header;
