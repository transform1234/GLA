import React from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Box,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import IconButton from "./button/IconButton";
import PrimaryButton from "./button/PrimaryButton";
import CustomHeading from "./typography/Heading";
interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  example: string;
  labels: { code: string; translationKey: string }[];
}

const PopupModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  example,
  labels,
}) => {
  const { t } = useTranslation();

  return (
    <AlertDialog
      leastDestructiveRef={React.createRef<HTMLDivElement>()}
      isOpen={isOpen}
      onClose={onClose}
      size={"xs"}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            <CustomHeading
              variant="h2"
              fontSize="1.25rem"
              fontWeight="bold"
              mb="1rem"
              title={title}
              color="primary.500"
            />
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
          </AlertDialogHeader>

          <AlertDialogBody>
            <CustomHeading
              variant="p"
              fontSize="14px"
              mb="1rem"
              title={message}
              color="textSecondary"
            />

            <Box display="flex" justifyContent="center" mt={4}>
              {labels?.map((item: any) => (
                <Box
                  key={item.code}
                  p="5px 10px"
                  bg="backgroundGrey"
                  fontWeight="bold"
                  fontSize="14px"
                >
                  {item.code}
                </Box>
              ))}
            </Box>

            <Box color="textPrimary" textAlign="left" mt={4}>
              {labels?.map((labelItem: any) => (
                <CustomHeading
                  key={labelItem.code}
                  variant="h2"
                  paddingLeft="28px"
                  title={
                    <>
                      <strong>{labelItem.code}:</strong>{" "}
                      {t(labelItem.translationKey)}
                    </>
                  }
                  color="textSecondary"
                />
              ))}
            </Box>

            {example && (
            <Box mt={4}>
              <CustomHeading
                variant="h2"
                marginBottom="10px"
                marginTop="10px"
                fontSize="12px"
                padding="10px"
                title={
                  <>
                    <strong>{t("POPUP_EXAMPLE")}:</strong>
                    <strong>
                      <i>{example}</i>
                    </strong>
                  </>
                }
                color="textSecondary"
                bg="backgroundHighlight"
              />
            </Box>
          )}
          </AlertDialogBody>

          <AlertDialogFooter>
            <PrimaryButton
              onClick={onClose}
              width="100%"
              color="white"
              bg="primary.500"
            >
              {t("POPUP_UNDERSTOOD")}
            </PrimaryButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default PopupModal;
