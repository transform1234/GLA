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
  Text,
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
          position="relative"
          width="100vw"
          backgroundImage={`url(${background})`}
          backgroundRepeat="no-repeat"
        >
          <Box position="absolute" top={["2vh", "3vh"]} left={["2vw", "1vw"]}>
            <Image
              src={transformLogo}
              alt="Transform Schools Logo"
              width={["115.71px"]}
              marginTop={["68px"]}
              marginLeft={["16px"]}
            />
          </Box>

          {/* Centered content */}
          <Center>
            <Box>
              <Box marginTop="281px">
                <Image
                  height="70px"
                  width="360px"
                  src={logo}
                  alt="App Logo"
                  transform="scale(0.9)"
                />
              </Box>
              {/* </Box> */}
              <VStack mt="20px">
                <CustomHeading
                  fontFamily="Bebas Neue"
                  fontSize="24px"
                  lineHeight="28px"
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
                   height="56px"
                   marginTop="16px"
                  disabled={isLoginDisabled}
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
                  maxWidth="380px" 
                  height="460px"   
                  footerContent={
                    <PrimaryButton
                      onClick={onClose}
                      height="56px"
                    >
                     <Text  
                          lineHeight="24px"
                          fontSize="16px"
                          fontWeight="700"
                          color="white"
                          > {t("POPUP_UNDERSTOOD")}</Text> 
                    </PrimaryButton>
                  }
                >
                  <CustomHeading
                    fontSize="14px"
                    lineHeight="21px"
                    fontWeight="400"
                    fontFamily="Inter"
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
                        paddingLeft="28px"
                        color="textSecondary"
                        title=""
                      >
                        <Text as="strong" fontWeight="700">
                          {labelItem.code}:
                        </Text>{" "}
                        <Text as="span" color="textSecondary">
                          {t(labelItem.translationKey)}
                        </Text>
                      </CustomHeading>
                    ))}
                  </Box>

                  {modalContent.example && (
                    <Box>
                      <CustomHeading
                        marginTop="10px"
                        fontSize="12px"
                        padding="10px"
                        gap="10px"
                        borderRadius="4px"
                        minHeight="68px"
                        minWidth="333px"
                        color="textSecondary"
                        bg="backgroundHighlight"
                        title=""
                      >
                        <Text
                          as="strong"
                          variant="italicText"
                          lineHeight="16px"
                          fontSize="12px"
                          fontWeight="700"
                        >
                          {t("POPUP_EXAMPLE")}:
                        </Text>{" "}
                        <Text
                          as="span"
                          variant="italicText"
                          lineHeight="16px"
                          fontSize="12px"
                          fontWeight="700"
                          color="textSecondary"
                        >
                          {modalContent.example}
                          <Text
                            variant="italicText"
                            as="span"
                            fontWeight="700"
                            fontSize="12px"
                            wordBreak="break-word"
                          >
                            "ANKU30121988"{" "}
                          </Text>
                        </Text>
                      </CustomHeading>
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
