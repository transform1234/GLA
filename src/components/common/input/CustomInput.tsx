import {
  Box,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import searchIcon from "../../../assets/icons/search.svg";
import visibility from "../../../assets/icons/visibility.svg";
import visibilityOff from "../../../assets/icons/visibility_off.svg";
import warning from "../../../assets/icons/warning.svg";

interface CustomInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  showClearIcon?: boolean;
  iconType?: string;
  isPassword?: boolean;
  disabled?: boolean;
  transition?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  value,
  onChange,
  error,
  errorMessage,
  iconType,
  isPassword,
  disabled,
  ...prop
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getBorderColor = () => {
    if (error && value) {
      return {
        borderColor: "red.500",
        bg: "red.50",
        color: "red.500",
      };
    }
    if (error && !value) {
      return {
        borderColor: "backgroundGrey",
        bg: "white",
        color: "textPrimary",
      };
    }
    if (disabled) {
      return {
        borderColor: "backgroundGrey",
        bg: "white",
        color: "textPrimary",
      };
    }
    if (value) {
      return {
        borderColor: "primary.500",
        bg: "white",
        color: "textPrimary",
      };
    }
    return {
      borderColor: "backgroundGrey",
      bg: "white",
      color: "textPrimary",
    };
  };

  const getHoverAndFocusColor = () => {
    if (error && value) return "red.500";
    if (disabled) return "gray.300";
    if (value) return "primary.500";
    return "primaryLight";
  };

  return (
    <Box {...prop}>
      <InputGroup>
        <Input
          type={
            showPassword && isPassword
              ? "text"
              : isPassword
              ? "password"
              : "text"
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          borderWidth="2px"
          borderStyle="solid"
          borderColor={getBorderColor().borderColor}
          _focus={{ borderColor: getHoverAndFocusColor() }}
          _focusVisible={{ borderColor: getHoverAndFocusColor() }}
          _hover={{ borderColor: getHoverAndFocusColor() }}
          color={getBorderColor().color}
          isDisabled={disabled}
          bg={getBorderColor().bg}
          pr="2.5rem"
        />
        <InputRightElement width="3rem" cursor="pointer">
          {isPassword && (
            <IconButton
              position="absolute"
              right="10px"
              top="60%"
              variant="unstyled"
              transform="translateY(-50%)"
              onClick={handleToggleVisibility}
              height="auto"
              minWidth="auto"
              aria-label="Toggle visibility"
              border="none"
              outline="none"
            >
              <Image
                src={showPassword ? visibilityOff : visibility}
                alt="Toggle visibility"
                style={{
                  filter: `invert(27%) sepia(84%) saturate(2448%) hue-rotate(165deg) brightness(95%) contrast(92%)`,
                }}
              />
            </IconButton>
          )}

          {iconType === "search" && (
            <Image
              src={searchIcon}
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

      {error && errorMessage && (
        <Box display="flex" alignItems="center">
          <Image src={warning} alt="Warning" mr="2" />
          <Text color="red.500" fontSize="12px">
            {errorMessage}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default CustomInput;
