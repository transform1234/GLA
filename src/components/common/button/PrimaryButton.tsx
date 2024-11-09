import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

interface CommonButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const PrimaryButton: React.FC<CommonButtonProps> = ({ children, ...props }) => {
  return (
    <Button {...props} colorScheme="primary">
      {children}
    </Button>
  );
};

export default PrimaryButton;
