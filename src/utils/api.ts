import axios from "axios";
import URL from "./constants/url-constants.json";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Base URL for your API
});

const isTokenExpired = (token: string): boolean => {
  const jwtPayload = JSON.parse(atob(token.split(".")[1]));
  const expTime = jwtPayload.exp * 1000;
  return Date.now() > expTime;
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

API.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem("token");
  let refreshToken: any = localStorage.getItem("refreshToken");

  if (accessToken && isTokenExpired(accessToken)) {
    if (refreshToken && isTokenExpired(refreshToken)) {
      window.location.href = "/login";
    } else if (!isTokenExpired(refreshToken)) {
      try {
        refreshToken = await getNewAccessToken();
        const { access_token, refresh_token } = refreshToken;
        localStorage.setItem("token", access_token);
        localStorage.setItem("refreshToken", refresh_token);

      } catch (error) {
        console.error("Token refresh failed. Redirecting to login.");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        throw error;
      }
    }
  }

  if (localStorage.getItem("token")) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 500) {
      console.error("Unauthorized. Redirecting to login.");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
