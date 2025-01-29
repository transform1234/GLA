import { Alert, AlertIcon, AlertTitle, Box, Center } from "@chakra-ui/react";
import React, { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useDeviceSize from "../../../components/common/layout/useDeviceSize";
import * as content from "../../../services/content";
import { handleEvent, updateCdataTag } from "../utils";
import AssessmentPlayer from "./AssessmentPlayer";
import ContentPlayer from "./ContentPlayer";
import CustomSkeleton from "./CustomSkeleton";
import VideoEnd from "./VideoEnd";

const VideoItem: React.FC<{
  programID: string | undefined;
  id: string;
  qml_id: string;
  isVisible: boolean;
  style: React.CSSProperties;
  refQml?: any;
  adapter: string;
  authUser?: any;
  thumbnailUrl?: string;
}> = memo(
  ({
    id,
    qml_id,
    isVisible,
    adapter,
    programID,
    authUser,
    refQml,
    style,
    thumbnailUrl,
  }) => {
    const { t } = useTranslation();
    const [videoEndId, setVideoEndId] = useState<any>({});
    const [videoReelIntro, setVideoReelIntro] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isQUMLLoading, setIsQUMLLoading] = useState<boolean>(false);
    const [playerContext, setPlayerContext] = useState<any>({});
    const { width, height } = useDeviceSize();
    const [lesson, setLesson] = useState<{ mimeType: string }>({
      mimeType: "",
    });
    const [lessonQml, setLessonQml] = useState<{
      mimeType: string;
      subject?: string | [];
    }>({ mimeType: "" });
    const [heightPerItem, setHeightPerItem] = useState<{
      width: number;
      height: number;
    }>({ width: 0, height: 0 });
    const handleVideoIntro = (e: boolean) => {
      setVideoReelIntro(e);
      localStorage.setItem("videoReelIntro", "true");
    };
    useEffect(() => {
      setHeightPerItem({ height: 0, width: 0 });
    }, [height]);

    useEffect(() => {
      if (!isVisible) return;
      const inti = async () => {
        console.log(!localStorage.getItem("videoReelIntro"));
        setVideoReelIntro(!localStorage.getItem("videoReelIntro"));
        setIsLoading(true);
        if (adapter) {
          let resultData = await content.getOne({
            id,
            adapter,
            type: "course",
          });
          if (qml_id) {
            let qmlResult = await content.getOne({
              id: qml_id,
              adapter,
              type: "assessment",
            });
            setLessonQml(qmlResult);
          }
          setPlayerContext(
            updateCdataTag([
              {
                id: programID,
                type: "program",
              },
              {
                id: authUser?.GroupMemberships?.[0]?.School?.udiseCode,
                type: "school_udise",
              },
              {
                id: authUser?.username,
                type: "username",
              },
              {
                id: adapter,
                type: "contentSource",
              },
            ])
          );
          setLesson(resultData);
          setIsLoading(false);
        }
      };
      inti();
    }, [id, isVisible, !localStorage.getItem("videoReelIntro"), qml_id]);

    useEffect(() => {
      const newHandleEvent = async (data: any) => {
        const result = handleEvent(data);
        if (!result || !result?.type) return;
        if (result.iframeId === "assessment") {
          setVideoEndId((old: any) => ({ ...old, qml_id }));
        } else if (result.iframeId === "course") {
          setVideoEndId((old: any) => ({ ...old, id }));
        }
      };
      const handleEventNewItem = (event: any) => {
        newHandleEvent(event);
      };

      window.addEventListener("message", handleEventNewItem, false);

      return () => {
        window.removeEventListener("message", handleEventNewItem);
      };
    }, []);

    return (
      <div
        style={{
          ...style,
          width: "100%",
          height: "100%",
          scrollSnapAlign: "start",
        }}
      >
        {!["sunbird", "diksha"].includes(adapter) ? (
          <Center height="100%" p={4}>
            <Alert status="error" variant="solid">
              <AlertIcon />
              <AlertTitle>
                {t(
                  `This (${
                    adapter || "Unknown Source"
                  }) content source is not supported, expected source is Diksha and Sunbird`
                )}
              </AlertTitle>
            </Alert>
          </Center>
        ) : videoReelIntro ? (
          <VideoEnd
            {...{ width, height, thumbnailUrl }}
            isIntro
            setVideoEndId={handleVideoIntro}
          />
        ) : isVisible && !isLoading ? (
          <Box>
            <ContentPlayer
              {...{
                video_id: videoEndId?.id || "",
                lesson,
                thumbnailUrl,
                qml_id,
                videoEndId,
                setVideoEndId,
                width,
                height,
                adapter,
              }}
            />
            <AssessmentPlayer
              {...{
                qml_id,
                videoEndId,
                lessonQml,
                heightPerItem,
                setHeightPerItem,
                isQUMLLoading,
                setIsQUMLLoading,
                isVisible,
                refQml,
                programID: programID || "",
                authUser,
                updateCdataTag,
                playerContext,
                adapter,
                height,
                width,
              }}
            />
          </Box>
        ) : (
          <CustomSkeleton />
        )}
      </div>
    );
  }
);

export default VideoItem;
