import React, { useState } from "react";
import {
  VStack,
  Box,
  Input,
  FormControl,
  FormLabel,
  Link,
  Center,
  IconButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import PopupModal from "../../components/common/PopupModal";
import logo from '../../assets/logo/TSHeader.png';
import background from '../../assets/images/bg.png';
// import Layout from "../../components/common/layouts/layout";
import { fetchToken, getAuthUser } from "../../services/auth/auth";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/common/button/PrimaryButton";
import CustomHeading from "../../components/common/typography/Heading";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const isLoginDisabled = !(username && password);
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    example: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openModal = (title, message, example) => {
    setModalContent({ title, message, example });
    onOpen();
  };
  const { t } = useTranslation();

  const userName = localStorage.getItem("name");
  const grade = localStorage.getItem("grade");
  const medium = localStorage.getItem("medium");
  const id = localStorage.getItem("id");
  const board = localStorage.getItem("board");

  const validate = () => {
    let arr = {};
    if (
      typeof username === "undefined" ||
      username === ""
    ) {
      arr = { ...arr, username: t("LOGIN_USERNAME_IS_REQUIRED") };
    }

    if (
      typeof password === "undefined" ||
      password === ""
    ) {
      arr = { ...arr, password: t("LOGIN_PASSWORD_IS_REQUIRED") };
    }

    setErrors(arr);
    if (arr.username || arr.password) {
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    const telemetryImpression = {
      context: {
        env: "log-in",
        cdata: [],
      },
      edata: {
        type: "edit",

        subtype: "Scroll",

        pageid: "log-in",

        uid: id,

        studentid: "student-id",

        userName: userName,

        grade: grade,

        medium: medium,

        board: board,
      },
    };
    // telemetryFactory.impression(telemetryImpression);

    const telemetryInteract = {
      context: {
        env: "sign-in",
        cdata: [],
      },
      edata: {
        id: "login-button",
        type: "CLICK",
        subtype: "",
        pageid: "sign-in",
        uid: id,

        studentid: "student-id",

        userName: userName,

        grade: grade,

        medium: medium,

        board: board,
      },
    };
    // telemetryFactory.interact(telemetryInteract);
    if (validate()) {
      const result = await fetchToken(
        username,
        password,
      );

      if (result) {
        let token = result?.access_token;
        let refreshToken = result?.refresh_token;
        sessionStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("token", token);

        let resultTeacher = {};
        resultTeacher = await getAuthUser();

        localStorage.setItem('id', resultTeacher?.data[0]?.userId)
        localStorage.setItem('name', resultTeacher?.data[0]?.name)
        localStorage.setItem('grade', resultTeacher?.data[0]?.grade)
        localStorage.setItem('medium', resultTeacher?.data[0]?.medium)
        localStorage.setItem('board', resultTeacher?.data[0]?.board)
        localStorage.setItem('section', resultTeacher?.data[0]?.section)

        if (resultTeacher?.data[0]?.userId) {
          navigate("/home");
          navigate(0);
        } else {
          localStorage.removeItem("token");
          setErrors({ alert: t("LOGIN_PLEASE_ENTER_VALID_CREDENTIALS") });
        }
      } else {
        localStorage.removeItem("token");
        setErrors({ alert: t("LOGIN_PLEASE_ENTER_VALID_CREDENTIALS") });
      }
    }
  };

  return (
    // need to uncomment this line
    // Layout
    <Center>
      <Box
       minH="100vh"
       display="flex"
       flexDirection="column"
       position="relative"
       w="100%"
       backgroundImage={`url(${background})`}
       backgroundSize="cover"
       backgroundPosition="center"
      >
        <Center height="100vh">
          <Box
            width="100%" padding="15px"
          >
            <Center>
              <Box marginTop="40px" width="250px">
                <img src={logo} alt="App Logo" />
              </Box>
            </Center>
            <VStack mt="40px">
            <CustomHeading fontFamily="Bebas Neue" variant="h2" fontSize="24px" fontWeight="400" title={t("LOGIN_TO_YOUR_ACCOUNT")} color="black"  />
              <FormControl isInvalid={!!errors.username}>
                <FormLabel>
                  {t("LOGIN_USERNAME")}
                  <Link onClick={() => openModal(t("LOGIN_FORGOT_USERNAME"), t("LOGIN_YOUR_USERNAME_IS_CREATED_IN_THE_FORMAT_AS_SHOWN_BELOW"), t("LOGIN_USERNAME_EXAMPLE_EXPLANATION"))}>
                    {t("LOGIN_FORGOT_USERNAME")}
                  </Link>
                </FormLabel>
                <Input
                  placeholder={t("LOGIN_ENTER_USER_NAME")}
                  value={username}
                  style={{
                    display: isOpen ? 'none' : 'block',
                    marginBottom: '20px',
                  }}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel mt="10px">
                  {t("LOGIN_PASSWORD")}
                  <Link onClick={() => openModal(t("LOGIN_FORGOT_PASSWORD"), t("LOGIN_YOUR_PASSWORD_IS_CREATED_IN_THE_FORMAT_AS_SHOWN_BELOW"), t("LOGIN_IF_YOUR_NAME_IS_ANISH_KUMAR_AND_YOUR_DOB"))}>
                    {t("LOGIN_FORGOT_PASSWORD")}
                  </Link>
                </FormLabel>
                <Input
                  type={show ? "text" : "password"}
                  placeholder={t("LOGIN_ENTER_PASSWORD")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  pr="2.5rem"
                  style={{
                    display: isOpen ? 'none' : 'block',
                    marginBottom: '20px',
                  }}
                />
                <IconButton
                  position="absolute"
                  right="10px"
                  top="60%"
                  color="primary"
                  background="white"
                  transform="translateY(-50%)"
                  icon={show ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShow(!show)}
                  height="0"
                  minWidth="0"
                  aria-label=""
                />
              </FormControl>

              <PrimaryButton
                onClick={handleLogin}
                width="100%"
                color="white"
                bg="primary"
                isDisabled={isLoginDisabled}
              >
                {t("LOGIN")}
              </PrimaryButton>


              {errors.alert && (
                <Alert status="error" mt={4}>
                  <AlertIcon />
                  <AlertTitle>{errors.alert}</AlertTitle>
                </Alert>
              )}

              <PopupModal
                isOpen={isOpen}
                onClose={onClose}
                title={modalContent.title}
                message={modalContent.message}
                example={modalContent.example}
              />
            </VStack>
          </Box>
        </Center>
      </Box>
    </Center>
    //  </Layout>
  );
}