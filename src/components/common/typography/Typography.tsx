import React from 'react';
import { useTheme } from '@chakra-ui/react';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'p';
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  marginBottom?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'h2',
  color = 'black',
  fontSize = '1.25rem',
  fontWeight = 'bold',
  marginBottom = '1rem',
  className,
  style,
}) => {

  const Tag = variant;

  return (
    <Tag
      style={{
        color: color,
        fontSize,
        fontWeight,
        marginBottom,
        ...style,
      }}
      className={className}
    >
      {children}
    </Tag>
  );
};

export default Typography;
