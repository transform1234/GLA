import { CloseIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import { handleEvent } from "../../pages/videos/utils";
import Loading from "../common/Loading";
const VITE_TELEMETRY_BASE_URL = import.meta.env.VITE_TELEMETRY_BASE_URL;
const VITE_TELEMETRY_END_POINT = import.meta.env.VITE_TELEMETRY_END_POINT;
const baseUrl: string = `${import.meta.env.VITE_API_AUTH_URL}/api/v1`;

interface SunbirdPlayerProps {
  public_url: string;
  adapter: string;
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
  batchsize?: number;
  LoaderComponent?: any;
  isAssessment?: boolean;
}

const SunbirdPlayer = ({
  public_url,
  setTrackData,
  handleExitButton,
  width,
  height,
  forwardedRef,
  adapter,
  LoaderComponent,
  isAssessment = false,
  ...props
}: SunbirdPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { mimeType } = props;
  const [url, setUrl] = React.useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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
        forwardedRef.current = ref; // If forwardedRef is an object ref obj
      }
    }
  };

  const handleIFrameLoad = () => {
    setLoading(false);
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
        {LoaderComponent ? (
          <LoaderComponent
            {...(loading ? { display: "flex" } : { display: "none" })}
          />
        ) : (
          <Loading {...(loading ? { display: "flex" } : { display: "none" })} />
        )}

        <iframe
          style={{
            border: "none",
            display: loading ? "none" : "block",
            ...(props?.style || {}),
          }}
          height={"100%"}
          width="100%"
          ref={iframeRef}
          name={JSON.stringify({
            ...props,
            questionListUrl: `${baseUrl}/question/${adapter}/questionList`,
            // questionListUrl: `https://alt-dev.uniteframework.io/course/questionset`,
            // questionListUrl: `https://sunbirdsaas.com/api/question/v1/list`,
            telemetryBaseUrl: VITE_TELEMETRY_BASE_URL || null,
            telemetryEndpoint: VITE_TELEMETRY_END_POINT || null,
          })}
          src={`${public_url || process.env.PUBLIC_URL || ""}${url}/index.html`}
          allow="autoplay"
          onLoad={handleIFrameLoad}
        />
      </VStack>
    );
  } else {
    return (
      <Center
        {...(isAssessment
          ? { mt: "52px", bg: "white", height: height - 52, rounded: "16px" }
          : { height })}
        {...{ width, p: height ? "16px" : "" }}
        {...(props?._vstack || {})}
        ref={setRefs}
      >
        <Alert
          status="error"
          borderRadius="8px"
          boxShadow="md"
          p={4}
          display={height ? "flex" : "none"}
        >
          <AlertIcon />
          <Box>
            <AlertTitle fontSize="14px" fontWeight="bold">
              Something went wrong with ID
            </AlertTitle>
            <AlertDescription fontSize="12px">
              We couldn't process your request. Please check the ID and try
              again.
            </AlertDescription>
          </Box>
        </Alert>
      </Center>
    );
  }
};

export default React.memo(SunbirdPlayer);
