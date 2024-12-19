// src/App.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loading";
import { fetchSearchResults } from "../../services/content";
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

const App = (props: any) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);
  const query = new URLSearchParams(window.location.search);
  const index = query.get("index");
  const [programID, setProgramID] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchTerm(query);
  }, [location.search]);

  useEffect(() => {
    const programId = localStorage.getItem("programID");
    if (programId) {
      setProgramID(programId);
    }
  }, []);

  useEffect(() => {
    const fetchData = async (search: any) => {
      try {
        if (!search) return;
        const payload = {
          searchQuery: search,
          programId: programID,
          subject: await getSubject(),
          limit: 100,
        };

        const result = await fetchSearchResults(payload);

        if (result?.paginatedData?.length === 0) {
          setError(
            `No content available for the subject: ${localStorage.getItem(
              "subject"
            )}.`
          );
        } else {
          setVideos(result?.paginatedData || []);
        }
      } catch (e) {
        setError(
          `Failed to fetch content for the selected subject: ${localStorage.getItem(
            "subject"
          )}.`
        );
      }
    };

    fetchData(searchTerm);
  }, [searchTerm, programID]);

  // Fetch all content when searchTerm is empty
  useEffect(() => {
    if (!searchTerm) {
      const fetchAllContent = async () => {
        try {
          const payload = {
            programId: programID,
            subject: await getSubject(),
            limit: 100,
            searchQuery: "",
          };

          const result = await fetchSearchResults(payload);

          if (result?.paginatedData?.length === 0) {
            setError("No content available.");
          } else {
            setVideos(result?.paginatedData || []);
          }
        } catch (e) {
          setError("Failed to fetch all content.");
        }
      };

      fetchAllContent();
    }
  }, [searchTerm, programID]);
  const onBackClick = () => {
    navigate(-1);
  };

  return error ? (
    <Loading showSpinner={false} message={error} onBackClick={onBackClick} />
  ) : (
    <VideoReel {...{ programID, videos, activeIndex: index, ...props }} />
  );
};

export default App;
