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
  getInputRef?: (ref: HTMLInputElement | null) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionClick?: (value: string) => void;
  icon?: string;
  showClearIcon?: boolean;
  value?: string | undefined;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isBackButton: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInputWithDropdown: React.FC<CustomInputProps> = ({
  placeholder = "Search...",
  suggestions = [],
  onSuggestionClick,
  icon,
  showClearIcon = true,
  value,
  onKeyDown,
  isBackButton,
  onChange,
  getInputRef,
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setShowDropdown(suggestions.length > 0);
    setFilteredSuggestions(suggestions);
  }, [value, suggestions]);

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };
  useEffect(() => {
    if (inputRef.current) {
      getInputRef?.(inputRef.current.querySelector("input"));
    }
  }, [inputRef.current]);

  const handleSuggestionClick = (item: any) => {
    onSuggestionClick?.(item || "");
    setShowDropdown(false); // Close the dropdown after selection
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    setInputValue("");
    onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    setFilteredSuggestions([]);
    setShowDropdown(false);
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
          onChange={handleInputChange}
          borderWidth="2px"
          borderRadius="8px"
          height="46px"
          bg="white"
          onKeyDown={onKeyDown}
          pl={isBackButton ? "45px" : "16px"}
        />
        <InputRightElement>
          {inputValue && showClearIcon ? (
            <Image
              src={close}
              alt="close"
              cursor="pointer"
              onClick={handleClear}
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
                onClick={() => {
                  const newValue = {
                    search:
                      value || inputRef?.current?.querySelector("input")?.value,
                    index,
                  };
                  handleSuggestionClick(newValue);
                }}
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
              onClick={() => {
                const newValue = {
                  search:
                    value || inputRef?.current?.querySelector("input")?.value,
                };
                handleSuggestionClick(newValue);
              }}
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
