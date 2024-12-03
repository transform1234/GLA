import URL from "../../utils/constants/url-constants.json";

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
  return data;
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
