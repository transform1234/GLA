import URL from "../utils/constants/url-constants.json";
import API from "../utils/api"


export const fetchToken = async (username: string, password: string) => {
  const authUrl = `${import.meta.env.VITE_API_AUTH_URL}${URL.AUTH}`;

  try {
    const response = await API.post(authUrl, new URLSearchParams({
      client_id: "hasura-app",
      username,
      password,
      grant_type: "password",
      client_secret: "9ca6e96d-f72e-4208-91f4-a2d8e681f767",
    }));

    return response.data; // Axios automatically parses JSON.
  } catch (error) {
    console.error("Failed to fetch token:", error);
    throw new Error("Failed to fetch token");
  }
};


export const getAuthUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not available in localStorage");
  }

  const userUrl = `${import.meta.env.VITE_API_AUTH_URL}${URL.USER}`;

  try {
    const response = await API.get(userUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data; // Axios automatically parses JSON.
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data");
  }
};
