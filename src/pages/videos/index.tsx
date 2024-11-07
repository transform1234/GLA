// src/App.jsx
import React from "react";
import VideoReel from "./VideoReels";

const videos = [
  {
    src: "https://www.youtube.com/embed/ZScpv7rS4lE?autoplay=1",
    type: "iframe",
    id: "do_1138907470163394561521",
    qml_id: "do_11389370198275686412930",
  },
  {
    src: "https://www.youtube.com/embed/E6Yvnsyh0_w?si=N_p6QZgTPJs2IQ8N&autoplay=1",
    type: "iframe",
    id: "do_11389554198553395211183",
    qml_id: "do_11389370198275686412930",
  },
  {
    src: "https://www.youtube.com/embed/WkVlVJsjbIg?si=_XPdRJllsjOD0GEy&autoplay=1",
    type: "iframe",
    id: "do_1138907470163394561521",
    qml_id: "do_11389370198275686412930",
  },
];

const App = () => {
  return <VideoReel videos={videos} />;
};

export default App;
