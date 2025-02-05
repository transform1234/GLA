import { Box, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ClassCard from "../../components/common/cards/ClassCard";
import Layout from "../../components/common/layout/layout";
import { getTeacherData } from "../../services/home";
import { impression } from "../../services/telemetry";
import Students from "./SchoolAdminStudent";

export default function SchoolAdminDetails(props: any) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const { authUser } = props;
  const { board, schoolUdise, grade, medium, groupId, subject } = useParams();
  const [classDetails, setClassDetails] = useState<any>({});
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<any>(subject);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProgramId = async () => {
      try {
        const payload = {
          groupId: groupId,
          schoolUdise: schoolUdise,
          grade: String(grade),
          medium: medium,
          board: board,
        };
        let data = await getTeacherData(payload);
        const classObj = {
          ...data,
          subjects: data?.subjectResults || [],
        };
        setClassDetails(classObj);
      } catch (error) {
        console.error("Error fetching program data:", error);
        setError(t("An unexpected error occurred. Please try again later."));
      } finally {
        setLoading(false);
      }
    };

    fetchProgramId();
  }, [authUser]);

  useEffect(() => {
    impression({
      edata: {
        type: "SchoolAdminDetails",
        pageid: "SchoolAdminDetails",
        uri: "/schoolAdmin",
        query: Object.fromEntries(
          new URLSearchParams(location.search).entries()
        ),
        visits: [],
      },
    });
  }, []);

  return (
    <Layout
      loading={loading}
      isFooterVisible={false}
      _header={{
        bgc: "blue40",
        userInfo: false,
        isShowBackButton: true,
        headingTitle: `CLASS ${grade}`,
        onBack: () => navigate("/schoolAdmin"),
      }}
    >
      <VStack align={"stretch"}>
        {error ? (
          <Text color="red.500" fontSize="xl" textAlign="center" mt="10">
            {error}
          </Text>
        ) : (
          <VStack p={4} spacing={4} align={"stretch"}>
            <ClassCard
              title={false}
              data={classDetails}
              subjectClick={(e) => setSelectedSubject(e)}
              selectedSubject={selectedSubject || "all"}
            />
            {/* Table Section */}
            <Students
              {...{
                groupId: groupId || "",
                schoolUdise: schoolUdise || "",
                grade: String(grade) || "",
                medium: medium || "",
                board: board || "",
                subject:
                  selectedSubject == "all" ? undefined : selectedSubject || "",
              }}
            />
          </VStack>
        )}
      </VStack>
    </Layout>
  );
}
