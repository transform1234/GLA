import React from "react";
import {
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Box,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CloseButton from "./button/CloseButton";
import PrimaryButton from "./button/PrimaryButton";
import CustomHeading from "./typography/Heading";
interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  example: string;
  type : string;
}

const PopupModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  example,
  type = "username",
}) => {
  const { t } = useTranslation();

  const fieldConfig: any = {
    username: {
      KA: {
        labels: [
          {
            code: "FF",
            translationKey: "POPUP_FIRST_TWO_LETTERS_OF_YOUR_FIRST_NAME",
          },
          {
            code: "LL",
            translationKey: "POPUP_FIRST_TWO_LETTERS_OF_YOUR_LAST_NAME",
          },
          { code: "DD", translationKey: "POPUP_DATE" },
          { code: "MM", translationKey: "POPUP_MONTH" },
          { code: "YYYY", translationKey: "POPUP_YEAR" },
        ],
      },
      OD: {
        labels: [
          {
            code: "AA",
            translationKey: "POPUP_FIRST_TWO_LETTERS_OF_YOUR_FIRST_NAME_OD",
          },
          {
            code: "BB",
            translationKey: "POPUP_FIRST_TWO_LETTERS_OF_YOUR_LAST_NAME_OD",
          },
          { code: "CC", translationKey: "POPUP_DATE_OD" },
          { code: "DD", translationKey: "POPUP_MONTH_OD" },
          { code: "EEEE", translationKey: "POPUP_YEAR_OD" },
        ],
      },
    },
    password: {
      KA: {
        labels: [
          {
            code: "FF",
            translationKey: "POPUP_FIRST_TWO_LETTERS_OF_YOUR_FIRST_NAME",
          },
          {
            code: "LL",
            translationKey: "POPUP_FIRST_TWO_LETTERS_OF_YOUR_LAST_NAME",
          },
          { code: "DD", translationKey: "POPUP_DATE" },
          { code: "MM", translationKey: "POPUP_MONTH" },
          { code: "YYYY", translationKey: "POPUP_YEAR" },
        ],
      },
      OD: {
        labels: [
          {
            code: "AA",
            translationKey: "POPUP_FIRST_TWO_LETTERS_OF_YOUR_FIRST_NAME_OD",
          },
          {
            code: "BB",
            translationKey: "POPUP_FIRST_TWO_LETTERS_OF_YOUR_LAST_NAME_OD",
          },
          { code: "CC", translationKey: "POPUP_DATE_OD" },
          { code: "DD", translationKey: "POPUP_MONTH_OD" },
          { code: "EEEE", translationKey: "POPUP_YEAR_OD" },
        ],
      },
    },
  };

  const state = import.meta.env.VITE_APP_STATE;
  const config = fieldConfig[type][state];

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
            <CloseButton
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
            </CloseButton>
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
              {config?.labels.map((item: any) => (
                <Box
                  key={item}
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
              {config?.labels?.map((labelItem:any) => (
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
