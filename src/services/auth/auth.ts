import URL from "../../utils/constants/url-constants.json";
import { jwtDecode } from "jwt-decode";
import { uniqueId } from "../utilService"; // generate manually
import { getProgramId } from "../home";
import { end, start } from "../telemetry";
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
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("refreshToken", data.refresh_token);
  localStorage.setItem("contentSessionId", data?.session_state);
  const authUser = await checkUserDetails();
  const { grade, medium, board } =
    authUser?.data?.GroupMemberships?.[0]?.Group || {};
  const { udiseCode } = authUser?.data?.Student?.School || {};
  localStorage.setItem("id", authUser?.data?.userId);
  localStorage.setItem("name", authUser?.data?.name);
  localStorage.setItem("grade", grade);
  localStorage.setItem("medium", medium);
  localStorage.setItem("board", board);
  localStorage.setItem("username", username);
  localStorage.setItem("school_udise", udiseCode);
  const programID = await getProgramId();
  localStorage.setItem("program", programID?.programId);
  const contextData = [
    {
      id: grade,
      type: "grade",
    },
    {
      id: medium,
      type: "medium",
    },
    {
      id: board,
      type: "board",
    },
    {
      id: username,
      type: "username",
    },
    {
      id: udiseCode,
      type: "school_udise",
    },
    {
      id: programID?.programId,
      type: "program",
    },
  ];

  const responseTelemetry = await start({
    uid: tokenDecoded?.sub,
    tags: contextData,
    context: {
      cdata: contextData,
    },
    edata: {
      id: "login",
      type: "session",
      pageid: "login",
    },
  });

  if (!responseTelemetry.ok) {
    throw new Error("Failed to send telemetry");
  }
  return { ...data, authUser: authUser?.data };
};

export const logout = async () => {
  const logoutUrl = `${import.meta.env.VITE_API_AUTH_URL}${URL.LOGOUT}`;
  const token = localStorage.getItem("token");
  const authUser = await checkUserDetails();
  const { grade, medium, board } =
    authUser?.data?.GroupMemberships?.[0]?.Group || {};
  const { udiseCode } = authUser?.data?.Student?.School || {};
  const programID = await getProgramId();
  const contextData = [
    {
      id: grade,
      type: "grade",
    },
    {
      id: medium,
      type: "medium",
    },
    {
      id: board,
      type: "board",
    },
    {
      id: authUser?.data?.username,
      type: "username",
    },
    {
      id: udiseCode,
      type: "school_udise",
    },
    {
      id: programID?.programId,
      type: "program",
    },
  ];
  if (!token) {
    throw new Error("Token not available in localStorage");
  }
  const tokenDecoded: any = jwtDecode(token);
  const responseTelemetry = await end({
    uid: tokenDecoded?.sub,
    tags: contextData,
    context: {
      cdata: contextData,
    },
    edata: {
      id: "logout",
      type: "session",
      pageid: "logout",
    },
  });
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
  localStorage.removeItem("contentSessionId");
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
  localStorage.removeItem("id");
  localStorage.removeItem("name");
  localStorage.removeItem("username");
  localStorage.removeItem("school_udise");
  localStorage.removeItem("program");
  localStorage.removeItem("programID");
  localStorage.removeItem("subject");
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
      if (response.status !== 200) {
        // set != 200 from == 401
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
    return { success: true, token, data: data?.data?.[0] || {} };
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
