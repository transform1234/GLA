import React from 'react';
import Modal from 'react-modal';
import { useTheme, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CommonButton, CloseButton } from './button/CommonButton';
import Typography from './typography/Typography';

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
          backgroundColor: theme.colors.brand.white,
        },
      }}
    >
      <Typography
        variant="h2"
        fontSize="1.25rem"
        fontWeight="bold"
        marginBottom="1rem"
        color={theme.colors.brand.primary}
      >
        {title}
      </Typography>


      <CloseButton
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '14px',
          right: '10px',
          fontSize: '28px',
          cursor: 'pointer',
        }}
        color={theme.colors.brand.primary}
      >
        &times;
      </CloseButton>

      {/* Message */}
      <Typography
        variant="p"
        fontSize="14px"
        marginBottom="10px"
        color={theme.colors.brand.textSecondary}
      >
        {message}
      </Typography>

      <Box

      >
        <Box display="flex" justifyContent="center" mb={4}>
          {['FF', 'LL', 'DD', 'MM', 'YYYY'].map((item) => (
            <Box
              key={item}
              p="5px 10px"
              bg={theme.colors.brand.backgroundGrey}
              fontWeight="bold"
              fontSize="14px"
            >
              {item}
            </Box>
          ))}
        </Box>

        <Box color={theme.colors.brand.textPrimary} textAlign="left">
          <Typography variant="h2" color={theme.colors.brand.textSecondary} fontSize="14px" style={{ paddingLeft: '28px' }} ><strong>FF:</strong> {t("FIRST_TWO_LETTERS_OF_YOUR_FIRST_NAME")}</Typography>
          <Typography variant="h2" color={theme.colors.brand.textSecondary} fontSize="14px" style={{ paddingLeft: '28px' }}><strong>LL:</strong>{t("FIRST_TWO_LETTERS_OF_YOUR_LAST_NAME")}</Typography>
          <Typography variant="h2" color={theme.colors.brand.textSecondary} fontSize="14px" style={{ paddingLeft: '28px' }}><strong>DD:</strong> {t("DATE")} </Typography>
          <Typography variant="h2" color={theme.colors.brand.textSecondary} fontSize="14px" style={{ paddingLeft: '28px' }}><strong>MM:</strong> {t("MONTH")} </Typography>
          <Typography variant="h2" color={theme.colors.brand.textSecondary} fontSize="14px" style={{ paddingLeft: '28px' }}><strong>YYYY:</strong> {t("YEAR")} </Typography>
        </Box>

      </Box>

      {/* Example */}
      <h2 style={{ color: theme.colors.brand.textSecondary, fontSize: '12px', marginTop: '10px', marginBottom: '10px', backgroundColor: theme.colors.brand.backgroundHighlight, padding: '10px' }}>
        <strong>{t("EXAMPLE")}:</strong><i>{example}</i> <strong>‘ANKU30121988’</strong>
      </h2>


      <CommonButton
        onClick={onClose}
        style={{
          width: '100%',
          height: '35px',
          fontWeight: "bold",
          top: '14px',
          right: '10px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
        color={theme.colors.brand.white}
        backgroundColor={theme.colors.brand.primary}
      >
        {t("UNDERSTOOD")}
      </CommonButton>
    </Modal>
  );
};

export default PopupModal;
