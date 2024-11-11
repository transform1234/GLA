import { CloseIcon } from "@chakra-ui/icons";
import { IconButton, Text, VStack } from "@chakra-ui/react";
import React, { ReactElement, useRef, useEffect } from "react";
import { Any } from "react-spring";

interface SunbirdPlayerProps {
  public_url: string;
  setTrackData: (data: any) => void;
  width: number;
  height: number;
  mimeType: string;
  userData: {
    firstName: string | null;
    lastName: string | null;
  };
  children?: React.ReactNode[];
  _vstack?: object;
  _playerStypeHeight?: number;
  handleExitButton?: () => void;
  style?: React.CSSProperties;
}

const SunbirdPlayer = ({
  public_url,
  setTrackData,
  handleExitButton,
  width,
  height,
  mimeType,
  ...props
}: SunbirdPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const typeMatch = mimeType?.match(/\/(.+)$/);
  const fileType = typeMatch ? typeMatch[1] : "";
  localStorage.setItem("contentType", fileType);
  let trackData: any[] = [];
  const [url, setUrl] = React.useState<string>("");

  React.useEffect(() => {
    localStorage.removeItem("trackDATA");
  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      // Go to first question directly instead of showing the question set introduction
      setTimeout(() => {
        if (
          iframeRef.current &&
          iframeRef.current.contentWindow &&
          iframeRef.current.contentWindow.location.href.endsWith(
            "quml/index.html"
          )
        ) {
          const playButton: any =
            iframeRef.current.contentWindow.document.querySelector(
              ".quml-navigation__next"
            );
          if (playButton) {
            playButton.click();
            playButton.click();
          }
        }
      }, 700);
    }
  }, [iframeRef.current]);

  React.useEffect(() => {
    if (mimeType === "application/pdf") {
      setUrl(`/pdf`);
    } else if (["video/mp4", "video/webm"].includes(mimeType)) {
      setUrl(`/video`);
    } else if (["application/vnd.sunbird.questionset"].includes(mimeType)) {
      setUrl(`/quml`);
    } else if (
      [
        "application/vnd.ekstep.ecml-archive",
        "application/vnd.ekstep.html-archive",
        "application/vnd.ekstep.content-collection",
        "application/vnd.ekstep.h5p-archive",
        "video/x-youtube",
      ].includes(mimeType)
    ) {
      setUrl(`/content-player`);
    }
  }, [mimeType]);

  React.useEffect(() => {
    if ([`/content-player`, `/quml`, `/pdf`, `/video`].includes(url)) {
      window.addEventListener(
        "message",
        (event) => {
          handleEvent(event);
        },
        false
      );
    }

    return () => {
      if ([`/content-player`, `/quml`, `/pdf`, `/video`].includes(url)) {
        window.removeEventListener("message", (val) => {});
      }
    };
  }, [url]);

  const handleEvent = async (event: any) => {
    const data = event?.data;
    if (["iconUp", "iconDown"].includes(data)) {
      setTrackData(data);
    }
    let milliseconds = event?.data?.edata?.duration;
    const seconds: string = (milliseconds / 1000).toString();
    localStorage.setItem("totalDuration", seconds);
    let telemetry: {
      eid?: string;
      edata?: any;
    } = {};
    if (data && typeof data?.data === "string") {
      telemetry = JSON.parse(data.data);
    } else if (data && typeof data === "string") {
      telemetry = JSON.parse(data);
    } else if (data?.eid) {
      telemetry = data;
    }
    if (telemetry?.eid === "EXDATA") {
      try {
        const edata = JSON.parse(telemetry.edata?.data);
        if (edata?.statement?.result) {
          trackData = [...trackData, edata?.statement];
        }
      } catch (e: unknown) {
        console.log(
          "telemetry format h5p is wrong",
          e instanceof Error ? e.message : String(e)
        );
      }
    }
    if (telemetry?.eid === "ASSESS") {
      const edata = telemetry?.edata;
      if (trackData.find((e) => e?.item?.id === edata?.item?.id)) {
        const filterData = trackData.filter(
          (e) => e?.item?.id !== edata?.item?.id
        );
        trackData = [
          ...filterData,
          {
            ...edata,
            sectionName: React.Children.toArray(props?.children).find(
              (
                child
              ): child is ReactElement<{ identifier: string; name: string }> =>
                React.isValidElement(child) &&
                child.props?.identifier === telemetry?.edata?.item?.sectionId
            )?.props?.name,
          },
        ];
      } else {
        trackData = [
          ...trackData,
          {
            ...edata,
            sectionName: React.Children.toArray(props?.children).find(
              (
                child
              ): child is ReactElement<{ identifier: string; name: string }> =>
                React.isValidElement(child) &&
                child.props?.identifier === telemetry?.edata?.item?.sectionId
            )?.props?.name,
          },
        ];
      }
      // console.log(telemetry, trackData)
      localStorage.setItem("trackDATA", JSON.stringify(trackData));
    } else if (
      telemetry?.eid === "INTERACT" &&
      mimeType === "video/x-youtube"
    ) {
      // const edata = telemetry?.edata
      // trackData = [...trackData, edata]
    } else if (telemetry?.eid === "END") {
      localStorage.setItem("totalDuration", telemetry?.edata?.duration);
      const summaryData = telemetry?.edata;
      if (summaryData?.summary && Array.isArray(summaryData?.summary)) {
        const score = summaryData.summary.find((e: any) => e["score"]);
        if (score?.score) {
          await setTrackData({ score: score?.score, trackData });
        } else {
          setTrackData(telemetry?.edata);
        }
      } else {
        setTrackData(telemetry?.edata);
      }
    } else if (
      telemetry?.eid === "IMPRESSION" &&
      telemetry?.edata?.pageid === "summary_stage_id"
    ) {
      setTrackData(trackData);
    } else if (["INTERACT", "HEARTBEAT"].includes(telemetry?.eid || "")) {
      if (
        telemetry?.edata?.id === "exit" ||
        telemetry?.edata?.type === "EXIT"
      ) {
      }
    }
  };

  if (url) {
    return (
      <VStack {...{ width, height }} {...(props?._vstack || {})}>
        {handleExitButton && (
          <IconButton
            aria-label="Close"
            icon={<CloseIcon />}
            onClick={() => {
              if (mimeType === "application/vnd.ekstep.h5p-archive") {
                handleEvent({
                  data: {
                    eid: "IMPRESSION",
                    edata: { pageid: "summary_stage_id" },
                  },
                });
              }
              handleExitButton();
            }}
            position="absolute"
            zIndex="10"
            right="15px"
            top="-50px"
            size="lg"
            bg="white"
            p="0"
            rounded="full"
          />
        )}
        <iframe
          style={{ border: "none", ...(props?.style || {}) }}
          height={"100%"}
          width="100%"
          ref={iframeRef}
          name={JSON.stringify({
            ...props,
            questionListUrl: "https://sunbirdsaas.com/api/question/v1/list",
            // questionListUrl: `https://alt-dev.uniteframework.io/course/questionset`,
          })}
          src={`${public_url || process.env.PUBLIC_URL || ""}${url}/index.html`}
        />
      </VStack>
    );
  } else {
    return (
      <Text
        {...(props?._vstack || {})}
      >{`${mimeType} this mime type not compatible`}</Text>
    );
  }
};

export default React.memo(SunbirdPlayer);
