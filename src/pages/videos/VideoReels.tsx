import {
  Box,
  Center,
  HStack,
  IconButton,
  Skeleton,
  SkeletonCircle,
  Stack,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import Layout from "../../components/common/layout/layout";
import useDeviceSize from "../../components/common/layout/useDeviceSize";
import SunbirdPlayer from "../../components/players/SunbirdPlayer";
import * as content from "../../services/content";
import IconByName from "../../components/common/icons/Icon";
import { handleEvent } from "./utils";
const VITE_PLAYER_URL = import.meta.env.VITE_PLAYER_URL;

const VideoItem: React.FC<{
  id: string;
  qml_id: string;
  isVisible: boolean;
  style: React.CSSProperties;
  refQml?: any;
}> = memo(({ id, qml_id, isVisible, refQml, style }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { width, height } = useDeviceSize();
  const [lesson, setLesson] = React.useState<{ mimeType: string }>({
    mimeType: "",
  });
  const [lessonQml, setLessonQml] = React.useState<{ mimeType: string }>({
    mimeType: "",
  });
  const [heightPerItem, setHeightPerItem] = useState<number>(0);
  useEffect(() => {
    setHeightPerItem(height / 8);
  }, [height]);

  useEffect(() => {
    if (!isVisible) return;
    const inti = async () => {
      setIsLoading(true);
      let resultData = await content.getOne({
        id,
        adapter: "diksha",
        type: "course",
      });
      if (qml_id) {
        let qmlResult = await content.getOne({
          id: qml_id,
          adapter: "diksha",
          type: "assessment",
        });
        setLessonQml(qmlResult);
      }
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
            {...{ ...lesson, iframeId: "course" }}
            userData={{
              firstName: localStorage.getItem("name"),
              lastName: "",
            }}
            public_url={VITE_PLAYER_URL}
          />
          {qml_id && (
            <Center>
              <SunbirdPlayer
                forwardedRef={isVisible ? refQml : false}
                style={{ border: "none", borderRadius: "16px" }}
                _vstack={{
                  position: "absolute",
                  bottom: "16px",
                  transition: "height 0.5s",
                }}
                {...{ width: width - 32, height: heightPerItem }}
                {...{ ...lessonQml, iframeId: "assessment" }}
                userData={{
                  firstName: localStorage.getItem("name"),
                  lastName: "",
                }}
                public_url={VITE_PLAYER_URL}
              />
            </Center>
          )}
        </div>
      ) : (
        <Stack gap="6" width="100%" height="100%" bg={"blackAlpha.400"}>
          <HStack gap="5" padding={4} justifyContent={"space-between"}>
            <HStack gap="5">
              <SkeletonCircle size="9" />
              <SkeletonCircle size="9" />
              <SkeletonCircle size="9" />
            </HStack>
            <SkeletonCircle size="9" />
          </HStack>
          <HStack
            width="full"
            position="absolute"
            justifyContent="center"
            alignItems="center"
            bottom="16px"
          >
            <Skeleton height="20" rounded={"16px"} width={width - 32} />
          </HStack>
        </Stack>
      )}
    </div>
  );
});

const VideoReel: React.FC<{ videos: any[] }> = ({ videos }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const qmlRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const { height: itemSize, width } = useDeviceSize();
  const navigate = useNavigate();
  const trackDataRef = useRef<any[]>([]);

  const handleScroll = useCallback(
    debounce(async ({ scrollOffset }: { scrollOffset: number }) => {
      const itemCount = videos.length;
      if (itemCount === 0) return;
      let newVisibleIndex = Math.round(scrollOffset / itemSize);
      if (newVisibleIndex >= 0 && newVisibleIndex !== visibleIndex) {
        setVisibleIndex(newVisibleIndex);
        // call traking API
        console.log({
          id: videos?.[newVisibleIndex]?.contentId,
          adapter: "diksha",
          type: "course",
          data: trackDataRef.current || [],
        });
      }
    }, 500),
    [videos, itemSize]
  );

  React.useEffect(() => {
    const handleEventNew = (event: any) => {
      newHandleEvent(event);
    };

    window.addEventListener("message", handleEventNew, false);

    return () => {
      window.removeEventListener("message", handleEventNew);
    };
  }, [itemSize]);

  const newHandleEvent = (data: any) => {
    const result = handleEvent(data);
    if (!result || !result?.type) return;
    if (result?.type === "height") {
      const he = itemSize / result?.data;
      if (qmlRef?.current) {
        qmlRef.current.style.height = `${he}px`;
      }
    } else {
      trackDataRef.current = [...trackDataRef.current, result];
    }
  };

  return (
    <Layout isFooterVisible={false} isHeaderVisible={false}>
      <Box position={"relative"}>
        <TopIcon
          onClick={() => navigate(-1)}
          icon={"ChevronLeftIcon"}
          left="16px"
        />
        <TopIcon
          onClick={() => console.log("TopIcon")}
          icon={"ThumbsUpIcon"}
          right="16px"
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
              refQml={qmlRef}
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

const TopIcon: React.FC<{
  onClick: () => void;
  icon: any;
  right?: string;
  left?: string;
}> = ({ onClick, left, icon, ...props }) => {
  return (
    <IconButton
      aria-label="Go back"
      icon={<IconByName name={icon} boxSize="2rem" color="primary.500" />}
      size="mg"
      variant="ghost"
      position="absolute"
      top="16px"
      left={left}
      zIndex="10"
      bg="primary.50"
      rounded={"full"}
      onClick={onClick}
      {...props}
    />
  );
};
