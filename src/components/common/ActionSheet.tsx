import React, { ReactNode, memo } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import useDeviceSize from "./layout/useDeviceSize";
import IconByName from "./icons/Icon";

type RectComponentProps = {
  isOpen: boolean;
  onClose: () => void;
  headerComponent?: ReactNode;
  children?: ReactNode;
};

const ActionSheet: React.FC<RectComponentProps> = memo(
  ({ isOpen, onClose, headerComponent, children }) => {
    const { width } = useDeviceSize();

    return (
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent roundedTop="16px" width={width} justifySelf="center">
          <IconByName
            name="CloseIcon"
            color="primary.500"
            alt="close"
            cursor="pointer"
            width="14px"
            height="14px"
            position="absolute"
            right="8px"
            top="8px"
            onClick={onClose}
          />
          {headerComponent && <DrawerHeader>{headerComponent}</DrawerHeader>}
          <DrawerBody p="0">{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }
);

export default ActionSheet;
