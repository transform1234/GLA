import {
  Box,
  HStack,
  IconButton,
  Skeleton,
  SkeletonCircle,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { debounce } from "lodash"; // remove uniqueId
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import Layout from "../../components/common/layout/layout";
import useDeviceSize from "../../components/common/layout/useDeviceSize";
import SunbirdPlayer from "../../components/players/SunbirdPlayer";
import * as content from "../../services/content";
import IconByName from "../../components/common/icons/Icon";
import { handleEvent } from "./utils";
import Loading from "../../components/common/Loading";
const VITE_PLAYER_URL = import.meta.env.VITE_PLAYER_URL;
const VITE_APP_ID = import.meta.env.VITE_APP_ID;
const VITE_APP_VER = import.meta.env.VITE_APP_VER;
const VITE_APP_PID = import.meta.env.VITE_APP_PID;

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
  const [heightPerItem, setHeightPerItem] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  useEffect(() => {
    setHeightPerItem({ height: 0, width: 0 });
  }, [height]);

  useEffect(() => {
    if (!isVisible) return;
    const inti = async () => {
      setIsLoading(true);
      let resultData = await content.getOne({
        id,
        adapter: "sunbird",
        type: "course",
      });
      if (qml_id) {
        let qmlResult = await content.getOne({
          id: qml_id,
          adapter: "sunbird",
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
        <Box>
          <SunbirdPlayer
            {...{ width, height }}
            _playerStypeHeight={height}
            {...{ ...lesson, iframeId: "course" }}
            userData={{
              firstName: localStorage.getItem("name"),
              lastName: "",
            }}
            public_url={VITE_PLAYER_URL}
            playerContext={{
              sid: localStorage.getItem("contentSessionId"),
              uid: localStorage.getItem("id"),
              did: localStorage.getItem("did"), // send for ifram data
              pdata: {
                // optional
                id: VITE_APP_ID, // Producer ID. For ex: For sunbird it would be "portal" or "genie"
                ver: VITE_APP_VER, // Version of the App
                pid: VITE_APP_PID, // Optional. In case the component is distributed, then which instance of that component
              },
            }}
          />
          {qml_id && (
            <VStack>
              <TopIcon
                onClick={() => {
                  if (heightPerItem?.height === 0) {
                    setHeightPerItem({ height: height / 3, width: width - 31 });
                  } else {
                    setHeightPerItem({ height: 0, width: 0 });
                  }
                }}
                rounded="none"
                roundedLeft="full"
                size="lg"
                _icon={{ width: heightPerItem?.height === 0 ? "100%" : "" }}
                p={heightPerItem?.height === 0 ? "5px 16px" : ""}
                icon={
                  heightPerItem?.height === 0
                    ? "TakeAQuizIcon"
                    : "ChevronRightIcon"
                }
                bg={heightPerItem?.width === 0 ? "white" : "transparent"}
                right={
                  heightPerItem?.width === 0
                    ? "0px"
                    : `${heightPerItem?.width - 32}`
                }
                bottom={
                  heightPerItem?.height === 0
                    ? "32px"
                    : `${heightPerItem?.height - 32}`
                }
                transition="right 0.5s,bottom 0.5s"
                top="auto"
              />
              <SunbirdPlayer
                forwardedRef={isVisible ? refQml : false}
                style={{ border: "none", borderRadius: "16px" }}
                _vstack={{
                  position: "absolute",
                  bottom: "16px",
                  transition: "right 0.5s,width 0.5s, height 0.5s",
                  right: "16px",
                }}
                {...heightPerItem}
                {...{ ...lessonQml, iframeId: "assessment" }}
                userData={{
                  firstName: localStorage.getItem("name"),
                  lastName: "",
                }}
                public_url={VITE_PLAYER_URL}
                playerContext={{
                  sid: localStorage.getItem("contentSessionId"),
                  uid: localStorage.getItem("id"),
                  did: localStorage.getItem("did"), // send for ifram data
                  pdata: {
                    // optional
                    id: VITE_APP_ID, // Producer ID. For ex: For sunbird it would be "portal" or "genie"
                    ver: VITE_APP_VER, // Version of the App
                    pid: VITE_APP_PID, // Optional. In case the component is distributed, then which instance of that component
                  },
                }}
              />
            </VStack>
          )}
        </Box>
      ) : (
        <Stack gap="6" width="100%" height="100%" bg={"blackAlpha.400"}>
          <HStack gap="5" padding={4} justifyContent={"space-between"}>
            <HStack gap="5">
              <SkeletonCircle
                size="8"
                startColor="primary.500"
                endColor="primary.50"
              />
              <SkeletonCircle
                size="8"
                startColor="primary.500"
                endColor="primary.50"
              />
              <SkeletonCircle
                size="8"
                startColor="primary.500"
                endColor="primary.50"
              />
            </HStack>
            <SkeletonCircle
              size="8"
              startColor="primary.500"
              endColor="primary.50"
            />
          </HStack>
          <HStack
            width="full"
            position="absolute"
            justifyContent="end"
            bottom="32px"
          >
            <Skeleton
              height="48px"
              roundedLeft={"full"}
              width={"110px"}
              startColor="primary.500"
              endColor="primary.50"
            />
          </HStack>
        </Stack>
      )}
    </div>
  );
});

const VideoReel: React.FC<{
  videos: any[];
  programID?: string;
  activeIndex?: string | number | undefined | null;
}> = ({ videos, programID, activeIndex }) => {
  const listRef = useRef<any>(null);
  const qmlRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const { height: itemSize, width } = useDeviceSize();
  const navigate = useNavigate();
  // const trackDataRef = useRef<any[]>([]);

  const handleScroll = useCallback(
    debounce(async ({ scrollOffset }: { scrollOffset: number }) => {
      const itemCount = videos.length;
      if (itemCount === 0) return;
      let newVisibleIndex = Math.round(scrollOffset / itemSize);
      if (newVisibleIndex >= 0 && newVisibleIndex !== visibleIndex) {
        setVisibleIndex(newVisibleIndex);
        // call tracking API
        // const telemetryKey = Object.keys(trackDataRef.current);
        // if (telemetryKey?.length > 0) {}
      }
    }, 500),
    [videos, itemSize]
  );

  React.useEffect(() => {
    if (activeIndex || activeIndex === 0) {
      setVisibleIndex(
        typeof activeIndex === "string" ? Number(activeIndex) : activeIndex
      );
      if (listRef?.current && listRef?.current?.scrollToItem) {
        listRef.current.scrollToItem(activeIndex); // Adjust index as needed
      }
    }
  }, [activeIndex, listRef?.current?.scrollToItem]);

  React.useEffect(() => {
    const handleEventNew = (event: any) => {
      newHandleEvent(event);
    };

    window.addEventListener("message", handleEventNew, false);

    return () => {
      window.removeEventListener("message", handleEventNew);
    };
  }, [visibleIndex, videos]);

  const newHandleEvent = async (data: any) => {
    const result = handleEvent(data);
    if (!result || !result?.type) return;
    if (result?.type === "height") {
      const he = itemSize / result?.data;
      if (qmlRef?.current) {
        qmlRef.current.style.height = `${he}px`;
      }
    } else {
      // trackDataRef.current = {
      //   ...trackDataRef.current,
      //   [result.type]: result?.data,
      // };
      const { type, data } = result;
      const player = {
        ...data,
        // courseId: videos?.[visibleIndex]?.contentId,
        // moduleId: videos?.[visibleIndex]?.contentId,
        lessonId:
          type === "assessmet"
            ? videos?.[visibleIndex]?.contentId
            : videos?.[visibleIndex]?.lesson_questionset,
        programId: videos?.[visibleIndex]?.programId,
        subject:
          videos?.[visibleIndex]?.subject || localStorage.getItem("subject"),
      };
      const retult1 = await content.addLessonTracking(player);
      console.log(
        player,
        retult1,
        visibleIndex,
        videos?.[visibleIndex],
        videos,
        "retult"
      );
    }
  };

  if (activeIndex) {
    if (typeof activeIndex === "string") {
      activeIndex = Number(activeIndex);
    }
    if (isNaN(activeIndex) || activeIndex > videos?.length) {
      return (
        <Loading
          message={`Video not found at index ${activeIndex}.`}
          showSpinner={false}
        />
      );
    }
  }
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
  _icon?: any;
  right?: string;
  left?: string;
  zIndex?: string;
  top?: string;
  bottom?: string;
  transition?: string;
  rounded?: string;
  roundedLeft?: string;
  size?: string;
  bg?: string;
  p?: string;
}> = ({ onClick, left, icon, _icon, ...props }) => {
  return (
    <IconButton
      aria-label="Go back"
      icon={
        <IconByName name={icon} boxSize="2rem" color="primary.500" {..._icon} />
      }
      size="mg"
      variant="ghost"
      position="absolute"
      top="16px"
      left={left}
      zIndex="10"
      bg="primary.50"
      rounded={"full"}
      border={"none"}
      _focus={{ boxShadow: "none", outline: "none" }}
      onClick={onClick}
      {...props}
    />
  );
};
