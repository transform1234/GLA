import { FC } from 'react';
import { Heading, HeadingProps } from '@chakra-ui/react';

interface CustomHeadingProps extends HeadingProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
    title: any;
}

const CustomHeading: FC<CustomHeadingProps> = ({
    title,
  children,
  variant = "h2",
  ...props
}) => {
    return (
        <Heading
            as={variant}
            fontSize="14px"
            color="primary.500"
            {...props}
        >
      { title|| children}
        </Heading>
    );
};

export default CustomHeading;
