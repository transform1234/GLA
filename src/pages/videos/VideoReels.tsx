import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
} from "react";
import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import Layout from "../../components/common/layout/layout";
import SunbirdPlayer from "../../components/players/SunbirdPlayer";
import * as content from "../../services/content";
import useDeviceSize from "../../components/common/layout/useDeviceSize";
import {
  Box,
  Center,
  HStack,
  IconButton,
  Skeleton,
  SkeletonCircle,
  Stack,
} from "@chakra-ui/react";
const VITE_PLAYER_URL = import.meta.env.VITE_PLAYER_URL;
import { debounce, round } from "lodash";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const VideoItem: React.FC<{
  id: string;
  qml_id: string;
  isVisible: boolean;
  style: React.CSSProperties;
}> = memo(({ id, qml_id, isVisible, style }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { width, height } = useDeviceSize();
  const [heightPerItem, setHeightPerItem] = useState<number>(0);
  useEffect(() => {
    setHeightPerItem(height / 3);
  }, [height]);

  const [lesson, setLesson] = React.useState<{ mimeType: string }>({
    mimeType: "",
  });
  const [lessonQml, setLessonQml] = React.useState<{ mimeType: string }>({
    mimeType: "",
  });
  const [trackData, setTrackData] = React.useState<any[]>([]);
  const type = "";

  const handleTrackData = async (
    { score, attempts, ...props }: { score: any; attempts: any },
    playerType = "quml"
  ) => {
    // console.log("handleTrackData", { score, attempts, ...props });
  };

  useEffect(() => {
    if (!isVisible) return;
    const inti = async () => {
      // alert(JSON.stringify({ width, height }));

      setIsLoading(true);
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
      setIsLoading(false);
    };
    inti();
  }, [id, isVisible]);

  return (
    <div
      style={{
        ...style,
        width: "100%",
        height: "100%",
        scrollSnapAlign: "start",
      }}
    >
      {isVisible && !isLoading ? (
        <div>
          <SunbirdPlayer
            {...{ width, height }}
            _playerStypeHeight={height}
            {...lesson}
            userData={{
              firstName: localStorage.getItem("name"),
              lastName: "",
              // lastName: localStorage.getItem("lastName"),
            }}
            setTrackData={(data: any) => {
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
                  lesson?.mimeType
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
                ].includes(lesson?.mimeType)
              ) {
                handleTrackData(data, "pdf-video");
              } else {
                if (
                  ["application/vnd.ekstep.ecml-archive"].includes(
                    lesson?.mimeType
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
                    handleTrackData({ ...data, score: 0 }, "ecml");
                  }
                }
              }
            }}
            public_url={VITE_PLAYER_URL}
          />

          <Center>
            <SunbirdPlayer
              style={{ border: "none", borderRadius: "16px" }}
              _vstack={{
                position: "absolute",
                bottom: "20px",
                transition: "height 0.5s",
              }}
              {...{ width: width - 20, height: heightPerItem }}
              {...lessonQml}
              userData={{
                firstName: localStorage.getItem("name"),
                lastName: "",
                // lastName: localStorage.getItem("lastName"),
              }}
              setTrackData={(data: any) => {
                if (["iconUp", "iconDown"].includes(data)) {
                  if (data === "iconUp") {
                    setHeightPerItem(height / 8);
                  } else {
                    setHeightPerItem(height / 3);
                  }
                } else if (
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
                      handleTrackData({ ...data, score: 0 }, "ecml");
                    }
                  }
                }
              }}
              public_url={VITE_PLAYER_URL}
            />
          </Center>
        </div>
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
      )}
    </div>
  );
});

const VideoReel: React.FC<{ videos: any[] }> = ({ videos }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const { height: itemSize, width } = useDeviceSize();
  const navigate = useNavigate();

  const handleScroll = useCallback(
    debounce(({ scrollOffset }: { scrollOffset: number }) => {
      const itemCount = videos.length;
      if (itemCount === 0) return;
      let newVisibleIndex = Math.round(scrollOffset / itemSize);
      if (newVisibleIndex >= 0) {
        setVisibleIndex(newVisibleIndex);
      }
    }, 500),
    [videos, itemSize, visibleIndex]
  );

  return (
    <Layout isFooterVisible={false} isHeaderVisible={false}>
      <Box position={"relative"}>
        <IconButton
          aria-label="Go back"
          icon={<ChevronLeftIcon boxSize="2rem" color="primary.500" />}
          onClick={() => navigate(-1)}
          size="mg"
          variant="ghost"
          position="absolute"
          top="10px"
          left="10px"
          zIndex="10"
          bg="primary.50"
          p="1"
          rounded={"full"}
        />
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
          {({
            index,
            style,
          }: {
            index: number;
            style: React.CSSProperties;
          }) => (
            <VideoItem
              id={videos?.[index]?.contentId}
              qml_id={videos?.[index]?.lesson_questionset}
              isVisible={index === visibleIndex}
              style={style}
              key={"VideoItem" + index}
            />
          )}
        </List>
      </Box>
    </Layout>
  );
};

export default VideoReel;
