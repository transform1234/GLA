import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';

interface CommonButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const IconButton: React.FC<CommonButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button
      {...props}
      fontWeight="normal"
      padding="0"
      height="28px"
      width="28px"
      color="primary.500"
      bg="white"
      border="none"          
      outline="none"     
      boxShadow="none" 
      _hover={{ background: "transparent" }}
      _active={{ background: "transparent" }}
      _focus={{ outline: "none", boxShadow: "none" }}
    >
      {children}
    </Button>
  );
};

export default IconButton;
