import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";
import Layout from "../../components/common/layout/layout";
import SunbirdPlayer from "../../components/players/SunbirdPlayer";
import * as content from "../../services/content";
import useDeviceSize from "../../components/common/layout/useDeviceSize";
import { Center } from "@chakra-ui/react";
const VITE_PLAYER_URL = import.meta.env.VITE_PLAYER_URL;
interface VideoItemProps {
  id: string;
  qml_id: string;
  style: React.CSSProperties;
}

const VideoItem: React.FC<VideoItemProps> = memo(({ id, qml_id, style }) => {
  const { width, height } = useDeviceSize();
  const [lesson, setLesson] = React.useState<{ mimeType: string }>({
    mimeType: "",
  });
  const [lessonQml, setLessonQml] = React.useState<{ mimeType: string }>({
    mimeType: "",
  });
  const [trackData, setTrackData] = React.useState<any[]>([]);
  const type = "";

  const handleTrackData = async (
    { score, attempts, ...props },
    playerType = "quml"
  ) => {
    console.log("handleTrackData", { score, attempts, ...props });
  };

  useEffect(() => {
    const inti = async () => {
      let resultData = await content.getOne({
        id,
        adapter: "diksha",
        type: "course",
      });
      let qmlResult = await content.getOne({
        id: qml_id,
        adapter: "diksha",
        type: "assessment",
      });
      setLessonQml(qmlResult);
      setLesson(resultData);
    };
    inti();
  }, [id]);

  return (
    <div
      style={{
        ...style,
        width: "100%",
        height: "100%",
        scrollSnapAlign: "start",
      }}
    >
      <SunbirdPlayer
        {...{ width, height }}
        {...lesson}
        userData={{
          firstName: localStorage.getItem("name"),
          lastName: "",
          // lastName: localStorage.getItem("lastName"),
        }}
        setTrackData={(data) => {
          if (
            [
              "assessment",
              "SelfAssess",
              "QuestionSet",
              "QuestionSetImage",
            ].includes(type)
          ) {
            handleTrackData(data);
          } else if (
            ["application/vnd.sunbird.questionset"].includes(lesson?.mimeType)
          ) {
            handleTrackData(data, "application/vnd.sunbird.questionset");
          } else if (
            [
              "application/pdf",
              "video/mp4",
              "video/webm",
              "video/x-youtube",
              "application/vnd.ekstep.h5p-archive",
            ].includes(lesson?.mimeType)
          ) {
            handleTrackData(data, "pdf-video");
          } else {
            if (
              ["application/vnd.ekstep.ecml-archive"].includes(lesson?.mimeType)
            ) {
              if (Array.isArray(data)) {
                const score = data.reduce(
                  (old, newData) => old + newData?.score,
                  0
                );
                // handleTrackData({ ...data, score: `${score}` }, "ecml");
                setTrackData(data);
              } else {
                handleTrackData({ ...data, score: `0` }, "ecml");
              }
            }
          }
        }}
        public_url={`${VITE_PLAYER_URL}`}
      />

      <Center>
        <SunbirdPlayer
          _vstack={{ position: "absolute", bottom: "30px" }}
          {...{ width: width - 20, height: height / 3 }}
          {...lessonQml}
          userData={{
            firstName: localStorage.getItem("name"),
            lastName: "",
            // lastName: localStorage.getItem("lastName"),
          }}
          setTrackData={(data) => {
            if (
              [
                "assessment",
                "SelfAssess",
                "QuestionSet",
                "QuestionSetImage",
              ].includes(type)
            ) {
              handleTrackData(data);
            } else if (
              ["application/vnd.sunbird.questionset"].includes(
                lessonQml?.mimeType
              )
            ) {
              handleTrackData(data, "application/vnd.sunbird.questionset");
            } else if (
              [
                "application/pdf",
                "video/mp4",
                "video/webm",
                "video/x-youtube",
                "application/vnd.ekstep.h5p-archive",
              ].includes(lessonQml?.mimeType)
            ) {
              handleTrackData(data, "pdf-video");
            } else {
              if (
                ["application/vnd.ekstep.ecml-archive"].includes(
                  lessonQml?.mimeType
                )
              ) {
                if (Array.isArray(data)) {
                  const score = data.reduce(
                    (old, newData) => old + newData?.score,
                    0
                  );
                  // handleTrackData({ ...data, score: `${score}` }, "ecml");
                  setTrackData(data);
                } else {
                  handleTrackData({ ...data, score: `0` }, "ecml");
                }
              }
            }
          }}
          public_url={`${VITE_PLAYER_URL}`}
        />
      </Center>
      {/* {isVisible ? (
        <iframe
          key={videoUrl}
          ref={videoRef}
          src={videoUrl}
          width="100%"
          height="100%"
          frameBorder={0}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Video"
        />
      ) : (
        <Stack gap="6" width="100%" height="100%" bg={"blackAlpha.400"}>
          <HStack gap="5" padding={5}>
            <SkeletonCircle size="8" />
            <Stack flex="1" gap="2">
              <Skeleton height="3" />
              <Skeleton height="3" width="80%" />
            </Stack>
          </HStack>
          <HStack
            width="full"
            position="absolute"
            justifyContent="center"
            alignItems="center"
            top="50%"
            transform="translateY(-50%)"
          >
            <SkeletonCircle size="20" />
          </HStack>
        </Stack>
      )} */}
    </div>
  );
});

const VideoReel = ({ videos }) => {
  const listRef = useRef();
  const [visibleIndex, setVisibleIndex] = useState(0);
  const { height: itemSize, width } = useDeviceSize();

  const handleScroll = useCallback(
    ({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => {
      if (!scrollUpdateWasRequested) return;
      const itemCount = videos.length;
      if (itemCount === 0) return;
      let newVisibleIndex = visibleIndex;
      if (scrollDirection === "backward") {
        if (scrollOffset > itemSize * 0.333) {
          newVisibleIndex = Math.min(visibleIndex + 1, itemCount - 1);
        }
      } else {
        if (scrollOffset < itemSize * 0.666) {
          newVisibleIndex = Math.max(visibleIndex - 1, 0);
        }
      }
      if (newVisibleIndex !== visibleIndex) {
        setVisibleIndex(newVisibleIndex);
      }
    },
    [videos, itemSize, visibleIndex]
  );

  return (
    <Layout>
      <List
        ref={listRef}
        width={width}
        height={itemSize}
        itemCount={videos.length}
        itemSize={itemSize}
        scrollToIndex={visibleIndex}
        onScroll={handleScroll}
        style={{
          scrollSnapType: "y mandatory",
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          touchAction: "none",
        }}
        className="hide-scrollbar"
      >
        {({ index, style }) => (
          <VideoItem
            id={videos?.[index]?.contentId}
            qml_id={videos?.[index]?.lesson_questionset}
            style={style}
            key={"VideoItem" + index}
          />
        )}
      </List>
    </Layout>
  );
};

export default VideoReel;
