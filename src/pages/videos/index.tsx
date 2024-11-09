// src/App.tsx
import React, { useEffect, useState } from "react";
import VideoReel from "./VideoReels";
import { getAltUserContent } from "../../services/content";

const App = () => {
  const [videos, setVideos] = useState<Array<any>>([]);

  useEffect(() => {
    const init = async () => {
      const result = await getAltUserContent({ page: 1, limit: 6 });
      setVideos(result?.data || []);
    };
    init();
  }, []);

  return <VideoReel videos={videos} />;
};

export default App;
