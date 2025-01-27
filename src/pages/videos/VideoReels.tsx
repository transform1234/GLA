import { Alert, AlertIcon, AlertTitle, Box, Center } from "@chakra-ui/react";
import { debounce } from "lodash"; // remove uniqueId
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import CoinPopover from "../../components/common/cards/CoinPopover";
import Layout from "../../components/common/layout/layout";
import useDeviceSize from "../../components/common/layout/useDeviceSize";
import Loading from "../../components/common/Loading";
import * as content from "../../services/content";
import { callBatch } from "../../services/telemetry";
import { customLog, handleEvent, updateCdataTag } from "./utils";
import AssessmentPlayer from "./videoReelComponent/AssessmentPlayer";
import ContentPlayer from "./videoReelComponent/ContentPlayer";
import CustomSkeleton from "./videoReelComponent/CustomSkeleton";
import { TopIcon } from "./videoReelComponent/TopIcon";
import VideoItem from "./videoReelComponent/VideoItem";
const TELEMETRYBATCH = import.meta.env.VITE_TELEMETRYBATCH || 20;

/*
Comment telemetry in all Sunbird players; to undo, find this function and uncomment.
TelemetrySyncManager.syncFailedBatch();
TelemetrySyncManager.syncEvents()
this.sendTelemetry(e)
*/

const VideoReel: React.FC<{
  videos: any[];
  programID?: string;
  authUser: any;
  activeIndex?: string | number | undefined | null;
}> = ({ videos, programID, authUser, activeIndex }) => {
  const query = new URLSearchParams(window.location.search);
  const redirect = query.get("redirect");
  const listRef = useRef<any>(null);
  const qmlRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const { height: itemSize, width } = useDeviceSize();
  const telemetryListRef = useRef<any[]>([]);
  const navigate = useNavigate();
  const [isIndexScroll, setIsIndexScroll] = useState(false);

  const handleScroll = useCallback(
    debounce(async ({ scrollOffset }: { scrollOffset: number }) => {
      const itemCount = videos.length;
      if (itemCount === 0) return;
      let newVisibleIndex = Math.round(scrollOffset / itemSize);
      if (newVisibleIndex >= 0 && newVisibleIndex !== visibleIndex) {
        setVisibleIndex(newVisibleIndex);
        // call tracking API here
        if (isIndexScroll) {
          await callReaminigTelemetry(
            telemetryListRef?.current || [],
            "call telemetry api remaining on scroll"
          );
          telemetryListRef.current = [];
          const queryParams = new URLSearchParams(location.search);
          queryParams.set("index", String(newVisibleIndex));
          navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`,
          });
        }
      }
    }, 500),
    [videos, itemSize, visibleIndex]
  );

  React.useEffect(() => {
    if (activeIndex || activeIndex === 0) {
      setVisibleIndex(
        typeof activeIndex === "string" ? Number(activeIndex) : activeIndex
      );

      if (listRef?.current && listRef?.current?.scrollToItem) {
        listRef.current.scrollToItem(activeIndex);
        setIsIndexScroll(true);
      }
    } else {
      setIsIndexScroll(true);
    }
  }, [activeIndex, listRef?.current?.scrollToItem, videos.length]);

  const callReaminigTelemetry = async (
    data: any[],
    message: string | undefined
  ) => {
    if (data.length > 0) {
      await callBatch(data);
      customLog(message || "call telemetry api remaining", data);
    }
  };
  React.useEffect(() => {
    const handleEventNew = (event: any) => {
      newHandleEvent(event);
    };

    window.addEventListener("message", handleEventNew, false);

    return () => {
      window.removeEventListener("message", handleEventNew);
    };
  }, [visibleIndex, videos?.length]);

  const newHandleEvent = async (data: any) => {
    const result = handleEvent(data);
    if (
      data?.data?.iframeId &&
      telemetryListRef.current.length < TELEMETRYBATCH
    ) {
      telemetryListRef.current = [...telemetryListRef.current, data?.data];
      customLog(
        telemetryListRef.current,
        "telemetryListRef.current",
        data?.data?.iframeId &&
          telemetryListRef.current.length >= TELEMETRYBATCH
      );
    }
    if (
      data?.data?.iframeId &&
      telemetryListRef.current.length >= TELEMETRYBATCH
    ) {
      await callReaminigTelemetry(
        telemetryListRef?.current || [],
        "Call the telemetry API based on batch length"
      );
      telemetryListRef.current = [];
    }

    if (!result || !result?.type) return;
    if (result?.type === "height") {
      const he = itemSize / result?.data;
      if (qmlRef?.current) {
        qmlRef.current.style.height = `${he}px`;
      }
    } else {
      const { iframeId, data } = result;
      const player = {
        ...data,
        // courseId: videos?.[visibleIndex]?.contentId,
        // moduleId: videos?.[visibleIndex]?.contentId,
        lessonId:
          iframeId === "assessment"
            ? videos?.[visibleIndex]?.lesson_questionset
            : videos?.[visibleIndex]?.contentId,
        programId: programID,
        subject:
          videos?.[visibleIndex]?.subject || localStorage.getItem("subject"),
      };
      const retult1 = await content.addLessonTracking(player);
      if (retult1?.errorCode) {
        const ratingText = document.querySelector("#rating-text");
        const quizTitle = document.querySelector("#quiz-title");
        const quizSubTitle = document.querySelector("#quiz-subtitle");
        if (ratingText) {
          (ratingText as HTMLElement).style.setProperty(
            "display",
            "block",
            "important"
          );
        }
        (
          quizSubTitle as HTMLElement
        ).innerHTML = `<span style="color:red">Error:- ${retult1?.errorCode}</span>`;
        (
          quizTitle as HTMLElement
        ).innerHTML = `<span style="color:red">Error:- Someting went wrong</span>`;
        (
          ratingText as HTMLElement
        ).innerHTML = `<span style="color:red">Error:- ${
          retult1?.errorMessage?.errorMessage || retult1?.errorMessage
        }</span>`;
      } else if (iframeId === "assessment" && retult1) {
        if (retult1?.assignRewardPoints?.lesson_completion) {
          const ratingPoint = document.querySelector("#rating-point");
          const ratingText = document.querySelector("#rating-text");
          if (ratingPoint && ratingText) {
            (
              ratingPoint as HTMLElement
            ).innerHTML = `${retult1?.assignRewardPoints?.lesson_completion?.points}`;
            (ratingText as HTMLElement).style.setProperty(
              "display",
              "block",
              "important"
            );
          }
        }
        const ratingBox = document.querySelector("#rating-box");
        if (ratingBox) {
          (ratingBox as HTMLElement).style.setProperty(
            "display",
            "flex",
            "important"
          );
        }
      }
      await callReaminigTelemetry(
        telemetryListRef?.current || [],
        "call telemetry api remaining before tracking"
      );
      telemetryListRef.current = [];
      console.log("result1", videos?.[visibleIndex], player, result, retult1);
    }
  };

  if (activeIndex) {
    if (typeof activeIndex === "string") {
      activeIndex = Number(activeIndex);
    }
    if (
      isNaN(activeIndex) ||
      (activeIndex > videos?.length && videos?.length > 0)
    ) {
      return (
        <Loading
          message={`Video not found at index ${activeIndex}.`}
          showSpinner={false}
        />
      );
    }
  }

  const handleBack = async () => {
    await callReaminigTelemetry(
      telemetryListRef?.current || [],
      "call telemetry api remaining on back"
    );
    telemetryListRef.current = [];
    redirect ? navigate(redirect) : navigate("/");
  };

  return (
    <Layout isFooterVisible={false} isHeaderVisible={false}>
      <Box position={"relative"}>
        <TopIcon
          onClick={handleBack}
          icon={"ChevronLeftIcon"}
          left="16px"
          _hover={{ bg: "#FFFFFF26" }}
          _active={{ bg: "#FFFFFF26" }}
        />
        {authUser?.points && (
          <CoinPopover
            points={authUser?.points}
            _hstack={{
              position: "absolute",
              top: "16px",
              right: "64px",
              zIndex: "20",
            }}
          />
        )}

        <LikeButton
          playerPayload={{
            programId: programID,
            subject:
              videos?.[visibleIndex]?.subject ||
              localStorage.getItem("subject"),
            contentId: videos?.[visibleIndex]?.contentId,
            userId: authUser?.userId,
          }}
        />
        <List
          overscanCount={1}
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
            scrollSnapStop: "always",
            scrollBehavior: "smooth",
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
              programID={programID}
              id={videos?.[index]?.contentId}
              qml_id={videos?.[index]?.lesson_questionset}
              isVisible={isIndexScroll && index === visibleIndex}
              refQml={qmlRef}
              style={style}
              adapter={videos?.[index]?.contentSource}
              key={"VideoItem" + index}
              authUser={authUser}
              thumbnailUrl={videos?.[index]?.thumbnailUrl}
            />
          )}
        </List>
      </Box>
    </Layout>
  );
};

export default VideoReel;

const LikeButton: React.FC<any> = ({ playerPayload }) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!playerPayload?.programId) return;
      try {
        if (playerPayload?.contentId) {
          const response = await content.isContentLiked(playerPayload);
          if (response && response[0]?.like !== undefined) {
            setIsLiked(response[0]?.like || false);
          }
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [playerPayload]);

  const handleLikeToggle = async () => {
    try {
      const likeStatus = !isLiked;
      const payloadWithLikeStatus = {
        ...playerPayload,
        like: likeStatus,
      };
      await content.contentLike(payloadWithLikeStatus);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like status:", error);
    }
  };

  return (
    <TopIcon
      onClick={handleLikeToggle}
      icon={!isLiked ? "ThumbsUpIconFilled" : "ThumbsUpIcon"}
      right="16px"
      _hover={{ bg: "#FFFFFF26" }}
      _active={{ bg: "#FFFFFF26" }}
    />
  );
};
