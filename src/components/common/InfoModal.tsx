import React from 'react';
import Modal from 'react-modal';
import { useTheme, Box, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

Modal.setAppElement('#root');

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  example: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
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
          backgroundColor: theme.colors.white,
        },
      }}
    >
      {/* Modal Title */}
      <h2 style={{ color: theme.colors.brand.primary, fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        {title}
      </h2>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '14px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '28px',
          cursor: 'pointer',
          color: theme.colors.brand.primary,
        }}
      >
        &times;
      </button>

      {/* Message */}
      <p style={{ color: theme.colors.brand.greyColor, fontSize: '14px', lineHeight: '21px', marginBottom: '10px' }}>
        {message}
      </p>

      {/* Box to contain both the format items and the explanation */}
      <Box
      
      >
        {/* Password Format Explanation Boxes */}
        <Box display="flex" justifyContent="center"  mb={4}>
          {['FF', 'LL', 'DD', 'MM', 'YYYY'].map((item) => (
            <Box
              key={item}
              p="5px 10px"
              bg="brand.lightGrey"
              fontWeight="bold"
              fontSize="14px"
            >
              {item}
            </Box>
          ))}
        </Box>

        {/* Explanation Texts */}
        <Box color={theme.colors.brand.fontColor} textAlign="left">
       <h2  style={{  fontSize: '14px' , paddingLeft: '28px'}}><strong>FF:</strong> {t("FIRST_TWO_LETTERS_OF_YOUR_FIRST_NAME")}</h2>
       <h2  style={{  fontSize: '14px', paddingLeft: '28px'}}><strong>LL:</strong>{t("FIRST_TWO_LETTERS_OF_YOUR_LAST_NAME")}</h2>
       <h2  style={{  fontSize: '14px', paddingLeft: '28px'}}><strong>DD:</strong> {t("DATE")} </h2>
       <h2  style={{  fontSize: '14px', paddingLeft: '28px'}}><strong>MM:</strong> {t("MONTH")} </h2>
       <h2  style={{  fontSize: '14px', paddingLeft: '28px'}}><strong>YYYY:</strong> {t("YEAR")} </h2>
        </Box>
        
      </Box>

      {/* Example */}
      <h2 style={{  color: theme.colors.brand.greyColor , fontSize:'12px', marginTop:'10px',marginBottom:'10px', backgroundColor:theme.colors.brand.seaBlue, padding: '10px'}}>
      <strong>Example:</strong><i>{example}</i> <strong>‘ANKU30121988’</strong>
      </h2>

      {/* Understood Button */}
      <Button
        onClick={onClose}
        w="100%"
        py={2}
        bg={theme.colors.brand.primary}
        color="white"
        fontWeight="bold"
        borderRadius="md"
        _hover={{ bg: theme.colors.brand[500] }}
      >
        UNDERSTOOD
      </Button>
    </Modal>
  );
};

export default InfoModal;
