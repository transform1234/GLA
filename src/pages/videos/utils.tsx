import React, { ReactElement } from "react";

export const getTrackData = (data: any) => {
  let scoreDetails: any;
  if (
    data?.iframeId === "assessment" &&
    ["iconUp", "iconDown"].includes(data?.action)
  ) {
    const heightPerItem = data?.action === "iconDown" ? 8 : 3;
    return { type: "height", data: heightPerItem };
  } else if (
    ["assessment", "SelfAssess", "QuestionSet", "QuestionSetImage"].includes(
      data.type
    )
  ) {
    scoreDetails = handleTrackData(data, "assessment");
  } else if (["application/vnd.sunbird.questionset"].includes(data.mimeType)) {
    scoreDetails = handleTrackData(data, "questionset");
  } else if (
    [
      "application/pdf",
      "video/mp4",
      "video/webm",
      "video/x-youtube",
      "application/vnd.ekstep.h5p-archive",
    ].includes(data.mimeType) ||
    data.type === "content"
  ) {
    scoreDetails = handleTrackData(data, "pdf-video");
  } else if (["application/vnd.ekstep.ecml-archive"].includes(data.mimeType)) {
    const score = Array.isArray(data)
      ? data.reduce((sum, item) => sum + (item.score || 0), 0)
      : 0;
    scoreDetails = handleTrackData({ ...data, score }, "ecml");
  }
  return { ...scoreDetails, type: data.type, iframeId: data?.iframeId };
};

export const handleTrackData = (
  trackData: any,
  playerType: string = "quml"
) => {
  let data = {};
  let scoreDetails;
  const { mimeType } = trackData;
  const typeMatch = mimeType.match(/\/(.+)$/);
  const fileType = typeMatch ? typeMatch[1] : null;

  if (playerType === "quml") {
    const newFormatData = trackData.reduce((oldData: any, newObj: any) => {
      const dataExist = oldData.findIndex(
        (e: any) => e.sectionId === newObj["item"]["sectionId"]
      );
      if (dataExist >= 0) {
        oldData[dataExist]["data"].push(newObj);
      } else {
        oldData = [
          ...oldData,
          {
            sectionId: newObj["item"]["sectionId"],
            sectionName: newObj["sectionName"] ? newObj["sectionName"] : "",
            data: [newObj],
          },
        ];
      }
      return oldData;
    }, []);
    scoreDetails = JSON.stringify(newFormatData);
    data = {
      status: "completed",
      contentType: fileType,
      timeSpent: trackData?.trackData?.duration,
      score: trackData?.score,
      scoreDetails,
    };
  } else {
    scoreDetails = JSON.stringify(trackData);
    data = {
      status: "completed",
      contentType: fileType,
      timeSpent: trackData?.duration || trackData?.trackData?.duration,
      score: trackData?.score || 0,
      scoreDetails,
    };
  }
  return { data, type: playerType };
};

export const handleEvent = ({ data }: any) => {
  let trackData: any;
  if (["iconUp", "iconDown"].includes(data?.action)) {
    trackData = data;
  }
  let telemetry: {
    iframeId?: string;
    eid?: string;
    edata?: any;
  } = {};
  try {
    if (data && typeof data?.data === "string") {
      telemetry = JSON.parse(data.data);
    } else if (data && typeof data === "string") {
      telemetry = JSON.parse(data);
    } else if (data?.eid) {
      telemetry = data;
    }
  } catch (e) {
    console.log("Error parsing telemetry data", e);
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
    const sectionName = data?.children?.find(
      (e: any) => e?.identifier === telemetry?.edata?.item?.sectionId
    )?.name;

    if (trackData.find((e: any) => e?.item?.id === edata?.item?.id)) {
      const filterData = trackData.filter(
        (e: any) => e?.item?.id !== edata?.item?.id
      );
      trackData = [
        ...filterData,
        {
          ...edata,
          sectionName,
        },
      ];
    } else {
      trackData = [
        ...trackData,
        {
          ...edata,
          sectionName,
        },
      ];
    }
    trackData = { score: edata?.score, trackData };
  } else if (
    telemetry?.eid === "START" &&
    data.mimeType === "video/x-youtube"
  ) {
    const edata = telemetry?.edata;
    trackData = { ...trackData, edata };
  } else if (
    telemetry?.eid === "INTERACT" &&
    data.mimeType === "video/x-youtube"
  ) {
    const edata = telemetry?.edata;
    trackData = { ...trackData, edata };
  } else if (telemetry?.eid === "END") {
    const summaryData = telemetry?.edata;
    if (summaryData?.summary && Array.isArray(summaryData?.summary)) {
      const score = summaryData.summary.find((e: any) => "score" in e);
      if (score?.score || score?.score == 0) {
        trackData = {
          score: score?.score,
          trackData: telemetry?.edata,
          type: "assessmet",
        };
      } else {
        trackData = telemetry?.edata;
      }
    } else {
      trackData = telemetry?.edata;
    }
  } else if (
    telemetry?.eid === "IMPRESSION" &&
    telemetry?.edata?.pageid === "summary_stage_id"
  ) {
    trackData = trackData;
  } else if (["INTERACT", "HEARTBEAT"].includes(telemetry?.eid || "")) {
    if (
      telemetry?.edata?.id === "exit" ||
      telemetry?.edata?.iframeId === "EXIT"
    ) {
      // Handle exit event if needed
      trackData = { type: "exit", score: 0, trackData };
    }
  }

  return getTrackData({
    ...trackData,
    mimeType: data.mimeType,
    iframeId: telemetry?.iframeId,
  });
};
