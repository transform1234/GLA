// src/App.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loading";
import { getAltUserContent } from "../../services/content";
import { getProgramId, getSubjectList } from "../../services/home";
import VideoReel from "./VideoReels";

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
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);
  const [programID, setProgramID] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      try {
        const result = await getAltUserContent({
          page: 1,
          limit: 60,
          programId: localStorage.getItem("programID") || "",
          subject: await getSubject(),
        });

        if (result?.data?.length === 0) {
          setError(
            `No content available for the subject: ${localStorage.getItem(
              "subject"
            )}.`
          );
        } else {
          setVideos(result?.data || []);
        }
        const programData = await getProgramId();
        if (programData?.programId) {
          setProgramID(programData?.programId);
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
  const onBackClick = () => {
    navigate(-1);
  };

  return error ? (
    <Loading showSpinner={false} message={error} onBackClick={onBackClick} />
  ) : (
    <VideoReel videos={videos} programID={programID} />
  );
};

export default App;
