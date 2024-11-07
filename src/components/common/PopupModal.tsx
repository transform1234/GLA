import React from 'react';
import Modal from 'react-modal';
import { useTheme, Box, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CloseButton from './button/CloseButton';
import Typography from './typography/Typography';
import PrimaryButton from './button/PrimaryButton';
import CustomHeading from './typography/Heading';

Modal.setAppElement('#root');

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
  const theme = useTheme();
  const { t } = useTranslation();


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Info Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          position: 'relative',
          width: '90%',
          maxWidth: '400px',
          padding: '20px',
          borderRadius: '10px',
          border: 'none',
          inset: 'unset',
          zIndex: 1001,
          backgroundColor:"white"
        },
      }}
    >

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
          position: 'absolute',
          top: '14px',
          right: '10px',
          fontSize: '28px',
          cursor: 'pointer',
        }}
        color="primary"
      >
        &times;
      </CloseButton>

      {/* Message */}
      <CustomHeading
       variant="p"
       fontSize="14px"
       mb="1rem"
       title={message} 
       color="textSecondary"
        />

      <Box

      >
        <Box display="flex" justifyContent="center" mb={4}>
          {['FF', 'LL', 'DD', 'MM', 'YYYY'].map((item) => (
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

        <Box color="textPrimary" textAlign="left">
        <CustomHeading  variant="h2"  paddingLeft="28px"  title={<><strong>FF:</strong> {t("POPUP_FIRST_TWO_LETTERS_OF_YOUR_FIRST_NAME")}</>}  color="textSecondary" />
        <CustomHeading  variant="h2"  paddingLeft="28px"  title={<><strong>LL:</strong> {t("POPUP_FIRST_TWO_LETTERS_OF_YOUR_LAST_NAME")}</>}  color="textSecondary" />
        <CustomHeading  variant="h2"  paddingLeft="28px"  title={<><strong>DD:</strong> {t("POPUP_DATE")}</>}  color="textSecondary" />
        <CustomHeading  variant="h2"  paddingLeft="28px"  title={<><strong>MM:</strong> {t("POPUP_MONTH")}</>}  color="textSecondary" />
        <CustomHeading  variant="h2"  paddingLeft="28px"  title={<><strong>YYYY:</strong> {t("POPUP_YEAR")}</>}  color="textSecondary" />
        </Box>

      </Box>

      {/* Example */}
      <CustomHeading  variant="h2" marginBottom="10px" marginTop="10px" fontSize="12px" padding="10px" title={<><strong>{t("POPUP_EXAMPLE")}:</strong><i>{example}</i> <strong>‘ANKU30121988’</strong></>}  color="textSecondary" bg="backgroundHighlight" />


      <PrimaryButton
        onClick={onClose}
        width="100%"
        color="white"
        bg="primary"
      >
        {t("POPUP_UNDERSTOOD")}
      </PrimaryButton>
    </Modal>
  );
};

export default PopupModal;
