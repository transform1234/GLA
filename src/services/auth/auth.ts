import URL from "../../utils/constants/url-constants.json";
import { jwtDecode } from "jwt-decode";
import { uniqueId } from "../utilService"; // generate manually
const VITE_TELEMETRY_BASE_URL = import.meta.env.VITE_TELEMETRY_BASE_URL;
const VITE_TELEMETRY_END_POINT = import.meta.env.VITE_TELEMETRY_END_POINT;
const VITE_APP_SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY;
const VITE_APP_ID = import.meta.env.VITE_APP_ID;
const VITE_APP_VER = import.meta.env.VITE_APP_VER;
const VITE_APP_PID = import.meta.env.VITE_APP_PID;
const VITE_APP_ENV = import.meta.env.VITE_APP_ENV;

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
      client_secret: VITE_APP_SECRET_KEY,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch token");
  }
  const data = await response.json();
  const tokenDecoded: any = jwtDecode(data.access_token);
  localStorage.setItem("contentSessionId", data?.session_state);

  const dataString = JSON.stringify({
    id: "palooza.telemetry",
    ver: "3.0",
    ets: Date.now(),
    events: [
      {
        eid: "START",
        ets: Date.now(),
        ver: "3.0",
        mid: `START:${uniqueId()}`,
        actor: {
          id: tokenDecoded?.sub,
          type: "User",
        },
        context: {
          channel: "palooza",
          pdata: {
            id: VITE_APP_ID || "palooza.portal", // Producer ID. For ex: For sunbird it would be "portal" or "genie"
            ver: VITE_APP_VER || "0.0.1", // version of the App
            pid: VITE_APP_PID || "palooza.portal.contentplayer", //
          },
          env: VITE_APP_ENV,
          sid: localStorage.getItem("contentSessionId"),
          did: localStorage.getItem("did"),
          cdata: [],
          rollup: {
            l1: "0134892941899694081",
          },
          uid: tokenDecoded?.sub,
        },
        object: {},
        tags: ["0134892941899694081"],
        edata: {
          id: "login",
          type: "session",
          pageid: "login",
          duration: new Date().getTime(), // Optional. Time taken to initialize/start
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
        Authorization: `Bearer ${data.access_token}`,
      },
      body: dataString,
    }
  );

  if (!responseTelemetry.ok) {
    throw new Error("Failed to send telemetry");
  }
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
    id: "palooza.telemetry",
    ver: "3.0",
    ets: Date.now(),
    events: [
      {
        eid: "END",
        ets: Date.now(),
        ver: "3.0",
        mid: `END:${uniqueId()}`,
        actor: {
          id: tokenDecoded?.sub,
          type: "User",
        },
        context: {
          channel: "palooza",
          pdata: {
            id: VITE_APP_ID || "palooza.portal", // Producer ID. For ex: For sunbird it would be "portal" or "genie"
            ver: VITE_APP_VER || "0.0.1", // version of the App
            pid: VITE_APP_PID || "palooza.portal.contentplayer", //
          },
          env: VITE_APP_ENV,
          sid: localStorage.getItem("contentSessionId"),
          did: tokenDecoded?.sub,
          cdata: [],
          rollup: {
            l1: "",
          },
          uid: tokenDecoded?.sub,
        },
        object: {},
        tags: [""],
        edata: {
          id: "logout",
          type: "session",
          pageid: "logout",
          duration: new Date().getTime(), // Optional. Time taken to initialize/start
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
      Authorization: `Bearer ${token}`,
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: VITE_APP_SECRET_KEY,
      refresh_token: localStorage.getItem("refreshToken") || "",
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
  localStorage.removeItem("refreshToken"); // add
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
export const checkUserDetails = async () => {
  try {
    const userUrl = `${import.meta.env.VITE_API_AUTH_URL}${
      URL.USER_VALIDATION
    }`;
    const token = localStorage.getItem("token");

    if (!token) {
      return { success: false, token: null };
    }

    const response = await fetch(userUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        try {
          let refreshToken = await getNewAccessToken();
          const { access_token, refresh_token } = refreshToken;

          const retryResponse = await fetch(userUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (!retryResponse.ok) {
            return {
              success: false,
              token: null,
            };
          } else {
            localStorage.setItem("token", access_token);
            localStorage.setItem("refreshToken", refresh_token);
            return {
              success: true,
              token: access_token,
              isRefresh: true,
            };
          }
          // const retryData = await retryResponse.json();
          // return { success: true, data: retryData };
        } catch (error) {
          console.error("Error refreshing token:", error);
          return {
            success: false,
            token: null,
          };
        }
      } else {
        const errorText = await response.text();
        console.error("Error validating user details:", errorText);
        return {
          success: false,
          token: null,
        };
      }
    }

    const data = await response.json();
    return { success: true, token };
  } catch (error: unknown) {
    return {
      success: false,
      token: null,
    };
  }
};

export const getNewAccessToken = async () => {
  const authUrl = `${import.meta.env.VITE_API_AUTH_URL}${URL.AUTH}`;
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found in localStorage.");
  }

  try {
    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_id=hasura-app&refresh_token=${refreshToken}&grant_type=refresh_token&client_secret=${
        import.meta.env.VITE_APP_SECRET_KEY
      }`,
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};
