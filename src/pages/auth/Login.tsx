import React, { useState } from "react";
import {
  VStack,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
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
      arr = { ...arr, username: t("USERNAME_IS_REQUIRED") };
    }

    if (
      typeof password === "undefined" ||
      password === ""
    ) {
      arr = { ...arr, password: t("PASSWORD_IS_REQUIRED") };
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
        // try {

        // } catch (e) {
        //   localStorage.removeItem("token");
        // }

        resultTeacher = await getAuthUser();

        localStorage.setItem('id', resultTeacher?.data[0]?.userId)
        localStorage.setItem('name', resultTeacher?.data[0]?.name)
        localStorage.setItem('grade', resultTeacher?.data[0]?.grade)
        localStorage.setItem('medium', resultTeacher?.data[0]?.medium)
        localStorage.setItem('board', resultTeacher?.data[0]?.board)
        localStorage.setItem('section', resultTeacher?.data[0]?.section)

        if (resultTeacher?.data[0]?.userId) {
          // try {
          //   const fcmToken = await getUserToken(swPath);
          //   let id = localStorage.getItem("id");
          //   await userRegistryService.update({ id, fcmToken });
          //   localStorage.setItem("fcmToken", fcmToken);
          // } catch (e) {
          //   localStorage.setItem("fcmToken", "");
          // }
          // eventBus.publish("AUTH", {
          //   eventType: "LOGIN_SUCCESS",
          //   data: {
          //     token: token,
          //   },
          // });
          navigate("/home");
          navigate(0);
        } else {
          localStorage.removeItem("token");
          setErrors({ alert: t("PLEASE_ENTER_VALID_CREDENTIALS") });
        }
      } else {
        localStorage.removeItem("token");
        setErrors({ alert: t("PLEASE_ENTER_VALID_CREDENTIALS") });
      }
    }
  };

  return (
    // need to uncomment this line
    // Layout
    <Center minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box
        minH="100vh"
        display="flex"
        flexDirection={"column"}
        position={"relative"}
        w="100%"
        borderRadius="md"
        backgroundImage={`url(${background})`}
      >
        <Center>
          <Box marginTop="40px" width="250px">
            <img src={logo} alt="App Logo" />
          </Box>
        </Center>
        <VStack mt="40px">
          <Text mb="20px">{t("LOGIN_TO_YOUR_ACCOUNT")}</Text>

          <FormControl isInvalid={!!errors.username}>
            <FormLabel>
              {t("USERNAME")}
              <Link onClick={() => openModal(t("FORGOT_USERNAME"), t("YOUR_USERNAME_IS_CREATED_IN_THE_FORMAT_AS_SHOWN_BELOW"), t("USERNAME_EXAMPLE_EXPLANATION"))}>
                {t("FORGOT_USERNAME")}
              </Link>
            </FormLabel>
            <Input
              placeholder={t("ENTER_USER_NAME")}
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
              {t("PASSWORD")}
              <Link onClick={() => openModal(t("FORGOT_PASSWORD"), t("YOUR_PASSWORD_IS_CREATED_IN_THE_FORMAT_AS_SHOWN_BELOW"), t("IF_YOUR_NAME_IS_ANISH_KUMAR_AND_YOUR_DOB"))}>
                {t("FORGOT_PASSWORD")}
              </Link>
            </FormLabel>
            <Input
              type={show ? "text" : "password"}
              placeholder={t("ENTER_PASSWORD")}
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
              color="brand.primary"
              background="white"
              transform="translateY(-50%)"
              icon={show ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setShow(!show)}
              height="0"
              minWidth="0"
              aria-label=""
            />
          </FormControl>

          <Button mt={4} width="100%" onClick={handleLogin} isDisabled={isLoginDisabled}>
            {t("LOGIN")}
          </Button>


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
    //  </Layout>
  );
}