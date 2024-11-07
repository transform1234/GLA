// src/App.tsx
import React, { useEffect, useState } from "react";
import VideoReel from "./VideoReels";
import { getAll } from "../../services/content";

const App = () => {
  const [videos, setVideos] = useState<Array<any>>([]);

  useEffect(() => {
    const init = async () => {
      const result = await getAll();
      setVideos(result?.prog || []);
      console.log(result, result?.prog, "result?.prog");
    };
    init();
  }, []);
  console.log(videos, "videos");
  return <VideoReel videos={videos} />;
};

export default App;
