import { IconButton } from "@chakra-ui/react";
import React from "react";
import IconByName from "../../../components/common/icons/Icon";

export const TopIcon = React.memo<{
  onClick: () => void;
  icon: string;
  _icon?: any;
  right?: string;
  left?: string;
  zIndex?: string;
  top?: string;
  bottom?: string;
  transition?: string;
  rounded?: string;
  roundedLeft?: string;
  size?: string;
  bg?: string;
  p?: string;
  _hover?: any;
  _active?: any;
}>(({ onClick, left, icon, _icon, ...props }) => {
  return (
    <IconButton
      aria-label="Go back"
      icon={<IconByName name={icon} boxSize="2rem" color="white" {..._icon} />}
      size="mg"
      variant="ghost"
      position="absolute"
      top="16px"
      left={left}
      zIndex="20"
      bg="#FFFFFF26"
      rounded={"full"}
      border={"none"}
      _focus={{ boxShadow: "none", outline: "none" }}
      onClick={onClick}
      {...props}
    />
  );
});
