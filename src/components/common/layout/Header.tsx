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
import { debounce } from "lodash";

interface HeaderProps {
  children?: React.ReactNode;
  suggestions: string[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

const Header: React.FC<HeaderProps> = ({suggestions, searchTerm, onSearchChange, onSuggestionClick }: HeaderProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { isOpen, onToggle } = useDisclosure();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isWatchPage = location.pathname === "/watch";

  useEffect(() => {
    setSearch(searchTerm);
  }, [searchTerm]);

  const debouncedSearch = debounce((value: string) => {
    onSearchChange(value);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;  // Type assertion here
    if (e.key === "Enter" && value.trim()) {
      navigate(`/watch?search=${encodeURIComponent(value.trim())}`);
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
      <VStack align={"stretch"} spacing={3}>
        {!isWatchPage && (
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
          in={isOpen || isWatchPage}
          transition={{ enter: { duration: 0.2 }, exit: { duration: 0.2 } }}
        >
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
        </Collapse>
      </VStack>
    </Box>
  );
};

export default Header;
