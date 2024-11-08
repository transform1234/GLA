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
}

const PopupModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  example,
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
              color="primary"
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
              color="primary"
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
              {["FF", "LL", "DD", "MM", "YYYY"].map((item) => (
                <Box
                  key={item}
                  p="5px 10px"
                  bg="backgroundGrey"
                  fontWeight="bold"
                  fontSize="14px"
                >
                  {item}
                </Box>
              ))}
            </Box>

            <Box color="textPrimary" textAlign="left" mt={4}>
              <CustomHeading
                variant="h2"
                paddingLeft="28px"
                title={
                  <>
                    <strong>FF:</strong>{" "}
                    {t("POPUP_FIRST_TWO_LETTERS_OF_YOUR_FIRST_NAME")}
                  </>
                }
                color="textSecondary"
              />
              <CustomHeading
                variant="h2"
                paddingLeft="28px"
                title={
                  <>
                    <strong>LL:</strong>{" "}
                    {t("POPUP_FIRST_TWO_LETTERS_OF_YOUR_LAST_NAME")}
                  </>
                }
                color="textSecondary"
              />
              <CustomHeading
                variant="h2"
                paddingLeft="28px"
                title={
                  <>
                    <strong>DD:</strong> {t("POPUP_DATE")}
                  </>
                }
                color="textSecondary"
              />
              <CustomHeading
                variant="h2"
                paddingLeft="28px"
                title={
                  <>
                    <strong>MM:</strong> {t("POPUP_MONTH")}
                  </>
                }
                color="textSecondary"
              />
              <CustomHeading
                variant="h2"
                paddingLeft="28px"
                title={
                  <>
                    <strong>YYYY:</strong> {t("POPUP_YEAR")}
                  </>
                }
                color="textSecondary"
              />
            </Box>

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
          </AlertDialogBody>

          <AlertDialogFooter>
            <PrimaryButton
              onClick={onClose}
              width="100%"
              color="white"
              bg="primary"
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
