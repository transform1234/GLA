import { CloseIcon } from "@chakra-ui/icons";
import { IconButton, Text, VStack } from "@chakra-ui/react";
import React from "react";

const SunbirdPlayer = ({
  public_url,
  setTrackData,
  handleExitButton,
  width,
  height,
  ...props
}) => {
  const { mimeType } = props;
  const typeMatch = mimeType?.match(/\/(.+)$/);
  const fileType = typeMatch ? typeMatch[1] : null;
  localStorage.setItem("contentType", fileType);
  let trackData = [];
  const [url, setUrl] = React.useState<string>();

  React.useEffect(() => {
    localStorage.removeItem("trackDATA");
  }, []);

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

  const handleEvent = async (event) => {
    const data = event?.data;
    let milliseconds = event?.data?.edata?.duration;
    let seconds = milliseconds / 1000;
    localStorage.setItem("totalDuration", seconds);
    let telemetry = {};
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
      } catch (e) {
        console.log("telemetry format h5p is wrong", e.message);
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
            sectionName: props?.children?.find(
              (e) => e?.identifier === telemetry?.edata?.item?.sectionId
            )?.name,
          },
        ];
      } else {
        trackData = [
          ...trackData,
          {
            ...edata,
            sectionName: props?.children?.find(
              (e) => e?.identifier === telemetry?.edata?.item?.sectionId
            )?.name,
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
        const score = summaryData.summary.find((e) => e["score"]);
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
    } else if (["INTERACT", "HEARTBEAT"].includes(telemetry?.eid)) {
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
          style={{ border: "none" }}
          id="preview"
          height={"100%"}
          width="100%"
          name={JSON.stringify({
            ...props,
            questionListUrl: "https://sunbirdsaas.com/api/question/v1/list",
            // questionListUrl: `${process.env.REACT_APP_API_URL}/course/questionset`
          })}
          src={`${public_url ? public_url : process.env.PUBLIC_URL}${url}`}
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
