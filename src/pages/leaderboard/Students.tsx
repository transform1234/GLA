import React from "react";
import {
  Table,
  TableContainer,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  Text,
  VStack,
  RadioGroup,
  Radio,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ActionSheet from "../../components/common/ActionSheet";

interface StudentsProps {
  data: any[];
  bodyHeight: string;
  activeCollapse: string | undefined;
  radioValue: string;
  handleViewChange: (radioSelection: string) => void;
}

const Students: React.FC<StudentsProps> = ({
  data,
  bodyHeight,
  activeCollapse,
  radioValue,
  handleViewChange,
}) => {
  const { t } = useTranslation();
  const [localRadioValue, setLocalRadioValue] = React.useState(radioValue);

  React.useEffect(() => {
    setLocalRadioValue(radioValue);
  }, [radioValue]);

  return (
    <TableContainer p="4" pb="80px" overflowY="auto" maxHeight={bodyHeight}>
      <Table variant="simple" size="md">
        <Thead position="sticky" top="0" zIndex="1" bg="white">
          <Tr>
            <Th color="textPrimary">{t("LEADERBOARD_NAME")}</Th>
            <Th color="textPrimary" textAlign="center">
              {t("LEADERBOARD_RANK")}
            </Th>
            <Th color="textPrimary" textAlign="right">
              {t("LEADERBOARD_COINS")}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item: any, index) => (
            <Tr key={index}>
              <Td p="2">
                <Text
                  textTransform="capitalize"
                  lineHeight="19.36px"
                  fontWeight="400"
                  fontSize="16px"
                  color={"darkBlue.500"}
                >
                  {item?.userId === localStorage.getItem("id")
                    ? "You"
                    : item?.name}
                </Text>
                <Text
                  variant="italicText"
                  fontWeight="400"
                  fontSize="10px"
                  lineHeight="12.1px"
                  color="lightGrey"
                >
                  {item?.className}
                </Text>
              </Td>
              <Td textAlign="center" p="2">
                <Text
                  fontWeight="700"
                  fontSize="14px"
                  lineHeight="16.94px"
                  textAlign="center"
                >
                  {item?.rank}
                </Text>
              </Td>
              <Td textAlign="right" p="2">
                <Text
                  fontWeight="700"
                  fontSize="14px"
                  lineHeight="16.94px"
                  textAlign="right"
                >
                  {item?.points}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ActionSheet
        isOpen={Boolean(activeCollapse == "view")}
        onClose={() => handleViewChange(localRadioValue)}
        headerComponent={
          <VStack align={"start"}>
            <Text
              fontFamily="Bebas Neue"
              fontSize="24px"
              lineHeight="28px"
              fontWeight="400"
              color="primary.500"
            >
              {t("LEADERBOARD_VIEW")}
            </Text>
            <Text
              lineHeight="14px"
              fontWeight="400"
              fontSize="14px"
              color="lightGrey"
            >
              {t("LEADERBOARD_HOW_YOU_STAND_WITH_OTHER")}
            </Text>
          </VStack>
        }
      >
        <VStack align={"start"} p="4" pt="0">
          <RadioGroup
            value={localRadioValue}
            onChange={setLocalRadioValue}
            gap="8px"
          >
            <VStack align="stretch" gap="8px">
              <Radio mt="16px" mb="16px" value="School">
                <HStack justify="space-between" width="100%">
                  <Text
                    fontWeight="400"
                    fontSize="20px"
                    lineHeight="16px"
                    mr="2"
                  >
                    {t("LEADERBOARD_SCHOOL")}
                  </Text>
                  <Text
                    fontWeight="400"
                    fontSize="12px"
                    lineHeight="16px"
                    variant="italicText"
                  >
                    {t("LEADERBOARD_DEFAULT")}
                  </Text>
                </HStack>
              </Radio>
              <Radio mb="16px" value="Class">
                <Text fontWeight="400" fontSize="20px" lineHeight="16px">
                  {t("LEADERBOARD_CLASS")}
                </Text>
              </Radio>
              <Radio mb="16px" value="Board">
                <Text fontWeight="400" fontSize="20px" lineHeight="16px">
                  {t("LEADERBOARD_BOARD")}
                </Text>
              </Radio>
            </VStack>
          </RadioGroup>
          <Button
            mt="4"
            colorScheme="blue"
            onClick={() => handleViewChange(localRadioValue)}
            width="100%"
          >
            {t("LEADERBOARD_APPLY")}
          </Button>
        </VStack>
      </ActionSheet>
    </TableContainer>
  );
};

export default Students;
