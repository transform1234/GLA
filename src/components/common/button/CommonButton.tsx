import React from 'react';

interface CommonButtonProps {
  onClick?: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  color?: string;
  backgroundColor?: string;
}


const CommonButton: React.FC<CommonButtonProps> = ({
  onClick,
  style,
  children,
  className,
  disabled = false,
  color = 'black',
  backgroundColor = 'white',
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        ...style,
        color,
        backgroundColor,
      }}
      className={className}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

const CloseButton: React.FC<CommonButtonProps> = ({
  onClick,
  children,
  className,
  disabled = false,
  color = 'black',
  style = {},
}) => {
  const defaultStyles: React.CSSProperties = {
    position: 'absolute',
    top: '14px',
    right: '10px',
    fontSize: '28px',
    cursor: 'pointer',
    color,
    ...style,
  };

  return (
    <button
      onClick={onClick}
      className={className}
      style={defaultStyles}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export { CommonButton, CloseButton };
