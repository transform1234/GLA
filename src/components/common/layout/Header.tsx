import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Collapse,
  Flex,
  HStack,
  Image,
  Progress,
  Spacer,
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
import CoinPopover from "../cards/CoinPopover";

interface HeaderProps {
  children?: React.ReactNode;
  suggestions?: string[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
  bottomComponent?: React.ReactNode;
  progress?: string;
  onFilterClick?: (filter: string) => void;
  selectedView?: any;
  points?: number;
  recentSearch?: string[];
  width?: number;
  keyDownSearchFilter?: {
    from: string;
    subject: string;
  };
}

const Header: React.FC<HeaderProps> = ({
  suggestions,
  searchTerm,
  onSearchChange,
  onSuggestionClick,
  bottomComponent,
  progress,
  onFilterClick,
  selectedView,
  points,
  recentSearch = [],
  width,
  keyDownSearchFilter,
}: HeaderProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isWatchPage = location.pathname === "/watch";
  const isSearchPage = location.pathname === "/search";
  const isLeaderboardPage = location.pathname === "/leaderboard";
  const [value, setSelectedView] = useState("School");
  const [ref, setRef] = useState<HTMLInputElement | null>(null);
  const RECENT_SEARCH_KEY = "recentSearches";
  const [isInputFocused, setIsInputFocused] = useState<string[]>([]);

  useEffect(() => {
    if (ref) {
      ref.value = searchTerm || "";
    }
  }, [ref, searchTerm]);

  const debouncedSearch = debounce((value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    onSearchChange?.(trimmedValue);
  }, 1000);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value; // Type assertion here
    if (e.key === "Enter" && value.trim()) {
      const queryParams = new URLSearchParams({
        search: value.trim(),
        ...keyDownSearchFilter,
      });
      navigate(`/search?${queryParams.toString()}`);
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

  const handleInputFocus = (item: string) => {
    if (item) {
      const result = isInputFocused.filter((e) => {
        e != item;
      });
      setIsInputFocused([...isInputFocused, item]);
    }
  };

  const handleInputBlur = (item: string) => {
    if (item) {
      const result = isInputFocused.filter((e) => e !== item);
      setIsInputFocused(result);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    console.log("Navigating to search with:", search);
    navigate(`/search?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <VStack
      backgroundImage={`url(${background})`}
      p="4"
      roundedBottom={"16px"}
      position={isScrolled ? "fixed" : "sticky"}
      top="0"
      zIndex={10}
      transition="all 0.3s"
      align={"stretch"}
      width={width}
    >
      {isLeaderboardPage && (
        <HStack alignItems="center" justifyContent={"space-between"} mb={4}>
          {/* Back Icon */}
          <HStack spacing={2}>
            <IconByName
              name={"BackIcon"}
              color="white"
              alt="Back"
              cursor="pointer"
              onClick={() => navigate("/home")}
            />

            <Text
              lineHeight="16px"
              fontWeight="400"
              fontSize="20px"
              color="white"
              fontFamily="Bebas Neue"
            >
              {t("LEADERBOARD")}
            </Text>
          </HStack>
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
                {selectedView || value || "Select"}{" "}
              </Text>
              <IconByName
                name="TriangleDownIcon"
                color="primary.500"
                fontSize="10px"
              />
            </HStack>
          </HStack>
        </HStack>
      )}

      {isWatchPage && (
        <HStack justifyContent={"space-between"}>
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
            <Text fontSize="20px" color="white" fontFamily="Bebas Neue">
              {t("HOME_WATCH")}
            </Text>
          </HStack>
          {points && <CoinPopover points={points} />}
        </HStack>
      )}
      {!isWatchPage && !isSearchPage && !isLeaderboardPage && (
        <VStack align={"stretch"} spacing={3}>
          <HStack justifyContent="space-between" alignItems="center" w="100%">
            {/* Left-hand side: Palooza logo */}
            {!isOpen && <Image src={`${palooza_logo}`} height="25px" />}

            {/* Right-hand side: SearchIcon and NotificationIcon */}
            <HStack spacing={4}>
              {points && <CoinPopover points={points} />}
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
                <Box w={"100%"} flex={15} rounded={"8"} p="2.5" bg={"#355F6A"}>
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
        </VStack>
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
          isBackButton={true}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          suggestions={suggestions || []}
          onSuggestionClick={onSuggestionClick}
          onFocus={(e) => handleInputFocus("input")}
          onBlur={(e) => handleInputBlur("input")}
        />
      </Collapse>

      {!isOpen &&
        !isScrolled &&
        !isWatchPage &&
        !isSearchPage &&
        !isLeaderboardPage && (
          <CustomInputWithDropdown
            getInputRef={(e) => setRef(e)}
            placeholder={t("HOME_SEARCH")}
            icon={searchIcon}
            showClearIcon={true}
            isBackButton={true}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            suggestions={suggestions}
            onSuggestionClick={onSuggestionClick}
            onFocus={(e) => handleInputFocus("input")}
            onBlur={(e) => handleInputBlur("input")}
          />
        )}
      {isInputFocused.length > 0 &&
        suggestions?.length === 0 &&
        !isScrolled && (
          <Box
            p="4"
            bg="white"
            borderBottomLeftRadius="8px"
            borderBottomRightRadius="8px"
            border="2px solid #C5C5C5"
            onMouseEnter={(e) => handleInputFocus("focus")}
            onMouseLeave={(e) => handleInputBlur("focus")}
          >
            <Text
              marginBottom="10px"
              textAlign="left"
              fontSize="12px"
              fontWeight="600"
              lineHeight="16px"
              color="primary.500"
            >
              {t("HOME_RECENTLY_SEARCHED")}
            </Text>
            <Flex wrap="wrap" gap="4">
              {recentSearch?.map((search, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  cursor="pointer"
                  border="1px solid #C5C5C5"
                  borderRadius="90px"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleRecentSearchClick(search)}
                >
                  <IconByName
                    name={"RepeatClockIcon"}
                    color="textprimary"
                    alt="history"
                    cursor="pointer"
                    width="16px"
                    height="16px"
                    marginLeft="8px"
                    marginRight="8px"
                  />
                  <Text
                    pb="8px"
                    pt="8px"
                    pr="10px"
                    fontSize="14px"
                    fontWeight="400"
                  >
                    {search}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>
        )}
      {bottomComponent && bottomComponent}
    </VStack>
  );
};

export default Header;
