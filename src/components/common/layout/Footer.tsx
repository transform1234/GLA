import React, { useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  Center,
  VStack,
  BoxProps,
  useTheme,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link, generatePath } from "react-router-dom";
import useDeviceSize from "./useDeviceSize";
import IconByName from "../icons/Icon";

interface FooterProps {
  menues: Array<{ title: string; route?: string; icon?: string; id?: string }>;
  routeDynamics?: boolean;
  setRef?: (ref: HTMLDivElement | null) => void;
}

const PressableNew: React.FC<
  {
    item: FooterProps["menues"][number];
    children: React.ReactNode;
    routeDynamics?: boolean;
  } & BoxProps
> = ({ item, children, routeDynamics, ...prop }) => {
  return item?.route ? (
    <Box {...prop}>
      <Link
        style={{ textDecoration: "none" }}
        to={
          routeDynamics
            ? generatePath(item.route, { ...{ id: item.id } })
            : item.route
        }
      >
        {children}
      </Link>
    </Box>
  ) : (
    <Box {...prop}>{children}</Box>
  );
};

const Footer: React.FC<FooterProps> = ({
  menues,
  routeDynamics,
  setRef,
  ...props
}) => {
  const [selected, setSelected] = React.useState(0);
  const { t } = useTranslation();
  const { width } = useDeviceSize();
  const footerMenus = menues;
  const { colors } = useTheme();

  useEffect(() => {
    let path = window?.location?.pathname.toString();
    const arrData = footerMenus?.map((e) => e?.route);
    const index = arrData?.indexOf(path.split("/").slice(0, 3).join("/"));
    if (index > 0) {
      setSelected(index);
    }
  }, []);

  return (
    <Box
      width={width}
      flex={1}
      position="fixed"
      bottom="0"
      ref={(e) => typeof setRef === "function" && setRef(e)}
      {...props}
      zIndex={10}
    >
      <HStack
        bg="primary.50"
        alignItems="center"
        borderTopStyle={"solid"}
        borderBottomWidth={"1px"}
        borderBottomColor={"footerBorderGray"}
        shadow={"FooterShadow"}
      >
        {footerMenus?.map((item: any, index) => (
          <PressableNew
            item={item}
            key={`${item}-${index}`}
            cursor="pointer"
            flex={1}
            onClick={() => {
              setSelected(index);
              item?.onClick && item?.onClick();
            }}
          >
            <Text
              {...(item?.isOutOFBox && {
                color: selected === index ? "primary.500" : "white",
              })}
            >
              <Center>
                <VStack alignItems="center">
                  <VStack
                    py="3"
                    alignItems="center"
                    spacing={1}
                    {...(item?.isOutOFBox && {
                      bottom: "20px",
                      position: "absolute",
                      bg: "primary.500",
                      rounded: "full",
                      width: "80px",
                      height: "80px",
                      border: "3px solid white",
                      py: "0px",
                      justifyContent: "center",
                    })}
                  >
                    <Box
                      w="100%"
                      padding={"2px 20px"}
                      {...(item?.isOutOFBox && {
                        padding: "0px",
                      })}
                      bg={selected === index ? "primary.100" : "transparent"}
                      rounded="16px"
                    >
                      <IconByName
                        name={item?.icon || "HomeIcon"}
                        disabled
                        _icon={{
                          size: "24px",
                          color:
                            selected === index
                              ? colors?.["primary"]?.["500"]
                              : colors?.["gray"]?.["900"],
                        }}
                      />
                    </Box>
                    <Text
                      fontSize="12"
                      lineHeight="16px"
                      {...(item?.isOutOFBox && {
                        color: selected === index ? "primary.500" : "white",
                      })}
                    >
                      {t(item.title)}
                    </Text>
                  </VStack>
                </VStack>
              </Center>
            </Text>
          </PressableNew>
        ))}
      </HStack>
    </Box>
  );
};

export default Footer;
