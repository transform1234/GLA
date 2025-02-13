import { jwtDecode } from "jwt-decode";
import URL from "../../utils/constants/url-constants.json";
import { getProgramId } from "../home";
import { end, start } from "../telemetry";
import { updateCdataTag } from "../../pages/videos/utils";
const VITE_APP_SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY;

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
  const authUser = await checkUserDetails();
  const { grade, medium, board } =
    authUser?.data?.GroupMemberships?.[0]?.Group || {};
  const { udiseCode } = authUser?.data?.GroupMemberships?.[0]?.School || {};
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

  const dataWithCdata = updateCdataTag(contextData);
  const override = {
    ...dataWithCdata,
    edata: {
      id: "login",
      type: "session",
      pageid: "login",
    },
  };
  const responseTelemetry = await start(override);

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
  const { udiseCode } = authUser?.data?.GroupMemberships?.[0]?.School || {};
  const programID = await getProgramId();
  const contextData = [
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
  const dataWithCdata = updateCdataTag(contextData);
  const override = {
    ...dataWithCdata,
    edata: {
      id: "logout",
      type: "session",
      pageid: "logout",
    },
  };
  const responseTelemetry = await end(override);
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
  localStorage.removeItem("id");
  localStorage.removeItem("name");
  localStorage.removeItem("username");
  localStorage.removeItem("school_udise");
  localStorage.removeItem("program");
  localStorage.removeItem("programID");
  localStorage.removeItem("subject");
  localStorage.removeItem("watchFilter");
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
