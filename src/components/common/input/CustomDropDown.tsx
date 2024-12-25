import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  InputGroup,
  Input,
  InputRightElement,
  Image,
  List,
  ListItem,
  Flex,
  Text,
  InputLeftElement,
} from "@chakra-ui/react";
import close from "../../../assets/icons/close.svg";
import { useNavigate } from "react-router-dom";
import backIcon from "../../../assets/icons/arrow_back_ios.svg";
import { useTranslation } from "react-i18next";

interface CustomInputProps {
  placeholder?: string;
  suggestions?: string[];
  onInputChange?: (value: string) => void;
  onSuggestionClick?: (value: string) => void;
  icon?: string;
  showClearIcon?: boolean;
  value: string | undefined;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isBackButton: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInputWithDropdown: React.FC<CustomInputProps> = ({
  placeholder = "Search...",
  suggestions = [],
  onInputChange,
  onSuggestionClick,
  icon,
  showClearIcon = true,
  value,
  onKeyDown,
  isBackButton,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleSearchChange = (value: string) => {
    setSearch(value);
    onInputChange?.(value);
  };

  useEffect(() => {
    if (search) {
      const filtered = suggestions.filter((item: any) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
      setFilteredSuggestions([]);
    }
  }, [search, suggestions]);

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (item: any) => {
    onSuggestionClick?.(item || "");
    setShowDropdown(false); // Close the dropdown after selection
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearSearch = () => {
    setSearch("");
    setFilteredSuggestions([]);
    setShowDropdown(false);
    onInputChange?.("");
  };

  return (
    <Box position="relative" ref={inputRef}>
      <InputGroup>
        {isBackButton && (
          <InputLeftElement>
            <Image
              src={backIcon}
              alt="Back"
              cursor="pointer"
              width="8.71px"
              height="15.8px"
              onClick={() => navigate("/home")}
            />
          </InputLeftElement>
        )}
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleSearchChange(e.target.value)}
          borderWidth="2px"
          borderRadius="8px"
          height="46px"
          bg="white"
          onKeyDown={onKeyDown}
          pl={isBackButton ? "45px" : "16px"}
        />
        <InputRightElement>
          {search && showClearIcon ? (
            <Image
              src={close}
              alt="close"
              cursor="pointer"
              onClick={handleClearSearch}
            />
          ) : (
            <Image
              src={icon}
              alt="Search"
              style={{
                width: "20px",
                height: "20px",
                filter: `invert(27%) sepia(84%) saturate(2448%) hue-rotate(165deg) brightness(95%) contrast(92%)`,
              }}
            />
          )}
        </InputRightElement>
      </InputGroup>

      {showDropdown && (
        <Box
          bg="white"
          top="100%"
          mt="2"
          width="100%"
          boxShadow="lg"
          borderRadius="8px"
          zIndex="10"
        >
          <List spacing={1}>
            {filteredSuggestions.map((item: any, index) => (
              <ListItem
                key={index}
                px="4"
                py="3"
                borderBottom="1px solid"
                borderColor="borderGrey"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
                onClick={() => handleSuggestionClick(item?.name)}
              >
                <Flex alignItems="center" justifyContent="space-between">
                  <Text fontSize="14px" fontFamily="Inter">
                    {item?.name}
                  </Text>
                  <Image
                    src={icon}
                    alt="Search"
                    style={{
                      width: "20px",
                      height: "20px",
                      filter: `invert(27%) sepia(84%) saturate(2448%) hue-rotate(165deg) brightness(95%) contrast(92%)`,
                    }}
                  />
                </Flex>
              </ListItem>
            ))}
            <ListItem
              py="2"
              textAlign="center"
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onClick={(e) => handleSuggestionClick(value)}
            >
              <Text fontSize="14px" fontFamily="Inter" color="primary.500">
                {t("SEE_ALL_RESULTS")}
              </Text>
            </ListItem>
          </List>
        </Box>
      )}
    </Box>
  );
};

export default CustomInputWithDropdown;
