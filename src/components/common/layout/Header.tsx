import {
  Box,
  Collapse,
  HStack,
  Image,
  useDisclosure,
  VStack,
  Text,
} from "@chakra-ui/react";
import background from "../../../assets/images/home-bg.png";
import palooza_logo from "../../../assets/logo/Logo-Large.png";
import CustomHeading from "../typography/Heading";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import IconByName from "../icons/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import CustomInputWithDropdown from "../input/CustomDropDown";
import searchIcon from "../../../assets/icons/search.svg";
import { debounce } from "lodash";

interface HeaderProps {
  children?: React.ReactNode;
  suggestions?: string[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void | undefined;
  onSuggestionClick?: (suggestion: string) => void;
  bottomComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  suggestions,
  searchTerm,
  onSearchChange,
  onSuggestionClick,
  bottomComponent,
}: HeaderProps) => {
  const { t } = useTranslation();
  const { isOpen, onToggle } = useDisclosure();
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
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        <>
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
        </>
      )}
      <VStack align={"stretch"} spacing={3} marginTop="20px">
        {!isWatchPage && !isSearchPage && (
          <>
            <HStack justifyContent="space-between" align={"stretch"}>
              <Image src={`${palooza_logo}`} height="25px" />
              <IconByName
                name={"SearchIcon"}
                boxSize="1.5rem"
                color="white"
                onClick={onToggle}
              />
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
          in={isOpen || isWatchPage || isSearchPage}
          transition={{ enter: { duration: 0.2 }, exit: { duration: 0.2 } }}
        >
          <CustomInputWithDropdown
            getInputRef={(e) => setRef(e)}
            placeholder={t("HOME_SEARCH")}
            icon={searchIcon}
            showClearIcon={true}
            isBackButton={isSearchPage}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            suggestions={suggestions || []}
            onSuggestionClick={onSuggestionClick}
          />
        </Collapse>
      </VStack>
      {bottomComponent && bottomComponent}
    </Box>
  );
};

export default Header;
