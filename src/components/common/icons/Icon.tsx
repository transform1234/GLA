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
  LogoutIcon: ({ color, ...props }) => {
    return (
      <Icon
        viewBox="0 0 1024 1024"
        fill="currentColor"
        height="1em"
        width="1em"
        color={color}
        {...props}
      >
        <path d="M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 01-112.7 75.9A352.8 352.8 0 01512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 01-112.7-75.9 353.28 353.28 0 01-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 000-12.6z" />
      </Icon>
    );
  },
};

const IconByName: React.FC<IconProps> = ({ name, color, ...props }) => {
  const Component = iconsMap[name];
  return Component ? <Component name={name} color={color} {...props} /> : null;
};

export default IconByName;
