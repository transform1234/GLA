import { CloseIcon } from "@chakra-ui/icons";
import { IconButton, Text, VStack } from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
import { handleEvent } from "../../pages/videos/utils";
const VITE_TELEMETRY_BASE_URL = import.meta.env.VITE_TELEMETRY_BASE_URL;
const VITE_TELEMETRY_END_POINT = import.meta.env.VITE_TELEMETRY_END_POINT;

interface SunbirdPlayerProps {
  public_url: string;
  forwardedRef?: any;
  setTrackData?: (data: any) => void;
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
  playerContext?: object;
}

const SunbirdPlayer = ({
  public_url,
  setTrackData,
  handleExitButton,
  width,
  height,
  forwardedRef,
  ...props
}: SunbirdPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { mimeType } = props;
  const typeMatch = mimeType?.match(/\/(.+)$/);
  const fileType = typeMatch ? typeMatch[1] : "";
  let trackData: any[] = [];
  const [url, setUrl] = React.useState<string>("");

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
    if (
      [`/content-player`, `/quml`, `/pdf`, `/video`].includes(url) &&
      setTrackData
    ) {
      window.addEventListener(
        "message",
        (event) => {
          handleEvent(event);
        },
        false
      );
    }

    return () => {
      if (
        [`/content-player`, `/quml`, `/pdf`, `/video`].includes(url) &&
        setTrackData
      ) {
        window.removeEventListener("message", (val) => {});
      }
    };
  }, [url]);

  const setRefs = (ref: HTMLIFrameElement | null) => {
    if (forwardedRef) {
      if (typeof forwardedRef === "function") {
        forwardedRef(ref); // If forwardedRef is a function
      } else {
        forwardedRef.current = ref; // If forwardedRef is an object ref
      }
    }
  };

  if (url) {
    return (
      <VStack {...{ width, height }} {...(props?._vstack || {})} ref={setRefs}>
        {handleExitButton && (
          <IconButton
            aria-label="Close"
            icon={<CloseIcon />}
            onClick={() => {
              if (
                mimeType === "application/vnd.ekstep.h5p-archive" &&
                setTrackData
              ) {
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
            telemetryBaseUrl: VITE_TELEMETRY_BASE_URL || null,
            telemetryEndpoint: VITE_TELEMETRY_END_POINT || null,
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
