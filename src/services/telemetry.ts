import { getSid, uniqueId } from "./utilService"; // generate manually
const VITE_TELEMETRY_BASE_URL = import.meta.env.VITE_TELEMETRY_BASE_URL;
const VITE_TELEMETRY_END_POINT = import.meta.env.VITE_TELEMETRY_END_POINT;
const VITE_APP_SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY;
const VITE_APP_ID = import.meta.env.VITE_APP_ID;
const VITE_APP_VER = import.meta.env.VITE_APP_VER;
const VITE_APP_PID = import.meta.env.VITE_APP_PID;
const VITE_APP_ENV = import.meta.env.VITE_APP_ENV;

import { merge } from "lodash";

const getDefaultStartEvent = (props: Record<string, any> = {}) => {
  const cdataNew = [
    {
      id: localStorage.getItem("grade") || "",
      type: "grade",
    },
    {
      id: localStorage.getItem("medium") || "",
      type: "medium",
    },
    {
      id: localStorage.getItem("board") || "",
      type: "board",
    },
    {
      id: localStorage.getItem("username"),
      type: "username",
    },
    {
      id: localStorage.getItem("school_udise") || "",
      type: "school_udise",
    },
    {
      id: localStorage.getItem("programID") || "",
      type: "program",
    },
  ];
  const defaultEvent = {
    eid: "START",
    ets: Date.now(),
    ver: "3.0",
    mid: `${props.eid || "START"}:${uniqueId()}`,
    actor: {
      id: localStorage.getItem("id") || "",
      type: "User",
    },
    context: {
      channel: "palooza",
      pdata: {
        id: VITE_APP_ID || "palooza.portal",
        ver: VITE_APP_VER || "0.0.1",
        pid: VITE_APP_PID || "palooza.portal.contentplayer",
      },
      env: VITE_APP_ENV,
      sid: getSid(),
      did: localStorage.getItem("did"),
      cdata: cdataNew,
      rollup: {
        l1: "",
      },
      uid: localStorage.getItem("id") || "",
    },
    object: {},
    tags: cdataNew,
    edata: {
      duration: Date.now(),
    },
  };

  // Use Lodash `merge` for deep merging of nested structures
  if (props.uid) {
    defaultEvent.actor.id = props.uid;
    defaultEvent.context.uid = props.uid;
    delete props.uid;
  }

  return {
    id: "palooza.telemetry",
    ver: "3.0",
    ets: Date.now(),
    events: [merge({}, defaultEvent, props)],
  };
};

export const start = async (props: Record<string, any> = {}) => {
  const dataString = JSON.stringify(
    getDefaultStartEvent({ eid: "START", ...props })
  );
  return await commonFetchCall(dataString);
};

export const end = async (props: Record<string, any> = {}) => {
  const dataString = JSON.stringify(
    getDefaultStartEvent({ eid: "END", ...props })
  );
  return await commonFetchCall(dataString);
};

export const search = async (props: Record<string, any> = {}) => {
  const dataString = JSON.stringify(
    getDefaultStartEvent({ eid: "SEARCH", ...props })
  );
  return await commonFetchCall(dataString);
};

export const impression = async (props: Record<string, any> = {}) => {
  const dataString = JSON.stringify(
    getDefaultStartEvent({ eid: "IMPRESSION", ...props })
  );
  return await commonFetchCall(dataString);
};

export const commonFetchCall = async (dataString: string) => {
  return await fetch(`${VITE_TELEMETRY_BASE_URL}${VITE_TELEMETRY_END_POINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: dataString,
  });
};

export const callBatch = async (dataString: Array<any>) => {
  return await commonFetchCall(
    JSON.stringify({
      id: "palooza.telemetry",
      ver: "3.0",
      ets: Date.now(),
      events: dataString,
    })
  );
};
