// src/App.tsx
import React, { useEffect, useState } from "react";
import { Box, IconButton, Flex, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import VideoReel from "./VideoReels";
import { getAltUserContent } from "../../services/content";
import { getProgramId, getSubjectList } from "../../services/home";
import Loading from "../../components/common/Loading";

const getSubject = async () => {
  if (!localStorage.getItem("subject")) {
    const programData = await getProgramId();
    if (programData) {
      const res: any = await getSubjectList();
      const subject = res?.[0]?.subject;
      if (subject) {
        localStorage.setItem("subject", subject);
        return subject;
      } else {
        return null;
      }
    }
  }
  return localStorage.getItem("subject") || null;
};

const App = () => {
  const [videos, setVideos] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const result = await getAltUserContent({
          page: 1,
          limit: 60,
          programId: "e5fe89b2-cbc6-473a-99ba-83313d2e4072",
          subject: await getSubject(),
        });
        console.log(result);
        if (result?.data?.length === 0) {
          setError(
            `No content available for the subject: ${localStorage.getItem(
              "subject"
            )}.`
          );
        } else {
          setVideos(result?.data || []);
        }
      } catch (e) {
        setError(
          `Failed to fetch content for the selected subject: ${localStorage.getItem(
            "subject"
          )}.`
        );
      }
    };
    init();
  }, []);
  console.log(error);
  return error ? (
    <Loading showSpinner={false} showBackButton={true} message={error} />
  ) : (
    <VideoReel videos={videos} />
  );
};

export default App;
