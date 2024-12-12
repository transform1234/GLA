import URL from "../../utils/constants/url-constants.json";
const VITE_TELEMETRY_BASE_URL = import.meta.env.VITE_TELEMETRY_BASE_URL;
const VITE_TELEMETRY_END_POINT = import.meta.env.VITE_TELEMETRY_END_POINT;
import { jwtDecode } from "jwt-decode";

export const fetchToken = async (username: string, password: string) => {
  const authUrl = `${import.meta.env.VITE_API_AUTH_URL}${URL.AUTH}`;

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: "hasura-app",
      username,
      password,
      grant_type: "password",
      client_secret: "9ca6e96d-f72e-4208-91f4-a2d8e681f767",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch token");
  }
  const data = await response.json();
  const tokenDecoded: any = jwtDecode(data.access_token);

  const dataString = JSON.stringify({
    id: "alt.telemetry",
    ver: "3.0",
    ets: Date.now(),
    events: [
      {
        eid: "INTERACT",
        ets: Date.now(),
        ver: "3.0",
        mid: `INTERACT:${tokenDecoded?.sub}`,
        actor: {
          id: tokenDecoded?.sub,
          type: "User",
        },
        context: {
          channel: "0134892941899694081",
          pdata: {
            id: "palooza.portal",
            ver: "5.0.0",
            pid: "palooza-portal",
          },
          env: "public",
          sid: "065866e0-b79d-11ef-b38d-5baa6d826998",
          did: tokenDecoded?.sub,
          cdata: [],
          rollup: {
            l1: "0134892941899694081",
          },
          uid: "anonymous",
        },
        object: {},
        tags: ["0134892941899694081"],
        edata: {
          id: "login",
          type: "click",
          pageid: "login",
        },
      },
    ],
  });

  // const responseTelemetry = await fetch(
  //   `${VITE_TELEMETRY_BASE_URL}${VITE_TELEMETRY_END_POINT}`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${data.access_token}`,
  //     },
  //     body: dataString,
  //   }
  // );

  // if (!responseTelemetry.ok) {
  //   throw new Error("Failed to send telemetry");
  // }
  return data;
};

export const logout = async () => {
  const logoutUrl = `${import.meta.env.VITE_API_AUTH_URL}${URL.LOGOUT}`;
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not available in localStorage");
  }
  const tokenDecoded: any = jwtDecode(token);
  const dataString = JSON.stringify({
    id: "alt.telemetry",
    ver: "3.0",
    ets: Date.now(),
    events: [
      {
        eid: "INTERACT",
        ets: Date.now(),
        ver: "3.0",
        mid: `INTERACT:${tokenDecoded?.sub}`,
        actor: {
          id: tokenDecoded?.sub,
          type: "User",
        },
        context: {
          channel: "0134892941899694081",
          pdata: {
            id: "palooza.portal",
            ver: "5.0.0",
            pid: "palooza-portal",
          },
          env: "public",
          sid: "065866e0-b79d-11ef-b38d-5baa6d826998",
          did: tokenDecoded?.sub,
          cdata: [],
          rollup: {
            l1: "0134892941899694081",
          },
          uid: "anonymous",
        },
        object: {},
        tags: ["0134892941899694081"],
        edata: {
          id: "logout",
          type: "click",
          pageid: "logout",
        },
      },
    ],
  });

  const responseTelemetry = await fetch(
    `${VITE_TELEMETRY_BASE_URL}${VITE_TELEMETRY_END_POINT}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: dataString,
    }
  );

  if (!responseTelemetry.ok) {
    throw new Error("Failed to send telemetry");
  }

  const clientId = "hasura-app"; // Replace with your client ID
  const response = await fetch(logoutUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
    }),
  });

  if (response.ok) {
    console.log("Logout successful");
  } else {
    console.error("Failed to log out:", response.status, await response.text());
  }

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  localStorage.removeItem("token");
  localStorage.removeItem("board");
  localStorage.removeItem("medium");
  localStorage.removeItem("grade");
  localStorage.removeItem("boardId");
  localStorage.removeItem("mediumId");
  localStorage.removeItem("gradeId");
  localStorage.removeItem("boardName");
  localStorage.removeItem("mediumName");
  localStorage.removeItem("gradeName");
  localStorage.removeItem("boardMediumGrade");
};

export const getAuthUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not available in localStorage");
  }

  const userUrl = `${import.meta.env.VITE_API_AUTH_URL}${URL.USER}`;

  const response = await fetch(userUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  return data;
};
