import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';

interface CommonButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const CloseButton: React.FC<CommonButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button {...props}>
      {children}
    </Button>
  );
};

export default CloseButton;

