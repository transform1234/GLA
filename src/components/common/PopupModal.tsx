import React from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Flex,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import IconButton from "./button/IconButton";
import CustomHeading from "./typography/Heading";
interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  showIcon: boolean;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  maxWidth?: string;
  height?: string; 
}

const PopupModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  showIcon,
  children,
  footerContent,
  maxWidth = "380px",
  height = "460px",
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <AlertDialog
      leastDestructiveRef={React.createRef<HTMLDivElement>()}
      isOpen={isOpen}
      onClose={onClose}
      size={"xs"}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent
          maxWidth={maxWidth} 
          height={height}
          borderRadius="16px"
          >
            <AlertDialogHeader>
      <Flex justifyContent="space-between" alignItems="center">
        <CustomHeading
          fontSize="24px"
          fontFamily="Bebas Neue"
          lineHeight="28px"
          fontWeight="400"
          title={title}
          color="primary.500"
        />
        {showIcon && (
          <IconButton
            onClick={onClose}
            style={{
              fontSize: "28px",
              cursor: "pointer",
            }}
            color="primary.500"
            aria-label="Close"
          >
            &times;
          </IconButton>
        )}
      </Flex>
    </AlertDialogHeader>


          <AlertDialogBody >
          {children} 
          </AlertDialogBody>

          <AlertDialogFooter paddingTop={0}>
            {footerContent}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default PopupModal;
