import React, { useCallback, memo } from "react";
import VideoEnd from "./VideoEnd";
import SunbirdPlayer from "../../../components/players/SunbirdPlayer";
import CustomSkeleton from "./CustomSkeleton";
import { updateCdataTag } from "../utils";
import { Box } from "@chakra-ui/react";
const VITE_PLAYER_URL = import.meta.env.VITE_PLAYER_URL;
const TELEMETRYBATCH = import.meta.env.VITE_TELEMETRYBATCH || 20;

interface ContentPlayerProps {
  video_id?: string;
  subject?: string;
  lesson?: { mimeType: string };
  thumbnailUrl?: string;
  qml_id?: string;
  videoEndId?: { id?: string };
  setVideoEndId?: React.Dispatch<React.SetStateAction<any>>;
  width?: number;
  height?: number;
  adapter?: string;
}

const ContentPlayer: React.FC<ContentPlayerProps> = ({
  video_id,
  subject,
  videoEndId,
  width,
  height,
  thumbnailUrl,
  setVideoEndId,
  lesson,
  qml_id,
  adapter,
}) => {
  const handleSetVideoEndId = useCallback(
    () => setVideoEndId?.({ video_id }),
    [video_id, setVideoEndId]
  );

  return (
    <Box>
      {videoEndId?.id === video_id ? (
        <VideoEnd
          {...{ width, height, thumbnailUrl }}
          setVideoEndId={handleSetVideoEndId}
        />
      ) : (
        <SunbirdPlayer
          LoaderComponent={({ display }: any) => (
            <CustomSkeleton display={display} />
          )}
          {...{
            width: width || 0,
            height: height || 0,
            _playerStypeHeight: height,
            mimeType: lesson?.mimeType || "",
            ...lesson,
            iframeId: "course",
            userData: {
              firstName: localStorage.getItem("name"),
              lastName: "",
            },
            public_url: VITE_PLAYER_URL,
            adapter: adapter || "",
            playerContext: updateCdataTag([
              {
                id: subject,
                type: "subject",
              },
              {
                id: qml_id,
                type: "question_set",
              },
              {
                id: lesson?.mimeType,
                type: "mimeType",
              },
            ]),
            batchsize: TELEMETRYBATCH,
          }}
        />
      )}
    </Box>
  );
};

export default memo(ContentPlayer);
