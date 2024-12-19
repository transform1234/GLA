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
  Image,
} from "@chakra-ui/react";
import PopupModal from "../../components/common/PopupModal";
import transformLogo from "../../assets/logo/TSHeader.png";
import logo from "../../assets/logo/Logo-Large.png";
import background from "../../assets/images/bg.png";
import { fetchToken, getAuthUser } from "../../services/auth/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/common/button/PrimaryButton";
import CustomHeading from "../../components/common/typography/Heading";
import Layout from "../../components/common/layout/layout";
import CustomInput from "../../components/common/input/CustomInput";
import fieldConfig from "../../utils/constants/fieldConfig";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    alert?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isLoginDisabled = !(username && password);
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    example: "",
    labels: [] as { code: string; translationKey: string }[],
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useTranslation();

  const state = import.meta.env.VITE_APP_STATE;

  const getModalExample = (type: "username" | "password") => {
    const currentState = state || "KA";
    const translationKey = `LOGIN_${type.toUpperCase()}_EXAMPLE_EXPLANATION_${currentState}`;
    return t(translationKey);
  };

  const openModal = (
    title: string,
    message: string,
    type: "username" | "password"
  ) => {
    const modalExample = getModalExample(type);

    setModalContent({
      title: title,
      message: message,
      example: modalExample,
      labels: fieldConfig[type][state || "KA"].labels,
    });
    onOpen();
  };

  const userName = localStorage.getItem("name");
  const grade = localStorage.getItem("grade");
  const medium = localStorage.getItem("medium");
  const id = localStorage.getItem("id");
  const board = localStorage.getItem("board");

  const validate = () => {
    let arr: { username?: string; password?: string } = {};
    if (typeof username === "undefined" || username === "") {
      arr = { ...arr, username: t("LOGIN_USERNAME_IS_REQUIRED") };
    }

    if (typeof password === "undefined" || password === "") {
      arr = { ...arr, password: t("LOGIN_PASSWORD_IS_REQUIRED") };
    }

    setErrors(arr);
    if (arr.username || arr.password) {
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setIsSubmitted(true);
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
      try {
        const result = await fetchToken(username, password);
        if (result) {
          if (result?.authUser?.userId) {
            navigate(0);
            navigate("/home");
          } else {
            localStorage.removeItem("token");
            setErrors({ alert: t("LOGIN_PLEASE_ENTER_VALID_CREDENTIALS") });
          }
        } else {
          localStorage.removeItem("token");
          setErrors({ alert: t("LOGIN_PLEASE_ENTER_VALID_CREDENTIALS") });
        }
      } catch (error) {
        setErrors({
          username: t("LOGIN_INVALID_USER_NAME"),
          password: t("LOGIN_INVALID_PASSWORD"),
        });
      }
    }
  };
  const handleInputChange = (field: any, value: any) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value ? "" : t("LOGIN_REQUIRED_FIELD"),
    }));
    if (field === "username") setUsername(value);
    if (field === "password") setPassword(value);
  };

  return (
    <Layout isHeaderVisible={false} isFooterVisible={false}>
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
            <Box width="100%" padding="15px">
              <Box
                position="absolute"
                top={["2vh", "3vh"]}
                left={["2vw", "1vw"]}
              >
                <Image
                  src={transformLogo}
                  alt="Transform Schools Logo"
                  width={["28vw", "16vw", "8vw"]}
                  marginTop={["3vh", "5vh"]}
                />
              </Box>

              {/* Centered content */}
              <Center height="100%">
                <VStack spacing={6}>
                  <Box marginTop="100px" marginBottom="50px">
                    <Image
                      src={logo}
                      alt="App Logo"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Box>
                </VStack>
              </Center>
              {/* </Box> */}
              <VStack mt="40px">
                <CustomHeading
                  fontFamily="Bebas Neue"
                  variant="h2"
                  fontSize="24px"
                  fontWeight="400"
                  title={t("LOGIN_TO_YOUR_ACCOUNT")}
                  color="black"
                />
                <FormControl isInvalid={!!errors.username}>
                  <FormLabel>
                    {t("LOGIN_USERNAME")}
                    <Link
                      onClick={() =>
                        openModal(
                          t("LOGIN_FORGOT_USERNAME"),
                          t(
                            "LOGIN_YOUR_USERNAME_IS_CREATED_IN_THE_FORMAT_AS_SHOWN_BELOW"
                          ),
                          "username"
                        )
                      }
                    >
                      {t("LOGIN_FORGOT_USERNAME")}
                    </Link>
                  </FormLabel>
                  <CustomInput
                    placeholder={t("LOGIN_ENTER_USER_NAME")}
                    value={username}
                    onChange={(value) => handleInputChange("username", value)}
                    error={!!errors.username && isSubmitted} // Show only after first submit
                    errorMessage={errors.username}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel mt="10px">
                    {t("LOGIN_PASSWORD")}
                    <Link
                      onClick={() =>
                        openModal(
                          t("LOGIN_FORGOT_PASSWORD"),
                          t(
                            "LOGIN_YOUR_PASSWORD_IS_CREATED_IN_THE_FORMAT_AS_SHOWN_BELOW"
                          ),
                          "password"
                        )
                      }
                    >
                      {t("LOGIN_FORGOT_PASSWORD")}
                    </Link>
                  </FormLabel>
                  <CustomInput
                    placeholder={t("LOGIN_ENTER_PASSWORD")}
                    value={password}
                    isPassword={true}
                    onChange={(value) => handleInputChange("password", value)}
                    error={!!errors.password && isSubmitted}
                    errorMessage={errors.password}
                  />
                </FormControl>

                <PrimaryButton
                  onClick={handleLogin}
                  width="100%"
                  color="white"
                  disabled={isLoginDisabled}
                  marginTop="20px"
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
                  showIcon={true}
                  footerContent={
                    <PrimaryButton
                      onClick={onClose}
                      width="100%"
                      color="white"
                      bg="primary.500"
                    >
                      {t("POPUP_UNDERSTOOD")}
                    </PrimaryButton>
                  }
                >
                  <CustomHeading
                    variant="p"
                    fontSize="14px"
                    mb="1rem"
                    title={modalContent.message}
                    color="textSecondary"
                  />

                  <Box display="flex" justifyContent="center" mt={4}>
                    {modalContent.labels?.map((item: any) => (
                      <Box
                        key={item}
                        p="5px 10px"
                        bg="backgroundGrey"
                        fontWeight="bold"
                        fontSize="14px"
                      >
                        {item.code}
                      </Box>
                    ))}
                  </Box>

                  <Box color="textPrimary" textAlign="left" mt={4}>
                    {modalContent.labels?.map((labelItem: any) => (
                      <CustomHeading
                        key={labelItem.code}
                        variant="h2"
                        paddingLeft="28px"
                        title={
                          <>
                            <strong>{labelItem.code}:</strong>{" "}
                            {t(labelItem.translationKey)}
                          </>
                        }
                        color="textSecondary"
                      />
                    ))}
                  </Box>

                  {modalContent.example && (
                    <Box mt={4}>
                      <CustomHeading
                        variant="h2"
                        marginBottom="10px"
                        marginTop="10px"
                        fontSize="12px"
                        padding="10px"
                        title={
                          <>
                            <strong>{t("POPUP_EXAMPLE")}:</strong>
                            <strong>
                              <i>{modalContent.example}</i>
                            </strong>
                          </>
                        }
                        color="textSecondary"
                        bg="backgroundHighlight"
                      />
                    </Box>
                  )}
                </PopupModal>
              </VStack>
            </Box>
          </Center>
        </Box>
      </Center>
    </Layout>
  );
}
