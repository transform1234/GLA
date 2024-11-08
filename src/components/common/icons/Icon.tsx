import { Icon, Circle, Text } from "@chakra-ui/react";

const QuestionIcon = ({ isActive, ...props }) => {
  const color = isActive ? "primary" : "black";

  return (
    <Circle
      size="50px"
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
};
const HomeIcon = ({ isActive, ...props }) => {
  const color = isActive ? "primary" : "black";
  return (
    <Icon viewBox="0 0 24 24" color={color} {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
    </Icon>
  );
};

const LeaderboardIcon = ({ isActive, ...props }) => {
  const color = isActive ? "primary" : "black";

  return (
    <Icon viewBox="0 0 24 24" color="transparent" {...props}>
      <path
        d="M5 3h4v18H5V3zm5 4h4v14h-4V7zm5 8h4v6h-4v-6z"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </Icon>
  );
};

const WatchIcon = ({ isActive, ...props }) => {
  const color = isActive ? primary : "black";
  return (
    <Icon viewBox="0 0 24 24" color={color} {...props}>
      <path
        d="M10 3h4v2h-4zM8 21h8v2H8zm4-19C6.477 3 2 7.477 2 13s4.477 10 10 10 10-4.477 10-10S17.523 3 12 3zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
        fill="currentColor"
      />
    </Icon>
  );
};

const ProfileIcon = ({ isActive, ...props }) => {
  const color = isActive ? "primary" : "black";
  return (
    <Icon viewBox="0 0 24 24" color={color} {...props}>
      <path
        d="M12 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0 2c-2.67 0-8 1.336-8 4v2h16v-2c0-2.664-5.33-4-8-4z"
        fill="currentColor"
      />
    </Icon>
  );
};

export { HomeIcon, LeaderboardIcon, WatchIcon, ProfileIcon, QuestionIcon };
