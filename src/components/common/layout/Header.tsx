import {
  Box,
  Collapse,
  HStack,
  Image,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import background from "../../../assets/images/home-bg.png";
import palooza_logo from "../../../assets/logo/Logo-Large.png";
import CustomHeading from "../typography/Heading";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import IconByName from "../icons/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import CustomInputWithDropdown from "../input/CustomDropDown";
import searchIcon from "../../../assets/icons/search.svg";
import notificationIcon from "../../../assets/icons/icn-notification.svg";
import { debounce } from "lodash";

interface HeaderProps {
  children?: React.ReactNode;
  suggestions?: string[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void | undefined;
  onSuggestionClick?: (suggestion: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  suggestions,
  searchTerm,
  onSearchChange,
  onSuggestionClick,
}: HeaderProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string | undefined>("");
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchPage = location.pathname === "/search";

  useEffect(() => {
    setSearch(searchTerm);
  }, [searchTerm]);

  const handleSearchIconClick = () => {
    if (isOpen) {
      onClose(); // Close the search field if it's already open
    } else {
      onToggle(); // Open the search field
    }
  };

  const debouncedSearch = debounce((value: string) => {
    onSearchChange?.(value);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
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
      // if (window.scrollY > 0 && isOpen) {
      //   onClose(); // Hide the search field when scrolling
      // }
      setIsScrolled(window.scrollY > 0); // Update the scroll state
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, onClose]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     // Update isScrolled only when search bar is not open
  //     if (!isOpen) {
  //       setIsScrolled(window.scrollY > 0);
  //     }
  //   };
  
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [isOpen]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 0);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

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
      <VStack align={"stretch"} spacing={3}>
        {!isSearchPage && (
          <>
             <HStack height="52px"> </HStack>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              w="100%"
            >
              {/* Left-hand side: Palooza logo */}
              <Image src={`${palooza_logo}`} height="25px" />

              {/* Right-hand side: SearchIcon and NotificationIcon */}
              <HStack spacing={4}>
                <Image
                  src={notificationIcon}
                  alt="Notification"
                  cursor="pointer"
                  boxSize="1.5rem"
                  onClick={() => navigate("/home")}
                />
                {
                  isScrolled &&
                  <IconByName
                  name={"SearchIcon"}
                  width="24px"
                  height="24px"
                  cursor="pointer"
                  color="white"
                  onClick={onToggle}
                  />
                }
              </HStack>
            </HStack>

              <Collapse
              in={!isScrolled && !isOpen}
              transition={{ enter: { duration: 0.2 }, exit: { duration: 0.2 } }}
            >
              <VStack align="flex-start" spacing={1}>
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
                />
              </VStack>
            </Collapse>
          </>
        )}

        <Collapse
          in={isOpen || isSearchPage}
          transition={{ enter: { duration: 0.2 }, exit: { duration: 0.2 } }}
        >
          <CustomInputWithDropdown
            placeholder={t("HOME_SEARCH")}
            onInputChange={onSearchChange}
            icon={searchIcon}
            showClearIcon={true}
            isBackButton={isSearchPage}
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            suggestions={suggestions || []}
            onSuggestionClick={onSuggestionClick}
          />
        </Collapse>

        {
         !isOpen && !isScrolled && !isWatchPage &&
          <CustomInputWithDropdown
          placeholder={t("HOME_SEARCH")}
          onInputChange={onSearchChange}
          icon={searchIcon}
          showClearIcon={true}
          isBackButton={isWatchPage}
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          suggestions={suggestions}
          onSuggestionClick={onSuggestionClick}
        />
        }
       
      </VStack>
    </Box>
  );
};

export default Header;
