import { Center, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { impression } from "../../services/telemetry";
import CustomHeading from "../../components/common/typography/Heading";
import Layout from "../../components/common/layout/layout";
import ClassCard from "../../components/common/cards/ClassCard";
import { getTeacherData } from "../../services/home";
import { checkUserDetails } from "../../services/auth/auth";

export default function TeacherHomepage(props: any) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { authUser } = props;
  const [classes, setClasses] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchTeacherDataForClasses = React.useCallback(async () => {
    try {
      const result = await checkUserDetails();
      if (!result) {
        setError("No class details found.");
        return;
      }

      const groupMemberships = result?.data?.GroupMemberships || [];

      const classDataArray: any[] = [];

      await Promise.all(
        groupMemberships.map(async (classDetail: any) => {
          const payload = {
            groupId: classDetail?.Group?.groupId,
            schoolUdise: classDetail?.School?.udiseCode,
            grade: String(classDetail?.Group?.grade),
            medium: classDetail?.Group?.medium,
            board: classDetail?.Group?.board,
          };

          const data = await getTeacherData(payload);

          // Create class object
          const classObj = {
            ...data,
            subjects: data?.subjectResults || [],
            title: `Class ${classDetail?.Group?.grade}`,
            groupId: classDetail?.Group?.groupId,
            schoolUdise: classDetail?.School?.udiseCode,
            grade: String(classDetail?.Group?.grade),
            medium: classDetail?.Group?.medium,
            board: classDetail?.Group?.board,
          };

          classDataArray.push(classObj);
        })
      );
      setClasses(classDataArray);
    } catch (error: any) {
      setError(`Error fetching teacher data for classes:${error?.message}`);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchTeacherDataForClasses();
  }, [authUser]);

  useEffect(() => {
    impression({
      edata: {
        type: "TeacherHomepage",
        pageid: "TeacherHomepage",
        uri: "/teacher",
        query: Object.fromEntries(
          new URLSearchParams(location.search).entries()
        ),
        visits: [],
      },
    });
  }, []);

  const handleCardClick = (group: any, subject?: any) => {
    navigate(
      subject
        ? `/class/${group.board}/${group.schoolUdise}/${group.grade}/${group.medium}/${group.groupId}/${subject}`
        : `/class/${group.board}/${group.schoolUdise}/${group.grade}/${group.medium}/${group.groupId}`,
      {}
    );
  };

  return (
    <Layout
      isFooterVisible={false}
      _header={{
        userInfo: true,
      }}
      loading={loading}
    >
      {error ? (
        <Center h="calc(100vh - 123px)">
          <CustomHeading color="red.500" textAlign="center">
            {error}
          </CustomHeading>
        </Center>
      ) : (
        <VStack spacing={10} align={"stretch"} px="4">
          <VStack pt="6" spacing={4}>
            <CustomHeading
              textAlign="center"
              lineHeight="20px"
              fontFamily="Inter"
              variant="h2"
              fontSize="20px"
              fontWeight="500"
              title={t("TEACHER_PAGE_VIEW_YOUR_IMPACT")}
              color="textPrimary"
            />
          </VStack>

          {classes?.map((group: any) => (
            <ClassCard
              key={group.groupId}
              title={true}
              data={group}
              onClick={() => handleCardClick(group)}
              subjectClick={(sub) => handleCardClick(group, sub)}
            />
          ))}
        </VStack>
      )}
    </Layout>
  );
}
