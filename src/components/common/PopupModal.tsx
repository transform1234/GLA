import React from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
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
}

const PopupModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  showIcon,
  children,
  footerContent,
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
        <AlertDialogContent borderRadius="16px">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            <CustomHeading
              variant="h2"
              fontSize="1.25rem"
              fontWeight="bold"
              title={title}
              color="primary.500"
            />
            {showIcon && (
            <IconButton
              onClick={onClose}
              style={{
                position: "absolute",
                top: "14px",
                right: "10px",
                fontSize: "28px",
                cursor: "pointer",
              }}
              color="primary.500"
            >
              &times;
            </IconButton>
            )}
          </AlertDialogHeader>

          <AlertDialogBody>
          {children} 
          </AlertDialogBody>

          <AlertDialogFooter>
            {footerContent}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default PopupModal;
