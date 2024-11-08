import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  LeaderboardIcon,
  WatchIcon,
  QuestionIcon,
  ProfileIcon,
} from "../icons/Icon";

interface FooterProps {
  activeIcon?: string;
}

const Footer: React.FC<FooterProps> = ({ activeIcon }) => {
  return (
    <Flex
      as="footer"
      position="fixed"
      left={0}
      width="100%"
      height="56px"
      justifyContent="space-around"
      alignItems="center"
      bg="gray.100"
      p={4}
      boxShadow="0 -4px 12px rgba(0, 0, 0, 0.05)"
    >
      <Box textAlign="center">
        <Link to="/home">
          <HomeIcon isActive={activeIcon === "home"} boxSize={6} />
          <Text fontSize="sm">Home</Text>
        </Link>
      </Box>
      <Box textAlign="center">
        <Link to="/leaderboard">
          <LeaderboardIcon
            isActive={activeIcon === "leaderboard"}
            boxSize={6}
          />
          <Text fontSize="sm">Leaderboard</Text>
        </Link>
      </Box>
      <Box textAlign="center">
        <Link to="/videos">
          <WatchIcon isActive={activeIcon === "watch"} boxSize={6} />
          <Text fontSize="sm">Watch</Text>
        </Link>
      </Box>
      <Box textAlign="center">
        <Link to="/guide">
          <QuestionIcon isActive={activeIcon === "question"} boxSize={6} />
          <Text fontSize="sm">Guide</Text>
        </Link>
      </Box>
      <Box textAlign="center">
        <Link to="/profile">
          <ProfileIcon isActive={activeIcon === "profile"} boxSize={6} />
          <Text fontSize="sm">Profile</Text>
        </Link>
      </Box>
    </Flex>
  );
};

export default Footer;
