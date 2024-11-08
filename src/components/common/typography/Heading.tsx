import { FC } from 'react';
import { Heading, HeadingProps } from '@chakra-ui/react';

interface CustomHeadingProps extends HeadingProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
    title: any;
    marginBottom?: string;
}

const CustomHeading: FC<CustomHeadingProps> = ({ title, variant = 'h2', ...props }) => {
    return (
        <Heading
            as={variant}
            fontSize="14px"
            color="primary"
            marginBottom='1rem'
            {...props}
        >
            {title}
        </Heading>
    );
};

export default CustomHeading;
