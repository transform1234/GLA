import { Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { impression } from "../../services/telemetry";
import CustomHeading from "../../components/common/typography/Heading";
import Layout from "../../components/common/layout/layout";
import ClassCard from "../../components/common/cards/ClassCard";
import { getTeacherData } from "../../services/home";
import { checkUserDetails } from "../../services/auth/auth";

export default function TeacherPage(props: any) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { authUser } = props;
  const [subjectsByClass, setSubjectsByClass] = useState<any>([]);

  const fetchTeacherDataForClasses = async () => {
    try {
      const result = await checkUserDetails();
      if (!result) {
        console.log("No class details found.");
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
          const classCompletionPercentage =
            data?.classCompletionPercentage || "0.00";
          const subjects =
            data?.subjectResults?.map((assoc: any) => ({
              subject: assoc?.subject || "No Subject",
              averageCompletionPercentage:
                assoc?.data?.averageCompletionPercentage || "0%",
            })) || [];

          const totalProgress = subjects.reduce(
            (sum: any, subj: any) =>
              sum + parseFloat(subj.averageCompletionPercentage),
            0
          );
          const overallProgress = subjects.length
            ? `${(totalProgress / subjects.length).toFixed(2)}%`
            : "0%";

          // Create class object
          const classObj = {
            title: `Class ${classDetail?.Group?.grade}`,
            classCompletionPercentage,
            overallProgress,
            subjectList: subjects,
            groupId: classDetail?.Group?.groupId,
            schoolUdise: classDetail?.School?.udiseCode,
            grade: String(classDetail?.Group?.grade),
            medium: classDetail?.Group?.medium,
            board: classDetail?.Group?.board,
          };

          classDataArray.push(classObj);
        })
      );
      setSubjectsByClass(classDataArray);
    } catch (error) {
      console.error("Error fetching teacher data for classes:", error);
    }
  };

  useEffect(() => {
    fetchTeacherDataForClasses();
  }, [authUser]);

  useEffect(() => {
    impression({
      edata: {
        type: "TeacherPage",
        pageid: "TeacherPage",
        uri: "/teacher",
        query: Object.fromEntries(
          new URLSearchParams(location.search).entries()
        ),
        visits: [],
      },
    });
  }, []);

  const handleCardClick = (group: any) => {
    navigate(
      `/class-details/${group.board}/${group.schoolUdise}/${group.grade}/${group.medium}/${group.groupId}`,
      {}
    );
  };

  return (
    <Layout
      isFooterVisible={false}
      _header={{
        userInfo: true,
      }}
    >
      <VStack spacing={10} align={"stretch"} px="4">
        {error ? (
          <Text color="red.500" fontSize="xl" textAlign="center" mt="10">
            {error}
          </Text>
        ) : (
          <>
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

            {subjectsByClass?.map((group: any, index: any) => (
              <ClassCard
                key={group.groupId}
                title={true}
                data={group}
                onClick={() => handleCardClick(group)}
              />
            ))}
          </>
        )}
      </VStack>
    </Layout>
  );
}
