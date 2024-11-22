import {
  Box,
  Collapse,
  HStack,
  Image,
  useDisclosure,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import background from "../../../assets/images/home-bg.png";
import palooza_logo from "../../../assets/logo/Logo-Large.png";
import CustomHeading from "../typography/Heading";
import { useTranslation } from "react-i18next";
import CustomInput from "../input/CustomInput";
import { useState, useEffect } from "react";
import IconByName from "../icons/Icon";

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { isOpen, onToggle } = useDisclosure();
  const [isScrolled, setIsScrolled] = useState(false);

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
        {/* Logo Section */}
        <HStack justifyContent="space-between" align={"stretch"}>
          <Image src={`${palooza_logo}`} height="25px" />
          <IconByName
            name={"SearchIcon"}
            boxSize="1.5rem"
            color="white"
            onClick={onToggle}
          />
        </HStack>
        {/* Greeting Text */}
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
        {/* Search Input */}
        <Collapse
          in={isOpen}
          transition={{ enter: { duration: 0.2 }, exit: { duration: 0.2 } }}
        >
          <CustomInput
            placeholder={t("HOME_SEARCH")}
            value={search}
            onChange={setSearch}
            iconType="search"
            showClearIcon={true}
          />
        </Collapse>
      </VStack>
    </Box>
  );
};

export default Header;
