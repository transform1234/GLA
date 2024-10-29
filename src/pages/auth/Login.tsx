import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem("token", "true");
    navigate(0);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100vw"
      height="100vh"
    >
      <VStack
        as="form"
        onSubmit={handleSubmit}
        spacing={4}
        p={8}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
      >
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="teal">
          Login
        </Button>
        <Link href="/register">Don't have an account? Register</Link>
      </VStack>
    </Box>
  );
};

export default Login;
