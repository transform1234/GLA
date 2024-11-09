import { Icon, Circle, Text } from "@chakra-ui/react";

interface IconProps {
  name: string;
  color?: string;
  [key: string]: any;
}

const iconsMap: Record<string, React.FC<IconProps>> = {
  QuestionIcon: ({ color, ...props }) => {
    return (
      <Circle
        size="24px"
        bg="transparent"
        border="2px solid"
        borderColor={color}
        display="flex"
        justifyContent="center"
        alignItems="center"
        {...props}
      >
        <Text fontSize="24px" color={color}>
          ?
        </Text>
      </Circle>
    );
  },
  HomeIcon: ({ color, ...props }) => {
    return (
      <Icon viewBox="0 0 24 24" {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
      </Icon>
    );
  },
  LeaderboardIcon: ({ color, ...props }) => {
    return (
      <Icon viewBox="0 0 21 18" {...props}>
        <path
          d="M2.20007 16H6.20007V8H2.20007V16ZM8.20007 16H12.2001V2H8.20007V16ZM14.2001 16H18.2001V10H14.2001V16ZM0.200073 18V6H6.20007V0H14.2001V8H20.2001V18H0.200073Z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  WatchIcon: ({ color, ...props }) => {
    return (
      <Icon viewBox="0 0 24 24" color={color} {...props}>
        <path
          d="M10 3h4v2h-4zM8 21h8v2H8zm4-19C6.477 3 2 7.477 2 13s4.477 10 10 10 10-4.477 10-10S17.523 3 12 3zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  ProfileIcon: ({ color, ...props }) => {
    return (
      <Icon viewBox="0 0 24 24" color={color} {...props}>
        <path
          d="M12 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0 2c-2.67 0-8 1.336-8 4v2h16v-2c0-2.664-5.33-4-8-4z"
          fill="currentColor"
        />
      </Icon>
    );
  },
};

const IconByName: React.FC<IconProps> = ({ name, color, ...props }) => {
  const Component = iconsMap[name];
  return Component ? <Component name={name} color={color} {...props} /> : null;
};

export default IconByName;
